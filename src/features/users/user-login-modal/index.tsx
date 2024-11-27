import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Muted } from '@/shared/components/ui/typography/muted';

import { useLoginModal } from './hooks';

export const UserLoginModal = () => {
  const {
    loading,
    nip46Input,
    setNip46Input,
    nsecInput,
    setNsecInput,
    handleRemoteSigner,
    handleExtensionSigner,
    handlePrivateKeySigner,
    handlePrivateKeyGenerate,
    isLoginModalOpen,
    setIsLoginModalOpen,
  } = useLoginModal();

  return (
    <>
      <Dialog open={isLoginModalOpen} onOpenChange={(open) => setIsLoginModalOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="remote-signer" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="extension" className="w-full">
                Extension
              </TabsTrigger>

              <TabsTrigger value="remote-signer" className="w-full">
                Remote Signer
              </TabsTrigger>

              <TabsTrigger value="secret-key" className="w-full">
                Secret Key
              </TabsTrigger>
            </TabsList>

            <div className="pt-2">
              <TabsContent value="extension" tabIndex={-1}>
                <div className="mt-4" />

                <Button className="w-full" disabled={loading} onClick={handleExtensionSigner}>
                  {loading ? <Loader2 className="animate-spin" /> : `Login With Extension`}
                </Button>

                <div className="mt-2 text-center">
                  <Muted>
                    <span>Don't have an extension yet?</span>
                    <br />
                    <span>Get yours from </span>
                    <Button variant="link" className="p-0 text-blue-600" asChild>
                      <a
                        href="https://github.com/fiatjaf/nos2x"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Nos2x
                      </a>
                    </Button>
                    {' or '}
                    <Button variant="link" className="p-0 text-blue-600" asChild>
                      <a href="https://getalby.com" target="_blank" rel="noopener noreferrer">
                        Alby
                      </a>
                    </Button>
                  </Muted>
                </div>
              </TabsContent>

              <TabsContent value="remote-signer" tabIndex={-1}>
                <Label>Your NIP-05 address:</Label>

                <Input
                  className="mt-2"
                  placeholder="you@nsec.app"
                  value={nip46Input}
                  onChange={(e) => setNip46Input(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRemoteSigner()}
                />

                <Button className="mt-4 w-full" disabled={loading} onClick={handleRemoteSigner}>
                  {loading ? <Loader2 className="animate-spin" /> : `Login With Remote Signer`}
                </Button>

                <div className="mt-2 text-center">
                  <Muted>
                    <span>Don't have a remote signer yet?</span>
                    <br />
                    <span>Set up yours at </span>
                    <Button variant="link" className="p-0 text-blue-600" asChild>
                      <a href="https://nsec.app" target="_blank" rel="noopener noreferrer">
                        nsec.app
                      </a>
                    </Button>
                  </Muted>
                </div>
              </TabsContent>

              <TabsContent value="secret-key" tabIndex={-1}>
                <Label>Your Secret Key:</Label>

                <Input
                  className="mt-2"
                  placeholder="nsec..."
                  value={nsecInput}
                  onChange={(e) => setNsecInput(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && handlePrivateKeySigner()}
                />

                <Button className="mt-4 w-full" disabled={loading} onClick={handlePrivateKeySigner}>
                  {loading ? <Loader2 className="animate-spin" /> : `Login With Secret Key`}
                </Button>

                <div className="mt-2 text-center">
                  <Muted>
                    <span>Don't have a secret key yet?</span>
                    <br />
                    <Button
                      variant="link"
                      className="p-0 text-blue-600"
                      onClick={handlePrivateKeyGenerate}
                    >
                      Generate a new secret key
                    </Button>
                  </Muted>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
