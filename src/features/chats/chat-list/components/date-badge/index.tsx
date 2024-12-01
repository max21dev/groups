import { format } from 'date-fns';

import { Badge } from '@/shared/components/ui/badge';

export const ChatListDateBadge = ({ date }: { date: Date }) => {
  const dateString = format(date, 'dd MMMM');
  const todayString = format(new Date(), 'dd MMMM');
  const yesterdayString = format(new Date(new Date().setDate(new Date().getDate() - 1)), 'dd MMMM');

  const isToday = dateString === todayString;
  const isYesterday = dateString === yesterdayString;

  return (
    <Badge className="mt-2 mx-auto cursor-default" variant="outline">
      {isToday ? 'Today' : isYesterday ? 'Yesterday' : dateString}
    </Badge>
  );
};
