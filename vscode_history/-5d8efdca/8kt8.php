<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ContactNotification;

class ContactController extends Controller
{
    // Bach n-werriw l-formulaire
    public function show()
    {
        return view('contact');
    }

    // Bach n-akhdo l-ma3lomat o nsifto l-email
    public function send(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'subject' => 'required',
            'message' => 'required',
        ]);

        // Sift Notification l-dak l-email li mktoub f l-form
        // Ghadi t-mchi l-Mailtrap 
        Notification::route('mail', $data['email'])->notify(new ContactNotification($data));

        return back()->with('success', 'Your message has been sent to Mailtrap!');
    }
}