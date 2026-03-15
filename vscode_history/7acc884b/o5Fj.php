<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AdminKit - @yield('title')</title>
    <link href="/css/app.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
</head>
<body>
    @include('layouts.sidebar')

    <div class="main">
        @include('layouts.navbar')

        <main class="content">
            @yield('content')
        </main>

        @include('layouts.footer')
    </div>

    <script src="/js/app.js"></script>
    @stack('scripts')
</body>
</html>