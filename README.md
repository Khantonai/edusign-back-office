# EduSign Back Office

EduSign is a presence validation system for students using QR codes scanned through a mobile app. This back-office handles course creation, student assignment, QR code generation, and attendance tracking.

## 🚀 Features

- Create and manage courses
- Assign students to each course
- Generate QR codes for attendance
- Scan QR codes on mobile to validate presence
- View student presence status in real time

## 🧰 Requirements

- PHP >= 8.1
- Composer
- Node.js & npm
- A MySQL database

## 🔧 Setup Instructions

1. Clone the repository
2. Create your `.env` file and update the following variables:
   - `IP_ADDRESS`: the IP address of your machine
   - `DB_DATABASE`: name of your database
   - `DB_USERNAME` and `DB_PASSWORD`: your database credentials

3. Run the following commands:

```bash
composer install
npm install
php artisan migrate
npm run build
php artisan serve --host=0.0.0.0
```

## 📱 Mobile Integration

- The mobile app scans QR codes containing a unique token.
- The token is sent to the API along with the user’s credentials to record the attendance.
- Tokens expire after a short duration and can only be used once per course.

link to the mobile app repository:
https://github.com/Khantonai/edusign-mobile-app[https://github.com/Khantonai/edusign-mobile-app]

## 🧪 Development

- Run `php artisan serve --host=0.0.0.0` to make the server accessible over local network

