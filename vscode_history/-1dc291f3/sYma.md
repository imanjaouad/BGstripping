# Générateur de Liens Sociaux

Un site web statique moderne et honnête qui génère des liens de recherche pour 12+ plateformes sociales.

## 🎯 Objectif du projet

Créer un outil **rapide et pratique** qui génère automatiquement tous les liens de recherche pour un nom d'utilisateur sur les principales plateformes sociales.

## ⚠️ Ce qu'il fait :

### ✅ **Fonctionnalités réelles :**
- **Génère des liens de recherche** pour 12+ plateformes sociales
- **Ouvre plusieurs pages** simultanément avec un clic
- **Sauvegarde l'historique** localement dans votre navigateur
- **Vérifie les formats** (ex: pas d'espaces sur Twitter)
- **Interface moderne** avec Tailwind CSS

### ❌ **Limitations importantes :**
- **Ne peut PAS vérifier** si les comptes existent réellement
- **Ne se connecte PAS** aux API des plateformes  
- **N'accède PAS** aux données privées des utilisateurs
- **Ne contourne PAS** les protections anti-bot

## 🚀 Utilisation

### Recherche rapide :
1. Entrez un nom d'utilisateur (ex: `john`, `marie`, `alex2024`)
2. Cliquez sur **"Générer les liens"**
3. Cliquez sur **"Ouvrir la recherche"** sur chaque plateforme
4. Vérifiez manuellement sur chaque site si le compte existe

### Astuces :
- Utilisez des **noms courts et simples** pour plus de chances
- Essayez **plusieurs variantes** du même nom
- Certains sites nécessitent une **connexion** pour voir les résultats

## 📱 Plateformes supportées

| Plateforme | Lien généré | Description |
|------------|-------------|-------------|
| Instagram | `instagram.com/nom` | Profil direct |
| Facebook | `facebook.com/search/people/?q=nom` | Recherche de personnes |
| X (Twitter) | `twitter.com/search?q=nom` | Recherche de tweets/profils |
| TikTok | `tiktok.com/@nom` | Profil TikTok |
| LinkedIn | `linkedin.com/search/results/people/?keywords=nom` | Recherche professionnelle |
| YouTube | `youtube.com/results?search_query=nom` | Recherche de chaînes |
| Snapchat | `snapchat.com/add/nom` | Ajout d'ami |
| Telegram | `t.me/nom` | Groupe/canal |
| Reddit | `reddit.com/search/?q=nom` | Recherche d'utilisateur |
| WhatsApp | `wa.me/nom` | Chat direct |
| Discord | `discord.com/users/nom` | Profil utilisateur |
| Twitch | `twitch.tv/nom` | Chaîne de streaming |

## 🛠️ Technologies

### Frontend :
- **HTML5** avec structure sémantique
- **Tailwind CSS** via CDN pour le styling moderne
- **Font Awesome** pour les icônes des réseaux sociaux
- **Google Fonts** (Inter) pour la typographie

### JavaScript :
- **Vanilla JavaScript ES6+** sans dépendances
- **LocalStorage API** pour le stockage local
- **Web APIs** pour la gestion des popups

## 📁 Structure des fichiers

