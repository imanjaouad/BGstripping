<!DOCTYPE html>
<html>
<head>
    <title>New Contact Message</title>
</head>
<body>
    <h2>Jana message jdid!</h2>
    <p><strong>Name:</strong> {{ $messageData['name'] }}</p>
    <p><strong>Email:</strong> {{ $messageData['email'] }}</p>
    <p><strong>Subject:</strong> {{ $messageData['subject'] }}</p>
    <p><strong>Message:</strong></p>
    <p>{{ $messageData['message'] }}</p>
</body>
</html>