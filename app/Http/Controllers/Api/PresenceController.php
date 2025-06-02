<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\Presence;

class PresenceController extends Controller
{
    public function studentMark(Request $request)
    {
        $request->validate([
            'session_token' => 'required|string',
            'student_id' => 'nullable|exists:users,id',
        ]);

        $user = $request->user();
        $targetUserId = $request->student_id ?? $user->id;

        if ($request->filled('student_id') && $request->student_id != $user->id) {
            if ($user->role !== 'professor') {
                return response()->json(['message' => 'Action non autorisée.'], 403);
            }
        }

        $token = $request->session_token;
        $cacheKey = "presence_token:{$token}";

        if (!Cache::has($cacheKey)) {
            return response()->json(['message' => 'QR code expiré ou invalide.'], 404);
        }

        $courseId = Cache::get($cacheKey);

        $enrolled = \DB::table('course_user')
            ->where('course_id', $courseId)
            ->where('user_id', $targetUserId)
            ->exists();

        if (!$enrolled) {
            return response()->json(['message' => 'Vous n\'êtes pas inscrit à ce cours.'], 403);
        }

        $alreadyMarked = Presence::where('user_id', $targetUserId)
            ->where('course_id', $courseId)
            ->exists();

        if ($alreadyMarked) {
            return response()->json(['message' => 'Présence déjà enregistrée.']);
        }

        Presence::create([
            'user_id' => $targetUserId,
            'course_id' => $courseId,
            'signed_at' => now(),
        ]);

        return response()->json(['message' => 'Présence validée avec succès.']);
    }

        public function revoke(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'student_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();

        if ($user->role !== 'professor') {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $presence = Presence::where('user_id', $request->student_id)
            ->where('course_id', $request->course_id)
            ->first();

        if (!$presence) {
            return response()->json(['message' => 'Présence non trouvée.'], 404);
        }

        $presence->delete();

        return response()->json(['message' => 'Présence révoquée avec succès.']);
    }

    public function profMark(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'student_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();

        if ($user->role !== 'professor') {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $alreadyMarked = Presence::where('user_id', $request->student_id)
            ->where('course_id', $request->course_id)
            ->exists();

        if ($alreadyMarked) {
            return response()->json(['message' => 'Présence déjà enregistrée.']);
        }

        Presence::create([
            'user_id' => $request->student_id,
            'course_id' => $request->course_id,
            'signed_at' => now(),
        ]);

        return response()->json(['message' => 'Présence enregistrée avec succès.']);
    }

    
}


    