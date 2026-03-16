## 📄 **Code COMPLET du fichier `js/main.js` (version ultime) :**

```javascript
// Configuration des plateformes - GÉNÉRATEUR DE LIENS
const platforms = {
    instagram: {
        name: 'Instagram',
        icon: 'fab fa-instagram',
        color: '#e4405f',
        searchUrl: 'https://www.instagram.com/{username}',
        description: 'Ouvre le profil Instagram'
    },
    facebook: {
        name: 'Facebook',
        icon: 'fab fa-facebook',
        color: '#1877f2',
        searchUrl: 'https://m.facebook.com/search/people/?q={username}',
        description: 'Recherche Facebook (méthode mobile)'
    },
    twitter: {
        name: 'X (Twitter)',
        icon: 'fab fa-x-twitter',
        color: '#000000',
        searchUrl: 'https://twitter.com/search?q={username}&src=typed_query',
        description: 'Recherche sur X (Twitter)'
    },
    tiktok: {
        name: 'TikTok',
        icon: 'fab fa-tiktok',
        color: '#ff0050',
        searchUrl: 'https://www.tiktok.com/@{username}',
        description: 'Profil TikTok'
    },
    linkedin: {
        name: 'LinkedIn',
        icon: 'fab fa-linkedin',
        color: '#0077b5',
        searchUrl: 'https://www.linkedin.com/search/results/people/?keywords={username}',
        description: 'Recherche de professionnels'
    },
    youtube: {
        name: 'YouTube',
        icon: 'fab fa-youtube',
        color: '#ff0000',
        searchUrl: 'https://www.youtube.com/results?search_query={username}',
        description: 'Recherche de chaînes YouTube'
    },
    snapchat: {
        name: 'Snapchat',
        icon: 'fab fa-snapchat',
        color: '#fffc00',
        searchUrl: 'https://www.snapchat.com/add/{username}',
        description: 'Ajout d\'ami Snapchat'
    },
    telegram: {
        name: 'Telegram',
        icon: 'fab fa-telegram',
        color: '#0088cc',
        searchUrl: 'https://t.me/{username}',
        description: 'Groupe ou canal Telegram'
    },
    reddit: {
        name: 'Reddit',
        icon: 'fab fa-reddit',
        color: '#ff4500',
        searchUrl: 'https://www.reddit.com/search/?q={username}',
        description: 'Recherche d\'utilisateur Reddit'
    },
    whatsapp: {
        name: 'WhatsApp',
        icon: 'fab fa-whatsapp',
        color: '#25d366',
        searchUrl: 'https://wa.me/{username}',
        description: 'Chat WhatsApp direct'
    },
    discord: {
        name: 'Discord',
        icon: 'fab fa-discord',
        color: '#5865f2',
        searchUrl: 'https://discord.com/users/{username}',
        description: 'Profil Discord'
    },
    twitch: {
        name: 'Twitch',
        icon: 'fab fa-twitch',
        color: '#9146ff',
        searchUrl: 'https://www.twitch.tv/{username}',
        description: 'Chaîne de streaming Twitch'
    }
};

// Variables globales
let searchHistory = JSON.parse(localStorage.getItem('socialSearchHistory')) || [];
let currentResults = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadSearchHistory();
    generatePlatformCards();
});

// Initialiser les écouteurs d'événements
function initializeEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const usernameInput = document.getElementById('username');
    const clearHistoryBtn = document.getElementById('clearHistory');

    searchBtn.addEventListener('click', performSearch);
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// Générer les cartes de plateformes
function generatePlatformCards() {
    const grid = document.getElementById('platformsGrid');
    grid.innerHTML = '';

    Object.keys(platforms).forEach(platformKey => {
        const platform = platforms[platformKey];
        const card = createPlatformCard(platformKey, platform);
        grid.appendChild(card);
    });
}

// Créer une carte de plateforme - VERSION HONNÊTE
function createPlatformCard(platformKey, platform) {
    const card = document.createElement('div');
    card.className = 'platform-card bg-white rounded-xl shadow-lg p-6 text-center';
    card.style.borderTop = `4px solid ${platform.color}`;
    
    card.innerHTML = `
        <div class="mb-4">
            <i class="${platform.icon} text-4xl" style="color: ${platform.color}"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">${platform.name}</h3>
        <p class="text-gray-600 text-sm mb-4">${platform.description}</p>
        <div class="space-y-2">
            <button 
                class="open-link-btn w-full px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90" 
                onclick="openPlatformLink('${platformKey}', '${platform.name}')" 
                style="background-color: ${platform.color}">
                <i class="fas fa-external-link-alt mr-2"></i>Ouvrir la recherche
            </button>
        </div>
        <div class="status-indicator mt-3 hidden">
            <span class="text-xs text-gray-500"></span>
        </div>
    `;
    
    return card;
}

// Générer les liens de recherche
function performSearch() {
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        showNotification('Veuillez entrer un nom d\'utilisateur', 'error');
        return;
    }

    // Afficher le spinner de chargement
    showLoadingSpinner(true);
    
    // Ajouter à l'historique
    addToHistory(username);
    
    // Générer tous les liens
    currentResults = [];
    let validLinks = 0;

    Object.keys(platforms).forEach(platformKey => {
        const platform = platforms[platformKey];
        const searchUrl = platform.searchUrl.replace('{username}', encodeURIComponent(username));
        
        currentResults.push({
            platform: platformKey,
            url: searchUrl,
            name: platform.name
        });
        
        validLinks++;
        updatePlatformStatus(platformKey, 'Lien prêt ✅');
    });

    // Cacher le spinner
    showLoadingSpinner(false);
    updateResultsCounter(validLinks);
    
    showNotification(`${validLinks} liens générés ! Cliquez sur \"Ouvrir la recherche\" pour lancer les recherches.`, 'success');
}

