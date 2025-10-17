-- Create category_assignments table to persist itinerary assignments
CREATE TABLE public.category_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  assigned_user_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  lead_user_id UUID,
  task_id UUID REFERENCES public.trip_tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id, category_id)
);

-- Enable RLS
ALTER TABLE public.category_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Trip members can view and manage assignments
CREATE POLICY "Trip members can view category assignments"
  ON public.category_assignments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = category_assignments.trip_id
        AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip members can create category assignments"
  ON public.category_assignments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = category_assignments.trip_id
        AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip members can update category assignments"
  ON public.category_assignments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = category_assignments.trip_id
        AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip members can delete category assignments"
  ON public.category_assignments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = category_assignments.trip_id
        AND tm.user_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_category_assignments_updated_at
  BEFORE UPDATE ON public.category_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();