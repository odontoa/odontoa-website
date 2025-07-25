# 🚀 Brzo kreiranje admin korisnika

## Automatsko kreiranje (preporučeno)

Ako imaš service_role ključ, izvršiću ovu komandu:

```bash
node create-admin.js
```

Service role ključ možeš da nađeš u:
**Supabase Dashboard → Settings → API → service_role key**

## Manuelno kreiranje

### 1. Idi na Supabase Dashboard
https://supabase.com/dashboard/project/bjbfmddrekjmactytaky

### 2. Authentication → Users → Add user
- Email: `ognjen.drinic31@gmail.com`
- Password: (postaviti privremeni)
- Auto Confirm: ✅ ON

### 3. Kopiraj User ID i idi na Table Editor

### 4. Otvori `admin_users` tabelu → Insert row:
```sql
id: [user-id-iz-auth]
email: ognjen.drinic31@gmail.com  
role: admin
```

### 5. Testiraj login
http://localhost:3000/admin-panel

## ✅ Kada završiš

1. Idi na admin panel: http://localhost:3000/admin-panel
2. Uloguj se sa email/password
3. Kreiraj test blog post
4. Kreiraj test rečnički pojam
5. Testiraj backup funkcionalnost

🎉 Sistem je spreman za production! 