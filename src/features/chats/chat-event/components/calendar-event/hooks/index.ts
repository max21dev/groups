import { NDKEvent, NDKKind, NostrEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';

import { useToast } from '@/shared/components/ui/use-toast';
import { useLoginModalState } from '@/shared/hooks';

type AttendanceStatus = 'accepted' | 'tentative' | 'declined';

export const useCalendarEvent = (event: NostrEvent) => {
  const [attendanceEvents, setAttendanceEvents] = useState<NDKEvent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCurrentRsvp, setUserCurrentRsvp] = useState<NDKEvent | null>(null);

  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();
  const { openLoginModal } = useLoginModalState();
  const { toast } = useToast();

  const title = event.tags.find((tag) => tag[0] === 'title')?.[1] || 'Untitled Event';
  const description = event.content || event.tags.find((tag) => tag[0] === 'summary')?.[1] || '';
  const image = event.tags.find((tag) => tag[0] === 'image')?.[1];
  const startTime = event.tags.find((tag) => tag[0] === 'start')?.[1];
  const endTime = event.tags.find((tag) => tag[0] === 'end')?.[1];
  const timezone = event.tags.find((tag) => tag[0] === 'start_tzid')?.[1];
  const location = event.tags.find((tag) => tag[0] === 'location')?.[1];

  const hasEventEnded = useMemo(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (endTime) {
      return Number(endTime) < currentTime;
    }
    if (startTime) {
      return Number(startTime) < currentTime;
    }
    return false;
  }, [startTime, endTime]);

  useEffect(() => {
    if (!ndk || !event.id) return;

    const loadAttendanceData = async () => {
      try {
        const eventIdentifier = event.tags.find((t) => t[0] === 'd')?.[1];
        if (!eventIdentifier) return;

        const responses = await ndk.fetchEvents({
          kinds: [31925 as NDKKind],
          '#a': [`31923:${event.pubkey}:${eventIdentifier}`],
        });

        const sortedResponses = Array.from(responses).sort((a, b) => a.created_at! - b.created_at!);
        setAttendanceEvents(sortedResponses);

        if (activeUser?.pubkey) {
          const userResponses = sortedResponses.filter((e) => e.pubkey === activeUser?.pubkey);
          setUserCurrentRsvp(userResponses[userResponses.length - 1] || null);
        }
      } catch (error) {
        console.error('Error loading attendance data:', error);
      }
    };

    loadAttendanceData();
  }, [ndk, event.id, event.pubkey, event.tags, activeUser?.pubkey]);

  const attendanceSummary = useMemo(() => {
    const latestResponsesByUser = attendanceEvents.reduce(
      (accumulator, responseEvent) => {
        const status = responseEvent.tags.find((t) => t[0] === 'status')?.[1] as AttendanceStatus;
        if (status && ['accepted', 'tentative', 'declined'].includes(status)) {
          accumulator[responseEvent.pubkey!] = status;
        }
        return accumulator;
      },
      {} as Record<string, AttendanceStatus>,
    );

    const statusTotals = Object.values(latestResponsesByUser).reduce(
      (accumulator, status) => {
        accumulator[status] = (accumulator[status] || 0) + 1;
        return accumulator;
      },
      {} as Record<AttendanceStatus, number>,
    );

    return Object.entries(statusTotals).map(([status, count]) => ({
      status: status as AttendanceStatus,
      count,
    }));
  }, [attendanceEvents]);

  const attending = attendanceSummary.find((r) => r.status === 'accepted');
  const maybeAttending = attendanceSummary.find((r) => r.status === 'tentative');
  const notAttending = attendanceSummary.find((r) => r.status === 'declined');

  const userAttendanceStatus = useMemo(() => {
    if (!userCurrentRsvp) return null;
    return userCurrentRsvp.tags.find((t) => t[0] === 'status')?.[1] as AttendanceStatus | null;
  }, [userCurrentRsvp]);

  const submitAttendanceResponse = async (status: AttendanceStatus) => {
    if (!ndk) return;

    if (!activeUser || !activeUser?.pubkey) {
      toast({
        description: 'Please sign in to respond to this event',
      });
      openLoginModal();
      return;
    }

    try {
      setIsSubmitting(true);

      const eventIdentifier = event.tags.find((t) => t[0] === 'd')?.[1];
      if (!eventIdentifier) {
        toast({
          title: 'Error',
          description: 'Unable to respond - invalid calendar event',
          variant: 'destructive',
        });
        return;
      }

      const responseId =
        userCurrentRsvp?.tags.find((t) => t[0] === 'd')?.[1] ||
        `response-${event.id}-${Date.now()}`;

      const attendanceResponse = new NDKEvent(ndk, {
        kind: 31925,
        content: '',
        pubkey: activeUser?.pubkey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['d', responseId],
          ['a', `31923:${event.pubkey}:${eventIdentifier}`],
          ['e', event.id!],
          ['status', status],
          ['p', event.pubkey],
        ],
      });

      await attendanceResponse.publish();

      setUserCurrentRsvp(attendanceResponse);
      setAttendanceEvents((previous) => [...previous, attendanceResponse]);

      const statusLabels = {
        accepted: 'attending',
        tentative: 'maybe attending',
        declined: 'not attending',
      };

      toast({
        title: 'Response Saved',
        description: `You are now marked as ${statusLabels[status]}`,
      });
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: 'Response Failed',
        description: 'Could not save your response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categorizedChatContent = useMemo(
    () => categorizeChatContent(description || ''),
    [description],
  );

  return {
    title,
    description,
    image,
    startTime,
    endTime,
    timezone,
    location,
    hasEventEnded,
    attendanceSummary,
    userAttendanceStatus,
    isSubmitting,
    submitAttendanceResponse,
    attending,
    maybeAttending,
    notAttending,
    categorizedChatContent,
  };
};
