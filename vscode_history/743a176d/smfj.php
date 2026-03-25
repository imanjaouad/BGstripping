Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique(); // admin, user, finance
    $table->timestamps();
});

Schema::create('role_user', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});