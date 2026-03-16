<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
// DARORI TZID HAD L-ASTIR L-TEHT BACH YA3REF CHNU HUWA ContactNotification
use App\Notifications\ContactNotification; 

class ContactController extends Controller
{
    public function show()
    {
        return view('contact');
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'subject' => 'required',
            'message' => 'required',
        ]);

        // Sift Notification l-dak l-email li mktoub f l-form
        Notification::route('mail', $data['email'])->notify(new ContactNotification($data));

        // Ghadi n-badlo l-message hit rak kheddam b-Gmail daba machi Mailtrap
        return back()->with('success', 'Your message has been sent to your Gmail!');
    }
}