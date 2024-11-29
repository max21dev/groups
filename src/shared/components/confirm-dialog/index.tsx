import { PropsWithChildren, ReactNode } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface ConfirmDialogProps extends PropsWithChildren {
  triggerButton: ReactNode;
  title: string;
  confirmButtonLabel: string;
  confirmButtonVariant?: 'destructive' | 'default';
  confirmAction: () => void;
  cancelAction?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmDialog = ({
  triggerButton,
  title,
  confirmButtonLabel,
  confirmButtonVariant = 'default',
  confirmAction,
  cancelAction,
  open,
  onOpenChange,
  children,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle>{title}</DialogTitle>
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
