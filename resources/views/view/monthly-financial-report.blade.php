<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly Financial Report</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #1c312c; color: white; text-align: center; padding: 15px; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 5px 0 0; font-size: 16px; font-weight: bold; }
        .content { padding: 15px; color: #333333; }
        .section { margin-bottom: 20px; }
        .section h2 { font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid #1c312c; padding-bottom: 5px; }
        .summary { font-size: 16px; line-height: 1.6; }
        .summary p { margin: 5px 0; }
        .footer { background-color: #f9f9f9; text-align: center; padding: 10px; font-size: 14px; color: #666666; }
        .footer p { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <h1>Monthly Financial Report</h1>
            <p>{{ $reportData['monthYear'] ?? '' }}</p>
        </div>

        <!-- Content Section -->
        <div class="content">
            <!-- Income & Spending Summary -->
            <div class="section">
                <p>Dear {{ $reportData['userName'] ?? 'User' }},</p>
                <h2>Summary</h2>
                <div class="summary">
                    <p><strong>Total Income:</strong> RM {{ number_format($reportData['totalIncome'] ?? 0, 2) }}</p>
                    <p><strong>Total Spending:</strong> RM {{ number_format($reportData['totalSpending'] ?? 0, 2) }}</p>
                    <p><strong>Savings:</strong> RM {{ number_format($reportData['savings'] ?? 0, 2) }}</p>
                </div>
            </div>

            <!-- Categorized Expenses -->
            <div class="section">
                <h2>Categorized Expenses</h2>
                <!-- Instead of Chart.js (which won’t work in emails), include a static image or list -->
                @if(isset($reportData['expenseChartUrl']))
                    <img src="{{ $reportData['expenseChartUrl'] }}" alt="Expense Chart" style="max-width: 320px; display: block; margin: 0 auto;">
                @endif
            </div>


            <!-- Show Expense Labels and Data in a Table -->
            
            @foreach($reportData['expenseChartLabels'] ?? [] as $index => $label)
                
                    <p>{{ $label }}</p>
                    <p>RM {{ number_format($reportData['expenseChartData'][$index] ?? 0, 2) }}</p>
                
            @endforeach


            <p style="text-align:center; margin-top: 1rem; font-size:.8rem;">
                If you'd like to view more detailed information about your transactions: 
                <a href="{{ route('report.download', ['userId' => $reportData['user']]) }}"

                style="display:inline-block; padding:10px 20px; background-color:#1c312c; color:#fff; text-decoration:none; border-radius:5px; margin-top: 1rem;">
                    Download the full transaction report
                </a>
            </p>


                    
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <hr>
            <p>Thank you for using ShareWise!</p>
            <p>Generated on: {{ $reportData['generatedAt'] ?? now()->toLocaleString() }}</p>
            <p>&copy; 2024 ShareWise Financial Tracker</p>
            <p>************End of the report************</p>
        </div>
    </div>
</body>
</html>
