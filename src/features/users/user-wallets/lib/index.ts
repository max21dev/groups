import NDK, { NDKEvent, NDKPrivateKeySigner, NDKSubscription } from '@nostr-dev-kit/ndk';
import { getPublicKey, nip04 } from 'nostr-tools';

import { hexToUint8Array } from '@/shared/utils';

export type NWCRequest = {
  method: string;
  params: Record<string, any>;
};

export type NWCResponse = {
  result_type: string;
  error: { code: string; message: string } | null;
  result: Record<string, any> | null;
};

export class NWCClient {
  private static readonly REQUEST_TIMEOUT_MS = 30_000;

  private ndk: NDK;
  private servicePublicKey: string;
  private clientSecretKey: string;
  private clientPublicKey: string;
  private connected = false;

  constructor(connectionUri: string) {
    const parsed = this.parseNWCUri(connectionUri);
    if (!parsed) throw new Error('Invalid NWC URI');

    const { pubkey, relays, secret } = parsed;
    this.servicePublicKey = pubkey;
    this.clientSecretKey = secret;
    this.clientPublicKey = getPublicKey(hexToUint8Array(secret));

    this.ndk = new NDK({
      explicitRelayUrls: relays,
      signer: new NDKPrivateKeySigner(secret),
    });
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    await this.ndk.connect();
    this.connected = true;
  }

  async getInfo(): Promise<any> {
    return this.sendRequest({ method: 'get_info', params: {} });
  }

  async getBalance(): Promise<any> {
    return this.sendRequest({ method: 'get_balance', params: {} });
  }

  async makeInvoice(amount: number, description?: string): Promise<any> {
    return this.sendRequest({ method: 'make_invoice', params: { amount, description } });
  }

  async payInvoice(invoice: string, amount?: number): Promise<any> {
    return this.sendRequest({
      method: 'pay_invoice',
      params: { invoice, ...(amount ? { amount } : {}) },
    });
  }

  async listTransactions(
    params: {
      limit?: number;
      offset?: number;
      from?: number;
      until?: number;
      unpaid?: boolean;
      type?: 'incoming' | 'outgoing';
    } = {},
  ): Promise<any> {
    return this.sendRequest({ method: 'list_transactions', params });
  }

  private async sendRequest(request: NWCRequest): Promise<any> {
    if (!this.connected) {
      await this.connect();
    }

    const { event, requestId } = await this.encryptEvent(request);

    const sub = this.ndk.subscribe(
      { kinds: [23195], '#e': [requestId], authors: [this.servicePublicKey] },
      { closeOnEose: false },
    );
    await new Promise<void>((resolve) => sub.on('eose', () => resolve()));

    await event.publish();
    return this.awaitResponse(sub);
  }

  private async encryptEvent(request: NWCRequest): Promise<{ event: NDKEvent; requestId: string }> {
    const event = new NDKEvent(this.ndk);
    event.kind = 23194;
    event.tags = [['p', this.servicePublicKey]];
    event.content = await nip04.encrypt(
      this.clientSecretKey,
      this.servicePublicKey,
      JSON.stringify(request),
    );
    await event.sign();
    return { event, requestId: event.id! };
  }

  private async awaitResponse(sub: NDKSubscription): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        sub.stop();
        reject(new Error('timeout'));
      }, NWCClient.REQUEST_TIMEOUT_MS);

      sub.on('event', async (resp) => {
        clearTimeout(timer);
        sub.stop();
        try {
          const dec = await nip04.decrypt(
            this.clientSecretKey,
            this.servicePublicKey,
            resp.content,
          );
          const parsed = JSON.parse(dec) as NWCResponse;
          parsed.error ? reject(new Error(parsed.error.message)) : resolve(parsed.result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private parseNWCUri(uri: string): { pubkey: string; relays: string[]; secret: string } | null {
    try {
      if (!uri.startsWith('nostr+walletconnect://')) return null;
      const url = new URL(uri);
      const pubkey = url.hostname;
      const relays = url.searchParams.getAll('relay');
      const secret = url.searchParams.get('secret');
      if (!relays.length || !secret) return null;
      return { pubkey, relays, secret };
    } catch {
      return null;
    }
  }
}
