<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\Presence;

class PresenceController extends Controller
{
    public function mark(Request $request)
    {
        $request->validate([
            'session_token' => 'required|string',
        ]);

        $token = $request->session_token;
        $cacheKey = "presence_token:{$token}";

        // Vérifie que le token existe en cache
        if (!Cache::has($cacheKey)) {
            return response()->json(['message' => 'QR code expiré ou invalide.'], 404);
        }

        $courseId = Cache::get($cacheKey);

        // Vérifie en base de données si l'élève a déjà signé ce cours
        $alreadyMarked = Presence::where('user_id', $request->user()->id)
            ->where('course_id', $courseId)
            ->exists();

        if ($alreadyMarked) {
            return response()->json(['message' => 'Présence déjà enregistrée.']);
        }

        // Enregistre la présence en base de données
        Presence::create([
            'user_id' => $request->user()->id,
            'course_id' => $courseId,
            'signed_at' => now(),
        ]);

        return response()->json(['message' => 'Présence validée avec succès.']);
    }
}
