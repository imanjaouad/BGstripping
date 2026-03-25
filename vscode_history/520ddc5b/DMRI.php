protected $fillable = ['content', 'user_id'];

// Relation : Un post appartient à un utilisateur
public function user() {
    return $this->belongsTo(User::class);
}