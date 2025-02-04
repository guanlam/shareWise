<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon', 'user_id'];

    // A payment method belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A payment method is used by many transactions
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}

