import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface TripPoll {
  id: string;
  trip_id: string;
  question: string;
  options: PollOption[];
  total_votes: number;
  status: 'active' | 'closed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

interface CreatePollRequest {
  question: string;
  options: string[];
}

interface VotePollRequest {
  pollId: string;
  optionId: string;
}

export const useTripPolls = (tripId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch polls from database
  const { data: polls = [], isLoading } = useQuery({
    queryKey: ['tripPolls', tripId],
    queryFn: async (): Promise<TripPoll[]> => {
      const { data, error } = await supabase
        .from('trip_polls')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to handle JSON types
      return (data || []).map(poll => ({
        ...poll,
        options: Array.isArray(poll.options) ? (poll.options as any[]).filter(o => o && typeof o === 'object') as PollOption[] : [],
        status: poll.status as 'active' | 'closed'
      }));
    },
    enabled: !!tripId
  });

  // Create poll mutation
  const createPollMutation = useMutation({
    mutationFn: async (poll: CreatePollRequest) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const pollOptions = poll.options.map((text, index) => ({
        id: `option_${index}`,
        text,
        votes: 0,
        voters: []
      }));

      const { data, error } = await supabase
        .from('trip_polls')
        .insert({
          trip_id: tripId,
          question: poll.question,
          options: pollOptions,
          total_votes: 0,
          status: 'active',
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripPolls', tripId] });
      toast({
        title: 'Poll created',
        description: 'Your poll has been added to the trip.'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create poll. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Vote on poll mutation
  const votePollMutation = useMutation({
    mutationFn: async ({ pollId, optionId }: VotePollRequest) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get current poll data
      const { data: poll, error: fetchError } = await supabase
        .from('trip_polls')
        .select('*')
        .eq('id', pollId)
        .single();

      if (fetchError) throw fetchError;

      // Update options with new vote
      const currentOptions = Array.isArray(poll.options) ? poll.options : [];
      const updatedOptions = currentOptions.map((option: any) => {
        if (option.id === optionId) {
          const hasVoted = option.voters?.includes(user.id);
          return {
            ...option,
            votes: hasVoted ? option.votes - 1 : option.votes + 1,
            voters: hasVoted 
              ? (option.voters || []).filter((v: string) => v !== user.id)
              : [...(option.voters || []), user.id]
          };
        }
        // Remove user's vote from other options
        return {
          ...option,
          votes: (option.voters || []).includes(user.id) ? option.votes - 1 : option.votes,
          voters: (option.voters || []).filter((v: string) => v !== user.id)
        };
      });

      const totalVotes = updatedOptions.reduce((sum, option) => sum + option.votes, 0);

      // Update poll in database
      const { error: updateError } = await supabase
        .from('trip_polls')
        .update({
          options: updatedOptions,
          total_votes: totalVotes
        })
        .eq('id', pollId);

      if (updateError) throw updateError;
      return { pollId, optionId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripPolls', tripId] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to record vote. Please try again.',
        variant: 'destructive'
      });
    }
  });

  return {
    polls,
    isLoading,
    createPoll: createPollMutation.mutate,
    votePoll: votePollMutation.mutate,
    isCreatingPoll: createPollMutation.isPending,
    isVoting: votePollMutation.isPending
  };
};