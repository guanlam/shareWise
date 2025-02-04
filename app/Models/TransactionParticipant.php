<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionParticipant extends Model
{
    use HasFactory;

    // protected $table = 'transaction_participant';

    protected $fillable = ['transaction_id', 'participant_id', 'amount_owed', 'payment_status'];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function participant()
    {
        return $this->belongsTo(Participant::class);
    }
}

