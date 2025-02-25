
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction List</title>
    <style>
        .center{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    @if(session('message'))
        <p class="center">{{ session('message') }}</p>
    @endif

    
</body>
</html>
