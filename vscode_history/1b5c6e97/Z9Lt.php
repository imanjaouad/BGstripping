<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth()->user();

        if (!$user) {
            abort(403, 'Access denied');
        }

        // Admin voit tout
        if ($user->role === 'admin') {
            return $next($request);
        }

        // Vérifie si le rôle est dans la liste passée
        if (!in_array($user->role, $roles)) {
            abort(403, 'Access denied');
        }

        return $next($request);
    }
}