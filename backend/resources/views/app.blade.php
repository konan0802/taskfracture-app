<!-- resources/views/app.blade.php -->

<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <link rel="icon" href="{{ asset('favicon.ico') }}" />
    <title>TaskFracture</title>
    <link href="{{ asset('main.css') }}" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
    <script src="{{ asset('main.js') }}"></script>
</body>
</html>
