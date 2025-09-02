-- Add admin user to admin_users table
-- This will be executed after all other migrations
INSERT INTO public.admin_users (id, email, role, created_at)
VALUES (
    'faf395bf-bb92-456a-ab2d-14c04800b31b',
    'ognjen.drinic31@gmail.com',
    'admin',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    created_at = EXCLUDED.created_at; 