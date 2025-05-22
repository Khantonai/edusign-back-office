<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProfessorOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->role !== 'professor') {
            abort(403, 'Accès réservé aux professeurs.');
        }

        return $next($request);
    }
}