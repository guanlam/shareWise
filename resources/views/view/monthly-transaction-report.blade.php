<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Report</title>
    <!-- <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f9f9f9;
        }
        .report-container {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            max-width: 800px;
            margin: auto;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #fff;
        }
        .header, .footer {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #1c312c;
        }
        .footer {
            font-size: 14px;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        table th {
            background-color: #1c312c;
            color: #fff;
            font-weight: bold;
        }
        table tbody tr:nth-child(even) {
            background-color: #f4f4f4;
        }
    </style> -->
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 20px;
        background-color: #f9f9f9;
    }
    .report-container {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        max-width: 100%; /* Use full page width */
        margin: auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #fff;
    }
    .header, .footer {
        text-align: center;
        margin-bottom: 20px;
    }
    .header h1 {
        margin: 0;
        color: #1c312c;
    }
    .footer {
        font-size: 14px;
        color: #555;
    }
    table {
        width: 100%;
        table-layout: fixed; /* Force fixed layout */
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    table th, table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
        word-wrap: break-word; /* Allow text to wrap */
        font-size: 0.8rem; /* Optional: reduce font size */
    }
    table th {
        background-color: #1c312c;
        color: #fff;
        font-weight: bold;
    }
    table tbody tr:nth-child(even) {
        background-color: #f4f4f4;
    }
</style>

</head>
<body>
    <div class="report-container">
        <!-- Header Section -->
        <div class="header">
            <h1>Transaction Monthly Report</h1>
            <p>{{ $monthYear }}</p>
            <p>Dear, {{ $userName ?? 'User' }}</p>
        </div>

        <!-- Body Section -->
        <table>
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Payment Method</th>
                    <th>Recurrence</th>
                    <th>Group Expense</th>
                    <th>Description</th>
                    <th>Amount (RM)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($transactions as $transaction)
                <tr>
                    <td>{{ $transaction->id }}</td>
                    <td>{{ $transaction->date }}</td>
                    <td>{{ $transaction->type }}</td>
                    <td>{{ $transaction->category->name ?? '-' }}</td>
                    <td>{{ $transaction->paymentMethod->name ?? '-' }}</td>
                    <td>
                        @if($transaction->recurrence == 1 && $transaction->recurrenceData)
                            {{ $transaction->recurrenceData->frequency }}
                        @else
                            None
                        @endif
                    </td>

                    <td>{{ $transaction->group_expense ? 'Yes' : 'No' }}</td>
                    <td>{{ $transaction->description ?? '-' }}</td>
                    <td>{{ number_format($transaction->amount, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Footer Section -->
        <div class="footer">
            <p>Total Expenditure: RM {{ number_format($totalExpense, 2) }}</p>
            <p>Total Income: RM {{ number_format($totalIncome, 2) }}</p>
            <p>Net Balance: RM {{ number_format($netBalance, 2) }}</p>
            <hr>
            <p>Thank you for using ShareWise!</p>
            <p>Generated on: {{ $generatedAt }}</p>
            <p>&copy; 2024 ShareWise Financial Tracker</p>
            <p>************End of the report************</p>
        </div>
    </div>
</body>
</html>
