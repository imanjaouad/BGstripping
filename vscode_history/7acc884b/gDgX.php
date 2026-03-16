{{-- resources/views/layouts/main.blade.php --}}

<body>
    {{-- @include('layouts.sidebar') --}} <!-- supprimer ou commenter -->

    <div class="main">
        {{-- @include('layouts.navbar') --}} <!-- supprimer ou commenter -->

        <main class="content">
            @yield('content')
        </main>

        {{-- @include('layouts.footer') --}} <!-- supprimer ou commenter -->
    </div>

    <script src="/js/app.js"></script>
    @stack('scripts')
</body>