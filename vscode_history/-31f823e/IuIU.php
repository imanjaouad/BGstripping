<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public $messageData; // Hada hwa li ghadi i-haz l-ma3lomat

    public function __construct($messageData)
    {
        $this->messageData = $messageData;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->messageData['subject'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact', // Ghadi nqado had l-view daba
        );
    }
}return new Content(
        view: 'emails.contact',