<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MonthlyFinancialReportEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $reportData;
    public $monthYear;
    /**
     * Create a new message instance.
     *
     * @param  mixed  $reportData
     */
    public function __construct($reportData)
    {
        $this->reportData = $reportData;
        $this->monthYear = $reportData['monthYear'];
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Monthly Financial Report Email - ' . $this->monthYear,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.monthly-financial-report',
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
