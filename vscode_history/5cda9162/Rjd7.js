// Configuration des plateformes - SOLUTIONS MULTIPLES POUR FACEBOOK
const platforms = {
    instagram: {
        name: 'Instagram',
        icon: 'fab fa-instagram',
        color: '#e4405f',
        searchUrl: 'https://www.instagram.com/{username}',
        description: 'Ouvre le profil Instagram'
    },
    facebook: {
        name: 'Facebook (via Google)',
        icon: 'fab fa-facebook',
        color: '#1877f2',
        searchUrl: 'https://www.google.com/search?q=site:facebook.com+"{username}"+profil',
        alternativeUrl: 'https://www.google.com/search?q=site:facebook.com+intitle:{username}+site:facebook.com',
        description: 'Recherche via Google (contournement)'
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

// Créer une carte de plateforme
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
    let url = platform.searchUrl.replace('{username}', encodeURIComponent(username));
    
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

// Solution ultime pour Facebook - ASSISTANT DE RECHERCHE
function createFacebookAssistant(username) {
    updatePlatformStatus('facebook', 'Assistant prêt 📋');
    
    // Créer plusieurs liens de recherche pour Facebook
    const googleSearchUrl = `https://www.google.com/search?q=site:facebook.com+"${encodeURIComponent(username)}"+profil`;
    const googleSearchUrl2 = `https://www.google.com/search?q=site:facebook.com+intitle:"${encodeURIComponent(username)}"+site:facebook.com`;
    const facebookDirectoryUrl = `https://www.facebook.com/directory/people/${encodeURIComponent(username)}`;
    
    // Message détaillé avec plusieurs solutions
    const message = `
        <div style="max-width: 600px; text-align: left; line-height: 1.6;">
            <h4 style="color: #1877f2; margin-bottom: 15px; font-size: 18px;">
                <i class="fab fa-facebook" style="margin-right: 8px;"></i>
                Facebook bloque les liens directs ! Voici les solutions :
            </h4>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1877f2;">
                <strong style="color: #1877f2;">🔗 Solution 1 : Recherche via Google</strong><br>
                <div style="background: white; padding: 8px; border-radius: 4px; margin: 8px 0; font-family: monospace; font-size: 12px; word-break: break-all;">
                    ${googleSearchUrl}
                </div>
                <button onclick="copyToClipboard('${googleSearchUrl}')" style="background: #1877f2; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin: 5px 5px 5px 0; cursor: pointer; font-size: 12px;">
                    <i class="fas fa-copy"></i> Copier
                </button>
                <button onclick="window.open('${googleSearchUrl}', '_blank')" style="background: #42b72a; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin: 5px 5px 5px 0; cursor: pointer; font-size: 12px;">
                    <i class="fas fa-external-link-alt"></i> Ouvrir
                </button>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #42b72a;">
                <strong style="color: #42b72a;">🔍 Solution 2 : Recherche alternative</strong><br>
                <div style="background: white; padding: 8px; border-radius: 4px; margin: 8px 0; font-family: monospace; font-size: 12px; word-break: break-all;">
                    ${googleSearchUrl2}
                </div>
                <button onclick="copyToClipboard('${googleSearchUrl2}')" style="background: #42b72a; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin: 5px 5px 5px 0; cursor: pointer; font-size: 12px;">
                    <i class="fas fa-copy"></i> Copier
                </button>
                <button onclick="window.open('${googleSearchUrl2}', '_blank')" style="background: #1877f2; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin: 5px 5px 5px 0; cursor: pointer; font-size: 12px;">
                    <i class="fas fa-external-link-alt"></i> Ouvrir
                </button>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
                <strong style="color: #856404;">💡 Solution 3 : Manuelle</strong><br>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Allez sur <strong>Facebook.com</strong></li>
                    <li style="margin-bottom: 8px;">Tapez <strong>"${username}"</strong> dans la barre de recherche</li>
                    <li style="margin-bottom: 8px;">Cliquez sur <strong>"Personnes"</strong> dans les filtres</li>
                    <li style="margin-bottom: 8px;">Explorez les résultats qui apparaissent</li>
                </ol>
            </div>
            
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #17a2b8;">
                <strong style="color: #0c5460;">📋 Astuce pro :</strong><br>
                Vous pouvez aussi essayer des variantes : <strong>"${username}2024"</strong>, <strong>"${username}_officiel"</strong>, <strong>"${username}.fr"</strong>
            </div>
        </div>
    `;
    
    showNotification(message, 'warning');
    
    // Essayer d'ouvrir le lien Google quand même
    setTimeout(() => {
        window.open(googleSearchUrl, '_blank');
    }, 1500);
}

// Fonction pour copier dans le presse-papiers
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('✅ Lien copié dans le presse-papiers !', 'success');
    }, function(err) {
        console.error('Erreur lors de la copie : ', err);
        // Fallback pour les anciens navigateurs
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('✅ Lien copié !', 'success');
    });
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
            <div>${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 8 secondes pour Facebook
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 8000);
}
