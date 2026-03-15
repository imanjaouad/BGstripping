import requests
import threading
import time
import sys

# =============== CONFIG ===============
phone = input("\033[96m📱 Entre le numéro avec indicatif (ex: +33612345678 ou 0612345678) → \033[0m").strip()

# Normalisation du numéro
if not phone.startswith('+'):
    if phone.startswith('0'):
        phone = '+33' + phone[1:]  # France
    elif len(phone) == 10:
        phone = '+33' + phone
    else:
        phone = '+' + phone

print(f"\n\033[95m🔥 Recherche de tous les comptes liés à {phone} ...\033[0m\n")

# =============== LISTE DES PLATEFORMES (les plus efficaces en 2025) ===============
platforms = [
    ("WhatsApp",        f"https://wa.me/{phone[1:]}"),
    ("Telegram",        f"https://t.me/+{phone[1:]}"),
    ("Snapchat",        f"https://www.snapchat.com/add/?phone={phone[1:]}"),
    ("Instagram",       f"https://www.instagram.com/api/v1/users/lookup/?phone_number={phone}"),
    ("TikTok",          f"https://www.tiktok.com/api/user/detail/?phone_number={phone[1:]}"),
    ("Vinted",          f"https://www.vinted.fr/api/v2/users?phone={phone}"),
    ("Leboncoin",       f"https://api.leboncoin.fr/api/accounts/v1/accounts/search?phone={phone}"),
    ("Truecaller",      f"https://www.truecaller.com/search/{phone[1:]}"),
    ("Signal",          f"https://signal.me/#{phone[1:]}"),
    ("Discord",         f"https://discord.com/register?phone={phone[1:]}"),
    ("Twitter/X",       f"https://twitter.com/i/flow/signup?phone={phone[1:]}"),
    ("Facebook",        f"https://www.facebook.com/recover/initiate/?phone={phone}"),
    ("Google",          f"https://accounts.google.com/signin/recovery?phone={phone}"),
    ("Apple ID",        f"https://iforgot.apple.com/phone?phone={phone}"),
    ("PayPal",          f"https://www.paypal.com/signin?phone={phone}"),
    ("Deliveroo",       f"https://deliveroo.fr/fr/login?phone={phone}"),
    ("Uber Eats",       f"https://www.ubereats.com/fr/login?phone={phone}"),
    ("Blablacar",       f"https://www.blablacar.fr/login?phone={phone}"),
    ("Doctolib",        f"https://www.doctolib.fr/account/login?phone={phone}"),
    ("Ameli",           f"https://assure.ameli.fr/PortailAS/appmanager/assure/connexion?phone={phone}"),
    ("Impots.gouv",     f"https://cfspart.impots.gouv.fr/LoginSSO?phone={phone}"),
]

found = []
lock = threading.Lock()

def check(name, url, method="GET", json_data=None):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            'Accept': 'application/json',
            'Referer': 'https://www.google.com/'
        }
        
        if method == "HEAD":
            r = requests.head(url, headers=headers, timeout=10, allow_redirects=True)
        else:
            r = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        
        # Codes qui prouvent que le compte existe
        if r.status_code in [200, 201, 302, 303, 401, 403, 404]:
            if any(x in r.text.lower() for x in ['"is_valid":true', '"exists":true', '"user"', '"account"', 'snapchat', 'tiktok', 'vinted', 'truecaller', 'profile', 'found']):
                with lock:
                    print(f"\033[92m[+] {name:15} → COMPTE TROUVÉ ! {url}\033[0m")
                    found.append(f"{name} → {url}")
                return
            
            # Exceptions spéciales
            if name == "WhatsApp" and "Click here to chat" in r.text:
                print(f"\033[92m[+] {name:15} → COMPTE WHATSAPP TROUVÉ ! {url}\033[0m")
                found.append(f"WhatsApp → {url}")
            elif name == "Telegram" and ("Telegram" in r.text or "Join" in r.text):
                print(f"\033[92m[+] {name:15} → COMPTE TELEGRAM TROUVÉ ! tg://resolve?phone={phone[1:]}\033[0m")
                found.append(f"Telegram → @{phone[1:]}")
            elif name == "Snapchat" and r.status_code == 200:
                print(f"\033[92m[+] {name:15} → SNAP TROUVÉ ! snapchat://add/{phone[1:]}\033[0m")
                found.append(f"Snapchat → {phone}")
            else:
                print(f"\033[93m[?] {name:15} → Probablement existe (code {r.status_code})\033[0m")
        else:
            print(f"\033[91m[-] {name:15} → Non trouvé\033[0m")
            
    except:
        print(f"\033[90m[!] {name:15} → Bloqué ou erreur\033[0m")

# =============== LANCEMENT TURBO ===============
start = time.time()

for name, url in platforms:
    threading.Thread(target=check, args=(name, url)).start()

# Attente fin
while threading.active_count() > 1:
    time.sleep(0.1)

print(f"\n\033[93m⚡ Terminé en {int(time.time()-start)} secondes !\033[0m")
if found:
    print(f"\n\033[92m🎯 {len(found)} COMPTES TROUVÉS POUR {phone} :\033[0m")
    for f in found:
        print(f"   • {f}")
    print(f"\n\033[91mCe numéro est cramé mon pote... 🔥\033[0m")
else:
    print("\n\033[96mCe numéro est un fantôme... propre comme jamais. 👻\033[0m")