<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GroupExpenseEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $participant;
    public $transaction;
    public $amountOwed;
    public $markAsPaidUrl;
    public $base64Image;

    /**
     * Create a new message instance.
     *
     * @param mixed $participant
     * @param mixed $transaction
     * @param float $amountOwed
     * @param string $markAsPaidUrl
     * @param string|null $base64Image
     */
    public function __construct($participant, $transaction, $amountOwed, $markAsPaidUrl, $base64Image = null)
    {
        $this->participant   = $participant;
        $this->transaction   = $transaction;
        $this->amountOwed    = $amountOwed;
        $this->markAsPaidUrl = $markAsPaidUrl;
        $this->base64Image   = $base64Image;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Group Expense Payment'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.group-expense-notification'
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
