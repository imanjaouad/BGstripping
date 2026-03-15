<?php

namespace App\Http\Controllers;
use App\Mail\SendContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Mail;
use App\Notifications\ContactNotification; 

class ContactController extends Controller
{
    public function show()
    {
        return view('contact');
    }

    public function send(Request $request) {
    $data = $request->validate([
        'name' => 'required',
        'email' => 'required|email',
        'subject' => 'required',
        'message' => 'required',
    ]);

    // Sift l-mail
    Mail::to('subscribenownow@gmail.com')->send(new SendContactMessage($data));

    return back()->with('success', 'Email sent successfully!');
    }
}

