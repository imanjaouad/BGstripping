<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-10">

    <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        
        @if(session('success'))
            <div class="mb-4 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                {{ session('success') }}
            </div>
        @endif

        <form action="{{ route('contact.send') }}" method="POST" class="space-y-4">
            @csrf

            <!-- Name -->
            <div>
                <label class="block text-gray-700 font-medium mb-1">Name</label>
                <input type="text" name="name" placeholder="Name" 
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600">
            </div>

            <!-- Email -->
            <div>
                <label class="block text-gray-700 font-medium mb-1">Email</label>
                <input type="email" name="email" placeholder="Email" 
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600">
            </div>

            <!-- Subject -->
            <div>
                <label class="block text-gray-700 font-medium mb-1">Subject</label>
                <input type="text" name="subject" placeholder="Subject" 
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600">
            </div>

            <!-- Message -->
            <div>
                <label class="block text-gray-700 font-medium mb-1">Message</label>
                <textarea name="message" rows="6" placeholder="Write your message" 
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600"></textarea>
            </div>

            <!-- Submit Button (Centered) -->
            <div class="flex justify-center mt-6">
                <button type="submit" 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-md transition duration-200 shadow-md">
                    Send Message
                </button>
            </div>

        </form>
    </div>

</body>
</html>