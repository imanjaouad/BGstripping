use App\Models\User;

// Admin
User::create([
    'name' => 'Admin Test',
    'email' => 'admin@test.com',
    'password' => bcrypt('password'),
    'role' => 'admin'
]);

// User
User::create([
    'name' => 'User Test',
    'email' => 'user@test.com',
    'password' => bcrypt('password'),
    'role' => 'user'
]);

// Finance
User::create([
    'name' => 'Finance Test',
    'email' => 'finance@test.com',
    'password' => bcrypt('password'),
    'role' => 'finance'
]);

// Director
User::create([
    'name' => 'Director Test',
    'email' => 'director@test.com',
    'password' => bcrypt('password'),
    'role' => 'director'
]);