<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email'];

    // A participant is related to many transactions
    public function transactions()
    {
        return $this->belongsToMany(Transaction::class, 'transaction_participants')
                    ->withPivot('amount_owed', 'payment_status')
                    ->withTimestamps();
    }
}

