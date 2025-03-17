# ShareWise – Personal Finance Tracker

## Overview

ShareWise is a personal finance tracking system designed to help users manage income, expenses, and savings efficiently. Built with Laravel, this application provides features such as categorized expense tracking, financial reports, group expense management, budgeting forecasts, and AI-driven spending analysis.

## Features

- **Expense & Income Tracking:** Record and categorize financial transactions easily.
- **Group Expense Management:** Share expenses with friends and track individual contributions.
- **Automated Notifications:** Participants receive real-time alerts for new expenses, payment reminders, and marked payments.
- **Financial Reports:** Generate monthly reports with spending insights and trends.
- **Forecast & Budgeting:** Plan future expenses based on historical spending patterns.
- **DeepSeek Budget Suggestion:** AI-powered recommendations to optimize savings and spending.

## Group Expense Notifications

- **New Expense Alert:** Participants receive a notification when a group expense is created.
- **Payment Reminder:** Users with outstanding balances are reminded to settle their dues.
- **Payment Confirmation:** When a participant marks their share as paid, others are notified.
- **Delivery Methods:** Notifications are sent via email and in-app alerts.

## Forecast & Budgeting

- **Spending Predictions:** The system analyzes past expenses to estimate future financial trends.
- **Custom Budget Planning:** Users can set budget limits and receive alerts when approaching thresholds.
- **AI-Driven Suggestions:** DeepSeek Budget Suggestion offers recommendations to improve financial health.

## Screenshots

### Login Page
![login](https://github.com/user-attachments/assets/4f572013-5702-4ab6-978c-d7f27fb40be4)

### Dashboard
![dashboard](https://github.com/user-attachments/assets/85c40083-900c-4c24-8c5a-c99848801176)

### View Transactions
![ViewTransaction](https://github.com/user-attachments/assets/a09aabc0-8eb6-4d3f-b087-3cdee1e9fa5b)

### Add Transaction
![AddTransaction](https://github.com/user-attachments/assets/4b57bef2-3c93-4cc2-9d9a-3bb9caae3420)

### Add Group Expense Transaction
![AddTransactionGroupExpense](https://github.com/user-attachments/assets/b3e32d47-0ff3-4eec-9a91-5daf96dfbf76)

### Budget Planning
![budget](https://github.com/user-attachments/assets/d0f14f15-08be-48c4-9395-f90faae51c50)

### Forecast Analysis
![forecast](https://github.com/user-attachments/assets/d02576c8-89fa-4a06-84da-628b7cb53b8f)

### AI Budget Suggestions
![AISuggestion](https://github.com/user-attachments/assets/cdabac2f-d449-4e12-9f25-f37cc1ca2650)

### Group Expense Notification
![GroupExpenseNotification](https://github.com/user-attachments/assets/0241a75c-1066-4370-a2ed-02613ba0c84e)

### Monthly Report
![MonthlyReport](https://github.com/user-attachments/assets/f9d398dd-284c-4b2a-9199-d8c0879b4060)

## Email Configuration (MailerSend)

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

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to your fork (`git push origin feature-branch`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License.

