<?php

namespace App\Http\Controllers;
use App\Mail\SendContactMessage;
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

        
        Notification::route('mail', $data['email'])->notify(new ContactNotification($data));

        return back()->with('success', 'Your message has been sent to your Gmail!');
    }
}