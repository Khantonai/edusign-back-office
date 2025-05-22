<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    // reenforce the role of the user
    const ROLE_STUDENT = 'student';
    const ROLE_PROFESSOR = 'professor';

    public function isProfessor()
    {
        return $this->role === self::ROLE_PROFESSOR;
    }

    public function isStudent()
    {
        return $this->role === self::ROLE_STUDENT;
    }

    public function coursesTaught()
    {
        return $this->hasMany(Course::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }

    public function presences()
    {
        return $this->hasMany(\App\Models\Presence::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
