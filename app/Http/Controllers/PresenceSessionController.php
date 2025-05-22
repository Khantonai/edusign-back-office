<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\PresenceSession;
use App\Models\Course;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PresenceSessionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $token = Str::random(32);
        $expiresAt = now()->addMinutes(2);

        $session = PresenceSession::create([
            'course_id' => $request->course_id,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);

        $url = json_encode([
            'url' => 'http://' . env('IP_ADDRESS') . ':' . env('APP_PORT') . '/api/presence/mark',
            'token' => $token,
        ]);
        $qr = (string) QrCode::size(300)->generate($url);
        return response()->json([
            'qr' => $qr,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);
    }
}
