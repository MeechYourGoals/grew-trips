-- Create trip_tasks table with proper schema
CREATE TABLE public.trip_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id text NOT NULL,
  creator_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  due_at timestamp with time zone,
  is_poll boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create task_status table for tracking individual user completions
CREATE TABLE public.task_status (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.trip_tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Enable RLS
ALTER TABLE public.trip_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trip_tasks
CREATE POLICY "Trip members can view tasks" 
ON public.trip_tasks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM trip_members tm 
  WHERE tm.trip_id = trip_tasks.trip_id 
  AND tm.user_id = auth.uid()
));

CREATE POLICY "Trip members can create tasks" 
ON public.trip_tasks 
FOR INSERT 
WITH CHECK (
  auth.uid() = creator_id AND 
  EXISTS (
    SELECT 1 FROM trip_members tm 
    WHERE tm.trip_id = trip_tasks.trip_id 
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Task creators can update their tasks" 
ON public.trip_tasks 
FOR UPDATE 
USING (auth.uid() = creator_id);

CREATE POLICY "Task creators can delete their tasks" 
ON public.trip_tasks 
FOR DELETE 
USING (auth.uid() = creator_id);

-- Create RLS policies for task_status
CREATE POLICY "Trip members can view task status" 
ON public.task_status 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM trip_tasks tt, trip_members tm 
  WHERE tt.id = task_status.task_id 
  AND tm.trip_id = tt.trip_id 
  AND tm.user_id = auth.uid()
));

CREATE POLICY "Users can manage their own task status" 
ON public.task_status 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create update trigger for trip_tasks
CREATE OR REPLACE FUNCTION public.update_updated_at_trip_tasks()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trip_tasks_updated_at
  BEFORE UPDATE ON public.trip_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_trip_tasks();