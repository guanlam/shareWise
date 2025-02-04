<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    //
    protected $fillable = ['name', 'icon', 'type', 'user_id'];

    // A category belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A category has many transactions
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
