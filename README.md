# Survey App - React Native + Laravel

Aplikasi survey dengan 2 tipe user: **Admin** dan **Responden**.

## 🎯 Fitur

### Admin
- Login & Logout
- Create survey dengan 2 pertanyaan (jawaban: Setuju/Tidak Setuju)
- View semua surveys
- View detail survey
- Activate/Deactivate survey
- Delete survey

### Responden (User Biasa)
- Register & Login
- View daftar active surveys
- Isi survey (hanya bisa 1x per survey)
- Logout

## 🚀 Setup Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Setup .env
cp .env.example .env

# Generate app key
php artisan key:generate

# Setup database di .env
DB_DATABASE=jenal_db
DB_USERNAME=root
DB_PASSWORD=

# Run migrations & seeders
php artisan migrate:fresh --seed

# Start server
php artisan serve
```

Backend akan jalan di: `http://127.0.0.1:8000`

### Default Users (Setelah Seeding)

**Admin:**
- Email: `admin@example.com`
- Password: `password123`

**Responden:**
- Email: `john@example.com`
- Password: `password123`

## 📱 Setup Mobile (React Native Expo)

```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npm start
```

Pilih platform:
- Press `a` untuk Android
- Press `i` untuk iOS (Mac only)
- Press `w` untuk Web

## 🔧 API Endpoints

Base URL: `http://127.0.0.1:8000/api`

### Auth
- `POST /auth/register` - Register user baru
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Surveys
- `GET /surveys` - Get all surveys
- `GET /surveys/{id}` - Get survey detail
- `POST /surveys` - Create survey
- `PUT /surveys/{id}` - Update survey
- `DELETE /surveys/{id}` - Delete survey

### Questions
- `POST /questions` - Create question
- `DELETE /questions/{id}` - Delete question

### Responses
- `POST /responses` - Submit response (1 user = 1 survey)

### Answers
- `POST /answers` - Submit answer untuk question

## 📱 Navigasi App

```
┌─────────────────────────────────────┐
│         Login / Register            │
└─────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    [Admin]          [Responden]
        │                 │
        ▼                 ▼
┌──────────────┐   ┌──────────────┐
│ Admin Panel  │   │ User Panel   │
│              │   │              │
│ - Surveys    │   │ - Surveys    │
│ - Create     │   │ - Take       │
│ - Details    │   │   Survey     │
│ - Delete     │   │              │
└──────────────┘   └──────────────┘
```

## 📦 Technologies

### Backend
- Laravel 11
- MySQL
- PHP 8.2+

### Mobile
- React Native (Expo)
- TypeScript
- Expo Router
- AsyncStorage

## 🎨 Struktur Project

```
uas_mobpro/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── SurveyController.php
│   │   │   ├── QuestionController.php
│   │   │   ├── ResponseController.php
│   │   │   └── AnswerController.php
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── mobile/
    ├── app/
    │   ├── auth/
    │   │   ├── login.tsx
    │   │   └── register.tsx
    │   ├── admin/
    │   │   └── surveys/
    │   │       ├── index.tsx
    │   │       ├── create.tsx
    │   │       └── [id].tsx
    │   └── user/
    │       └── surveys/
    │           ├── index.tsx
    │           └── [id].tsx
    ├── context/
    │   └── AuthContext.tsx
    ├── services/
    │   └── api.ts
    └── constants/
        └── api.ts
```

## 💡 Notes

1. **Unique Constraint**: 1 user hanya bisa isi 1 survey (enforced by database)
2. **2 Questions Only**: Setiap survey hanya ada 2 pertanyaan
3. **Answer Type**: Hanya Setuju (true) atau Tidak Setuju (false)
4. **Active Surveys**: User hanya bisa lihat surveys yang is_active = true

## 🐛 Troubleshooting

### Backend Error: "Migration failed"
```bash
php artisan migrate:fresh --seed
```

### Mobile Error: "Network request failed"
Pastikan:
1. Laravel server jalan (`php artisan serve`)
2. IP address di `mobile/constants/api.ts` sesuai
3. Android emulator bisa akses `127.0.0.1` atau gunakan IP lokal

### AsyncStorage Error
```bash
cd mobile
npm install @react-native-async-storage/async-storage
```

## 📝 License

MIT License
