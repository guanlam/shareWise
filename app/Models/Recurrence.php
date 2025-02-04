<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recurrence extends Model
{
    use HasFactory;

    protected $fillable = ['frequency', 'last_generated_date', 'transaction_id'];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
