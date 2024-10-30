import { Loader2Icon } from 'lucide-react';

export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2Icon size={32} className="animate-spin" />
    </div>
  );
};
