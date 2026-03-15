<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactNotification extends Notification
{
    use Queueable;

    public $details;

    public function __construct($details)
    {
        $this->details = $details;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject($this->details['subject'])
                    ->greeting('Salam ' . $this->details['name'] . '!')
                    ->line('Jana message jdid men l-formulaire:')
                    ->line('Subject: ' . $this->details['subject'])
                    ->line('Message: ' . $this->details['message'])
                    ->line('User Email: ' . $this->details['email'])
                    ->salutation('Regards, ' . config('app.name'));
    }
}