import React, { useCallback, useState } from 'react';
import { putGroupUser, useGroupRoles } from 'nostr-hooks/nip29';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useActiveGroup, useActiveRelay } from '@/shared/hooks';
import { toast } from '@/shared/components/ui/use-toast.ts';

interface UserAssignRoleDialogProps {
  userPubKey: string;
  userRoles?: string[];
}

export const UserAssignRoleDialog: React.FC<UserAssignRoleDialogProps> = ({
  userPubKey,
  userRoles,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(userRoles || []);
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();
  const { roles } = useGroupRoles(activeRelay, activeGroupId);

  const toggleDialog = () => {
    setOpen(!open);
  };

  const handleCheckboxChange = (role: string) => {
    setSelectedRoles((prevRoles) =>
      prevRoles.includes(role) ? prevRoles.filter((r) => r !== role) : [...prevRoles, role],
    );
  };

  const handleSetRoles = useCallback(() => {
    activeRelay &&
      activeGroupId &&
      roles &&
      userPubKey &&
      putGroupUser({
        relay: activeRelay,
        groupId: activeGroupId,
        pubkey: userPubKey,
        roles: selectedRoles,
        reason: 'Assign roles by user from groups.nip29.com client',
        onSuccess: () => {
          toast({ title: 'Success', description: 'Role assignment successfully done!' });
          setOpen(false);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to set new roles, Please make sure you have correct rights for this action!',
            variant: 'destructive',
          });
        },
      });
  }, [activeRelay, activeGroupId, userPubKey, roles, toast]);

  console.log('roles', roles, selectedRoles);
  return (
    <div>
      <Dialog open={open} onOpenChange={toggleDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">Assign Roles</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Roles</DialogTitle>
            <DialogDescription>Select roles to assign to the user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {roles ? (
              roles?.map((role) => (
                <div key={role?.name} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedRoles.includes(role?.name)}
                    onCheckedChange={() => handleCheckboxChange(role?.name)}
                  />
                  <label>
                    {role?.name} - {role?.description}
                  </label>
                </div>
              ))
            ) : (
              <span>
                There are no roles available for this group/Relay to assign. Please contact the
                group/Relay admin
              </span>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={toggleDialog}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={handleSetRoles}>
              Set Roles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};