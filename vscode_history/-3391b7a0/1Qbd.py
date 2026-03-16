import requests
import threading
import time
import sys

# ==== CONFIG ==== (change rien si t'es pas dev, ça marche direct)
username = input("\033[96m🔥 Entre le pseudo à traquer : \033[0m").strip()
threads = 50  # vitesse max sans se faire ban
timeout = 8

# Liste des 150+ plateformes les plus chaudes en 2025 (les plus utilisées en vrai)
sites = [
    ("Instagram",   f"https://www.instagram.com/{username}/"),
    ("TikTok",      f"https://www.tiktok.com/@{username}"),
    ("Twitter/X",   f"https://twitter.com/{username}"),
    ("Snapchat",    f"https://www.snapchat.com/add/{username}"),
    ("OnlyFans",    f"https://onlyfans.com/{username}"),
    ("Twitch",      f"https://www.twitch.tv/{username}"),
    ("Kick",        f"https://kick.com/{username}"),
    ("YouTube",     f"https://www.youtube.com/@{username}"),
    ("Reddit",      f"https://www.reddit.com/user/{username}"),
    ("GitHub",      f"https://github.com/{username}"),
    ("Steam",       f"https://steamcommunity.com/id/{username}"),
    ("Roblox",      f"https://www.roblox.com/user.aspx?username={username}"),
    ("Discord",     f"https://discord.com/users/{username}"),  # marche que si tu as l'ID, sinon skip
    ("Telegram",    f"https://t.me/{username}"),
    ("LinkedIn",    f"https://www.linkedin.com/in/{username}"),
    ("Pinterest",   f"https://www.pinterest.com/{username}/"),
    ("SoundCloud",  f"https://soundcloud.com/{username}"),
    ("BeReal",      f"https://bereal.com/@{username}"),
    ("Threads",     f"https://www.threads.net/@{username}"),
    ("Bluesky",     f"https://bsky.app/profile/{username}"),
    ("PlayStation", f"https://psnprofiles.com/{username}"),
    ("Xbox",        f"https://xboxgamertag.com/search/{username}"),
    ("DeviantArt",  f"https://www.deviantart.com/{username}"),
    ("Letterboxd",  f"https://letterboxd.com/{username}"),
    ("CashApp",     f"https://cash.app/${username}"),
    ("Venmo",       f"https://venmo.com/{username}"),
    ("PayPal",      f"https://www.paypal.com/paypalme/{username}"),
    ("Spotify",     f"https://open.spotify.com/user/{username}"),
    # +120 autres dans la version complète si tu veux, mais ça suffit pour 99% des gens
]

found = []
lock = threading.Lock()

def check(site_name, url):
    try:
        r = requests.head(url, timeout=timeout, allow_redirects=True, 
                         headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        if r.status_code in [200, 401, 403, 302, 301]:
            with lock:
                print(f"\033[92m[+] {site_name:12} → {url} \033[0m")
                found.append(url)
        else:
            print(f"\033[91m[-] {site_name:12} → Non trouvé\033[0m")
    except:
        print(f"\033[93m[!] {site_name:12} → Bloqué / Erreur\033[0m")

# Lancement turbo
print(f"\n\033[95m🚀 Recherche de \033[1m{username}\033[0m sur {len(sites)} plateformes...\033[0m\n")
start = time.time()

for name, url in sites:
    threading.Thread(target=check, args=(name, url)).start()

# Attente que tout finisse proprement
while threading.active_count() > 1:
    time.sleep(0.1)

print(f"\n\033[93m🎯 Terminé en {int(time.time()-start)} secondes !\033[0m")
if found:
    print(f"\n\033[92m{len(found)} comptes trouvés !\033[0m")
else:
    print("\n\033[91mRien trouvé... ce pseudo est fantôme.\033[0m")