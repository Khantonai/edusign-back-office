<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresenceSession extends Model
{

    protected $fillable = ['course_id', 'token', 'expires_at'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
