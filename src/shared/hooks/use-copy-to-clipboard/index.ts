import { useState, useEffect } from 'react';

export const useCopyToClipboard = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async (value: string | number) => {
    try {
      await navigator.clipboard.writeText(value.toString());
      setHasCopied(true);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => {
        setHasCopied(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  return { hasCopied, copyToClipboard };
};
