-- Add admin user to admin_users table
-- This will be executed after all other migrations
INSERT INTO public.admin_users (id, email, role, created_at)
VALUES (
    '11977a6f-ef16-4ae5-b2a9-0941ad3b73dc',
    'ognjen.drinic31@gmail.com',
    'admin',
    NOW()
) ON CONFLICT (id) DO NOTHING; 