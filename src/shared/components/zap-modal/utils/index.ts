export const payInvoiceByWebln = async (invoice: string): Promise<boolean> => {
  // Define the WebLN type locally
  type WeblnType = {
    enable: () => Promise<void>;
    sendPayment: (invoice: string) => Promise<void>;
  };

  // Use type assertion to safely access window.webln
  const webln = (window as { webln?: WeblnType }).webln;

  if (webln) {
    try {
      await webln.enable();

      try {
        await webln.sendPayment(invoice);
        return true;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  } else {
    return false;
  }
};

export const safeParsePubkey = (code: string): string => {
  try {
    return new URL(code).hostname;
  } catch {
    return '';
  }
};
