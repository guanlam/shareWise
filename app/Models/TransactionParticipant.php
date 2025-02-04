<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class TransactionParticipant extends Pivot
{
    use HasFactory;

    // protected $table = 'participant_transactions';

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

