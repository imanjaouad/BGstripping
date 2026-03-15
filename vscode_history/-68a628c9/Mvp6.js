const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      nom,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1d" });

    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};