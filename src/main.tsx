import ReactDOM from 'react-dom/client';

import { App } from '@/app';

// TO DO: Temporary fix for NDK relaySet deprecation warnings after version update
// Remove once all deprecated relaySet usages are migrated to opts.relaySet
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('relaySet is deprecated')) {
    return;
  }
  originalWarn.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