// Ouvrir le lien d'une plateforme - SOLUTION ULTIME POUR FACEBOOK
function openPlatformLink(platformKey, platformName) {
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        showNotification('Veuillez d\'abord entrer un nom d\'utilisateur', 'warning');
        return;
    }

    const platform = platforms[platformKey];
    let url = platform.searchUrl.replace('{username}', encodeURIComponent(username)};
    
    // SOLUTION ULTIME POUR FACEBOOK
    if (platformKey === 'facebook') {
        // Créer une solution de copier-coller assistée
        createFacebookAssistant(username);
        return;
    }
    
    // Pour les autres plateformes : ouvrir normalement
    window.open(url, '_blank');
    updatePlatformStatus(platformKey, 'Lien ouvert 🚀');
    showNotification(`Recherche lancée sur ${platformName} !`, 'info');
}

// Solution ultime pour Facebook - ASSISTANT DE COPIER-COLLER
function createFacebookAssistant(username) {
    updatePlatformStatus('facebook', 'Assistant prêt 📋');
    
    // Créer le lien de recherche Facebook
    const facebookSearchUrl = `https://m.facebook.com/search/people/?q=${encodeURIComponent(username)}`;
    
    // Message détaillé avec instructions
    const message = `
        <div style="max-width: 500px; text-align: left;">
            <h4 style="color: #1877f2; margin-bottom: 10px;"><i class="fab fa-facebook" style="margin-right: 5px;"></i>Facebook bloque les liens directs !</h4>
            
            <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <strong>🔗 Lien généré :</strong><br>
                <code style="background: white; padding: 5px; border: 1px solid #ccc; border-radius: 3px; display: block; margin: 5px 0; word-break: break-all;">${facebookSearchUrl}</code>
                <button onclick="copyToClipboard('${facebookSearchUrl}')" style="background: #1877f2; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin-top: 5px; cursor: pointer;">
                    <i class="fas fa-copy" style="margin-right: 5px;"></i>Copier le lien
                </button>
            </div>
            
            <div style="margin: 15px 0;">
                <strong>📋 Instructions :</strong>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>Copiez</strong> le lien ci-dessus</li>
                    <li style="margin-bottom: 8px;"><strong>Ouvrez</strong> une nouvelle fenêtre/navigateur</li>
                    <li style="margin-bottom: 8px;"><strong>Collez</strong> le lien dans la barre d'adresse</li>
                    <li style="margin-bottom: 8px;"><strong>Ou</strong> allez sur Facebook.com et cherchez "${username}"</li>
                </ol>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <strong>💡 Astuce :</strong> Vous pouvez aussi aller directement sur Facebook.com et taper "${username}" dans la barre de recherche.
            </div>
        </div>
    `;
    
    showNotification(message, 'warning');
    
    // Essayer quand même d'ouvrir le lien dans un nouvel onglet
    setTimeout(() => {
        const newWindow = window.open(facebookSearchUrl, '_blank');
        if (!newWindow || newWindow.closed) {
            // Si le popup est bloqué, ne rien faire (l'utilisateur a déjà les instructions)
            console.log('Popup bloqué, instructions affichées');