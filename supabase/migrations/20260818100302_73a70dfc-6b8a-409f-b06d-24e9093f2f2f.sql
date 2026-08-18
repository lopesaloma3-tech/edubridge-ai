ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_settings_select_all" ON public.system_settings FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER system_settings_updated_at BEFORE UPDATE ON public.system_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.system_settings (key, value, description) VALUES
  ('school_name', '"EduBridge Academy"', 'Name of the institution'),
  ('academic_year', '"2025-2026"', 'Current academic year'),
  ('max_students_per_class', '40', 'Maximum students allowed per class'),
  ('attendance_threshold', '75', 'Minimum attendance percentage required'),
  ('fee_due_reminder_days', '7', 'Days before due date to send fee reminders'),
  ('allow_registration', 'true', 'Whether new user registration is enabled')
ON CONFLICT (key) DO NOTHING;