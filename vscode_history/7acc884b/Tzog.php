<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'AdminKit')</title>
    <link rel="stylesheet" href="/css/app.css">
    @stack('styles')
</head>
<body>

    <!-- SIDEBAR -->
    <nav id="sidebar" class="sidebar js-sidebar">
        <div class="sidebar-content js-simplebar">
            <a class="sidebar-brand" href="/index.html">
                <span class="align-middle">AdminKit</span>
            </a>
            
            <ul class="sidebar-nav">
                <li class="sidebar-header">Pages</li>
                <li class="sidebar-item active">
                    <a class="sidebar-link" href="/index.html">
                        <i class="align-middle" data-feather="sliders"></i> <span class="align-middle">Dashboard</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a class="sidebar-link" href="/pages-profile.html">
                        <i class="align-middle" data-feather="user"></i> <span class="align-middle">Profile</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a class="sidebar-link" href="/pages-sign-in.html">
                        <i class="align-middle" data-feather="log-in"></i> <span class="align-middle">Sign In</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a class="sidebar-link" href="/pages-sign-up.html">
                        <i class="align-middle" data-feather="user-plus"></i> <span class="align-middle">Sign Up</span>
                    </a>
                </li>
                <li class="sidebar-header">Tools & Components</li>
                <li class="sidebar-item">
                    <a class="sidebar-link" href="/ui-buttons.html">
                        <i class="align-middle" data-feather="square"></i> <span class="align-middle">Buttons</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a class="sidebar-link" href="/ui-forms.html">
                        <i class="align-middle" data-feather="check-square"></i> <span class="align-middle">Forms</span>
                    </a>
                </li>
            </ul>

            <div class="sidebar-cta">
                <div class="sidebar-cta-content">
                    <strong class="d-inline-block mb-2">Upgrade to Pro</strong>
                    <div class="mb-3 text-sm">
                        Are you looking for more components? Check out our premium version.
                    </div>
                    <div class="d-grid">
                        <a href="/upgrade-to-pro.html" class="btn btn-primary">Upgrade to Pro</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand navbar-light navbar-bg">
        <a class="sidebar-toggle js-sidebar-toggle">
            <i class="hamburger align-self-center"></i>
        </a>

        <div class="navbar-collapse collapse">
            <ul class="navbar-nav navbar-align">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                        <img src="/img/avatars/avatar.jpg" class="avatar img-fluid rounded me-1" alt="Charles Hall" />
                        <span class="text-dark">Charles Hall</span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="pages-profile.html">
                            <i class="align-middle me-1" data-feather="user"></i> Profile
                        </a>
                        <a class="dropdown-item" href="#">
                            <i class="align-middle me-1" data-feather="pie-chart"></i> Analytics
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="index.html">
                            <i class="align-middle me-1" data-feather="settings"></i> Settings & Privacy
                        </a>
                        <a class="dropdown-item" href="#">
                            <i class="align-middle me-1" data-feather="help-circle"></i> Help Center
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Log out</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>

    <!-- MAIN CONTENT -->
    <div class="main">
        <main class="content">
            @yield('content')
        </main>
    </div>

    <script src="/js/app.js"></script>
    @stack('scripts')
</body>
</html>