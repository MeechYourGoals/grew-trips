-- Add to-do list system for trips
CREATE TABLE IF NOT EXISTS public.trip_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id uuid REFERENCES public.user_trips(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (length(title) <= 140),
  description text,
  due_at timestamptz,
  is_poll boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trip_task_status (
  task_id uuid REFERENCES public.trip_tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  PRIMARY KEY (task_id, user_id)
);

-- Enable RLS
ALTER TABLE public.trip_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_task_status ENABLE ROW LEVEL SECURITY;

-- RLS policies for trip_tasks
CREATE POLICY "Trip members can view tasks" ON public.trip_tasks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.trip_members 
    WHERE trip_id = trip_tasks.trip_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Trip members can create tasks" ON public.trip_tasks
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trip_members 
    WHERE trip_id = trip_tasks.trip_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Task creators can update tasks" ON public.trip_tasks
FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Task creators can delete tasks" ON public.trip_tasks
FOR DELETE USING (creator_id = auth.uid());

-- RLS policies for trip_task_status
CREATE POLICY "Trip members can view task status" ON public.trip_task_status
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.trip_tasks 
    JOIN public.trip_members ON trip_tasks.trip_id = trip_members.trip_id
    WHERE trip_tasks.id = trip_task_status.task_id 
    AND trip_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own task status" ON public.trip_task_status
FOR ALL USING (user_id = auth.uid());

-- Add updated_at trigger for trip_tasks
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_trip_tasks_updated_at
  BEFORE UPDATE ON public.trip_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_task_status;