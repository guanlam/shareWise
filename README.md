# ShareWise – Personal Finance Tracker

## 📌 Overview
ShareWise is a personal finance tracking system designed to help users manage income, expenses, and savings efficiently. Built with Laravel, this application provides features such as categorized expense tracking, financial reports, and secure user authentication.

## 🛠️ Features
- 💰 **Income & Expense Tracking** – Log transactions with categories.
- 📊 **Monthly Financial Reports** – View spending breakdowns and generate reports.
- 🔐 **Secure API Authentication** – Powered by Laravel Sanctum.
- 📧 **Email Notifications** – Monthly reports sent via MailerSend.
- 🏦 **Multi-user Support** – Manage group expenses easily.

## 🚀 Tech Stack
- **Backend:** Laravel 10, Laravel Sanctum
- **Frontend:** Blade templates / React (if applicable)
- **Database:** MySQL
- **Email Service:** MailerSend
- **Version Control:** Git & GitHub

## 🔧 Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/sharewise.git
cd sharewise
```

### 2️⃣ Install Dependencies
```bash
composer install
npm install
```

### 3️⃣ Environment Setup
Copy `.env.example` to `.env` and update the required configurations:
```bash
cp .env.example .env
```
Update database, email, and API keys in the `.env` file.

### 4️⃣ Generate App Key
```bash
php artisan key:generate
```

### 5️⃣ Set Up Database
```bash
php artisan migrate --seed
```
> The `--seed` option will populate default categories.

### 6️⃣ Run the Application
```bash
php artisan serve
```
Visit: `http://127.0.0.1:8000`

## 🔑 API Authentication (Sanctum)
Use `Authorization: Bearer {token}` for secure API requests.

## 📨 Email Configuration (MailerSend)
Update `.env` with:
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailersend.net
MAIL_PORT=587
MAIL_USERNAME=your_mailersend_api_key
MAIL_PASSWORD=your_mailersend_secret
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@example.com
MAIL_FROM_NAME="ShareWise"
```

## 📝 Contribution Guidelines
1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to your fork (`git push origin feature-branch`).
5. Create a Pull Request.

## 📄 License
This project is licensed under the MIT License.

