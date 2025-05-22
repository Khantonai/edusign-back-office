<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;


class UserController extends Controller
{
    public function students()
    {
        return User::where('role', 'student')->get(['id', 'name']);
    }
}
