<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
        use App\Models\Presence;


class CourseController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id',
            'icon' => 'required|string|max:1'
        ]);

        $course = Course::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'icon' => $request->icon
        ]);
        

        if ($request->filled('student_ids')) {
            $course->students()->attach($request->student_ids);
        }

        return response()->json(['course' => $course], 201);
    }

    public function addStudent(Request $request, $courseId)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        $course = Course::findOrFail($courseId);

        // Optionnel : s'assurer que l'utilisateur est bien un prof
        if ($course->user_id !== auth()->id()) {
            abort(403, 'Non autorisé.');
        }

        $course->students()->attach($request->student_id);

        return response()->json(['message' => 'Élève ajouté avec succès.']);
    }


    public function index()
    {
        $user = auth()->user();

        $courses = Course::where('user_id', $user->id)->get();

        return Inertia::render('courses/index', [
            'courses' => $courses,
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();
        $course = Course::with('students')->findOrFail($id);

        if ($user->role !== 'professor' || $course->user_id !== $user->id) {
            abort(403, 'Accès non autorisé.');
        }


        $students = $course->students->map(function ($student) use ($course) {
            $hasSigned = Presence::where('user_id', $student->id)
                ->where('course_id', $course->id)
                ->exists();

            return [
                'id' => $student->id,
                'name' => $student->name,
                'has_signed' => $hasSigned,
            ];
        });

        return Inertia::render('courses/show', [
            'course' => [
                'id' => $course->id,
                'name' => $course->name,
                'students' => $students,
                'icon' => $course->icon,
            ],
        ]);
    }

    public function generateToken(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $course = Course::findOrFail($request->course_id);

        if ($course->user_id !== auth()->id()) {
            abort(403, 'Non autorisé.');
        }

        $token = \Illuminate\Support\Str::random(32);

        Cache::put("presence_token:{$token}", $course->id, now()->addMinutes(2));


        $qr = (string) \SimpleSoftwareIO\QrCode\Facades\QrCode::size(300)->generate($token);

        return response()->json([
            'qr' => $qr,
            'token' => $token,
            'expires_at' => now()->addMinutes(2),
        ]);
    }
}

    