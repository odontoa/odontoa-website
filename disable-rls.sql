-- Temporarily disable RLS on admin_users table
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Add admin user
INSERT INTO public.admin_users (id, email, role, created_at)
VALUES (
    '1d3b68cd-0e1b-4711-97a2-7d40b16f85df',
    'ognjen.drinic31@gmail.com',
    'admin',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    created_at = EXCLUDED.created_at;

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY; 