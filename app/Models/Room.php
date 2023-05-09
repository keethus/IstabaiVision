<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'room_id',
        'room_type',
    ];

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

}
