<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Group Expense Payment Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f1f3f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #1c312c;
            text-align: center;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            color: #555;
        }
        .btn {
            display: inline-block;
            padding: 12px 25px;
            background-color: #1c312c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-size: 16px;
            transition: opacity 0.5s;
        }
        .btn a{
            color: inherit;
        }
        .btn:hover {
            opacity: 0.8;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
        .footer a {
            color: #1c312c;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div style="text-align: center; ">
            <img src="images/logo-only.png" alt="Logo" style="max-width: 50px;">
        </div>
        <p>Dear lam,</p>
        <p>You owe <strong>RM 50</strong> for a group expense created by hjdd.</p>
        <p>Please click the button below to mark your payment as complete:</p>
        <p>
            <a  class="btn">Mark as Paid</a>
        </p>
        <p>If you did not expect this email, please ignore it.</p>
        <p>Thank you!</p>
    </div>
    <div class="footer">
        <p>© 2024 ShareWise Financial Tracker. All rights reserved.</p>
    </div>
</body>
</html>
