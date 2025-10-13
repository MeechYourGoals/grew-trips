
export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters?: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
  status?: 'active' | 'closed';
  createdAt?: string;
}
