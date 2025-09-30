export const mockPolls = [
  {
    id: 'mock-poll-1',
    trip_id: '1',
    question: 'Which restaurant should we visit first?',
    options: [
      { id: 'opt-1', text: 'Sushi Place', voteCount: 3, voters: [] },
      { id: 'opt-2', text: 'Taco Stand', voteCount: 5, voters: [] },
      { id: 'opt-3', text: 'Pizza Joint', voteCount: 2, voters: [] }
    ],
    status: 'active' as const,
    total_votes: 10,
    created_by: 'mock-user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'mock-poll-2',
    trip_id: '1',
    question: 'What amount is everybody going to spend on a table at the club?',
    options: [
      { id: 'opt-1', text: '$500', voteCount: 2, voters: [] },
      { id: 'opt-2', text: '$1000', voteCount: 4, voters: [] },
      { id: 'opt-3', text: '$1500', voteCount: 1, voters: [] }
    ],
    status: 'active' as const,
    total_votes: 7,
    created_by: 'mock-user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  }
];
