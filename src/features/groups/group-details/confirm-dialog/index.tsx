import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button.tsx';
import { ReactNode } from 'react';

interface ConfirmDialogProps {
  triggerButton: ReactNode;
  title: string;
  confirmButtonLabel: string;
  confirmButtonVariant?: 'destructive' | 'default';
  confirmAction: () => void;
  cancelAction?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;  // Accepting content as children
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                          triggerButton,
                                                          title,
                                                          confirmButtonLabel,
                                                          confirmButtonVariant = 'default',
                                                          confirmAction,
                                                          cancelAction,
                                                          open,
                                                          onOpenChange,
                                                          children,  // Destructuring the children prop
                                                        }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle>{title}</DialogTitle>
        {/* Render dynamic content here */}
        {children}
        <DialogFooter>
          <Button variant="outline" onClick={cancelAction || (() => onOpenChange(false))}>
            Cancel
          </Button>
          <Button variant={confirmButtonVariant} onClick={confirmAction}>
            {confirmButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
