<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 'amount', 'type', 'description', 'group_expense', 'recurrence',
        'category_id', 'payment_method_id', 'user_id'
    ];

    // A transaction belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A transaction belongs to a category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // A transaction belongs to a payment method
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    // A transaction has a many-to-many relationship with participants.
    // This is for group expenses.
    public function participants()
    {
        return $this->belongsToMany(Participant::class, 'transaction_participants')
                    ->withPivot('amount_owed', 'payment_status')
                    ->withTimestamps();
    }

    public function recurrence()
    {
        return $this->hasOne(Recurrence::class);
    }

    public function recurrenceData()
{
    return $this->hasOne(\App\Models\Recurrence::class, 'transaction_id', 'id');
}

    
    

}

