namespace App\Listeners;

use App\Notifications\ThankYouNotification;
use Illuminate\Auth\Events\Login;

class SendThankYouNotification
{
    public function handle(Login $event): void
    {
        // $event->user huwa l-utilisateur li ylh dkhl
        // notify() ghadi tsift lih l-mail b-style li qadinah
        $event->user->notify(new ThankYouNotification());
    }
}

