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

// Ouvrir le lien d'une plateforme - VERSION AMÉLIORÉE POUR FACEBOOK
function openPlatformLink(platformKey, platformName) {
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        showNotification('Veuillez d\'abord entrer un nom d\'utilisateur', 'warning');
        return;
    }

    const platform = platforms[platformKey];
    let url = platform.searchUrl.replace('{username}', encodeURIComponent(username));
    
    // Solution spéciale pour Facebook
    if (platformKey === 'facebook') {
        // Méthode 1 : Essayer l'URL mobile d'abord
        const mobileUrl = `https://m.facebook.com/search/people/?q=${encodeURIComponent(username)}`;
        
        // Méthode 2 : Si ça échoue, proposer une solution alternative
        showFacebookSolution(username, mobileUrl);
        return;
    }
    
    // Pour les autres plateformes : ouvrir normalement
    window.open(url, '_blank');
    updatePlatformStatus(platformKey, 'Lien ouvert 🚀');
    showNotification(`Recherche lancée sur ${platformName} !`, 'info');
}

// Solution alternative pour Facebook
function showFacebookSolution(username, mobileUrl) {
    updatePlatformStatus('facebook', 'Méthode alternative 📱');
    
    // Message détaillé pour Facebook
    const message = `
        <div style="max-width: 400px;">
            <strong>Facebook bloque les liens directs !</strong><br><br>
            <strong>Solution 1 :</strong> <a href="${mobileUrl}" target="_blank" style="color: #1877f2; text-decoration: underline;">Cliquez ici pour essayer la version mobile</a><br><br>
            <strong>Solution 2 :</strong> Copiez ce lien :<br>
            <code style="background: #f0f0f0; padding: 5px; border-radius: 3px;">${mobileUrl}</code><br><br>
            <strong>Solution 3 :</strong> Allez sur Facebook.com et cherchez "${username}" manuellement
        </div>
    `;
    
    showNotification(message, 'warning');
    
    // Essayer quand même d'ouvrir le lien mobile
    setTimeout(() => {
        window.open(mobileUrl, '_blank');
    }, 1000);
}

// Mettre à jour le statut d'une plateforme
function updatePlatformStatus(platformKey, status) {
    const card = document.querySelector(`[onclick*="${platformKey}"]`).closest('.platform-card');
    const statusIndicator = card.querySelector('.status-indicator');
    const statusText = card.querySelector('.status-indicator span');
    
    statusIndicator.classList.remove('hidden');
    statusText.textContent = status;
}

// Afficher/cacher le spinner de chargement
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    const grid = document.getElementById('platformsGrid');
    
    if (show) {
        spinner.classList.remove('hidden');
        grid.style.opacity = '0.5';
    } else {
        spinner.classList.add('hidden');
        grid.style.opacity = '1';
    }
}

// Mettre à jour le compteur de résultats
function updateResultsCounter(count) {
    const counter = document.getElementById('resultsCounter');
    const countElement = document.getElementById('resultsCount');
    
    counter.classList.remove('hidden');
    countElement.textContent = count;
}

// Ajouter à l'historique
function addToHistory(username) {
    const timestamp = new Date().toISOString();
    const searchItem = {
        username: username,
        timestamp: timestamp
    };
    
    // Supprimer les doublons
    searchHistory = searchHistory.filter(item => item.username !== username);
    
    // Ajouter en premier
    searchHistory.unshift(searchItem);
    
    // Garder seulement les 10 derniers
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    localStorage.setItem('socialSearchHistory', JSON.stringify(searchHistory));
    loadSearchHistory();
}

// Charger l'historique
function loadSearchHistory() {
    const historyContainer = document.getElementById('searchHistory');
    const clearBtn = document.getElementById('clearHistory');
    
    if (searchHistory.length === 0) {
        historyContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Aucune recherche récente</p>';
        clearBtn.classList.add('hidden');
        return;
    }
    
    clearBtn.classList.remove('hidden');
    historyContainer.innerHTML = '';
    
    searchHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors';
        
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        historyItem.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-user text-gray-500 mr-3"></i>
                <span class="font-medium text-gray-800">${item.username}</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">${dateStr}</span>
                <button onclick="searchFromHistory('${item.username}')" 
                        class="text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        `;
        
        historyContainer.appendChild(historyItem);
    });
}

// Rechercher depuis l'historique
function searchFromHistory(username) {
    document.getElementById('username').value = username;
    performSearch();
}

// Effacer l'historique
function clearHistory() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
        searchHistory = [];
        localStorage.removeItem('socialSearchHistory');
        loadSearchHistory();
        showNotification('Historique effacé', 'success');
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all`;
    
    let bgColor, icon;
    switch(type) {
        case 'success':
            bgColor = 'bg-green-500';
            icon = 'fa-check-circle';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            icon = 'fa-exclamation-triangle';
            break;
        default:
            bgColor = 'bg-blue-500';
            icon = 'fa-info-circle';
    }
    
    notification.className += ` ${bgColor} text-white`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${icon} mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
