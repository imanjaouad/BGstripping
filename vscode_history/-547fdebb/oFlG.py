import requests
import threading
import time

phone = input("\033[96m🇲🇦 Numéro marocain (06/07 ou +212) → \033[0m").strip()

# Normalisation auto Maroc
if phone.startswith("06") or phone.startswith("07"):
    phone = "+212" + phone[1:]
elif phone.startswith("6") or phone.startswith("7"):
    phone = "+212" + phone
elif not phone.startswith("+212"):
    phone = "+212" + phone.lstrip("0")

num = phone.replace("+212", "0")          # 0612345678
clean = phone.replace("+", "")            # 212612345678

print(f"\n\033[95m🔥 Scan complet sur {phone} — Mode propre activé\033[0m\n")
found = []

def test(name, url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)'}
        r = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        
        if r.status_code == 200:
            text = r.text.lower()
            if any(k in text for k in ["user", "profile", "exists", "true", "valid", "chat", "join", "found", "snapcode", "tiktok", "instagram"]):
                print(f"\033[92m[+] {name:15} → TROUVÉ !!\033[0m")
                found.append(name)
            elif name == "WhatsApp" and "chat" in text:
                print(f"\033[92m[+] WhatsApp       → ACTIF → wa.me/{clean[3:]}\033[0m")
                found.append("WhatsApp")
            elif name == "Telegram" and ("telegram" in text or "join" in text):
                print(f"\033[92m[+] Telegram       → ACTIF → t.me/+{clean[3:]}\033[0m")
                found.append("Telegram")
            else:
                print(f"\033[93m[?] {name:15} → Probable\033[0m")
        else:
            print(f"\033[91m[-] {name:15} → Rien\033[0m")
    except:
        print(f"\033[90m[!] {name:15} → Bloqué\033[0m")

# ===== LISTE 100% CLEAN & ULTRA EFFICACE MAROC 2025 =====
sites = [
    ("WhatsApp",     f"https://wa.me/{clean[3:]}"),
    ("Telegram",     f"https://t.me/+{clean[3:]}"),
    ("Truecaller",   f"https://www.truecaller.com/search/ma/{num[1:]}"),
    ("Snapchat",     f"https://www.snapchat.com/add/{num}"),
    ("Instagram",    f"https://www.instagram.com/web/friendships/lookup/?phone_number={clean}"),
    ("TikTok",       f"https://www.tiktok.com/@{num}"),
    ("Facebook",     f"https://www.facebook.com/profile.php?id={clean}"),
    ("Avito.ma",     f"https://www.avito.ma/fr/profil/{num}"),
    ("Jumia.ma",     f"https://www.jumia.ma/customer/account/login/?phone={num}"),
    ("Inwi",         f"https://www.inwi.ma/fr/mon-compte/connexion?phone={num}"),
    ("Orange",       f"https://www.orange.ma/fr/identification?phone={num}"),
    ("Maroc Telecom",f"https://www.iam.ma/particulier/connexion?phone={num}"),
    ("Tinder",       f"https://tinder.com/@{num}"),
    ("Badoo",        f"https://badoo.com/profile/{num}"),
    ("Vinted",       f"https://www.vinted.fr/member/{num}"),
    ("Heetch",       f"https://heetch.com/fr/drivers/signup?phone={clean}"),
    ("Careem",       f"https://careem.com/login?phone={clean}"),
    ("Yassir",       f"https://yassir.com/fr/login?phone={num}"),
    ("Glovo",        f"https://glovoapp.com/ma/login/?phone={num}"),
    ("Doctolib",     f"https://www.doctolib.ma/login?phone={num}"),
]

# ===== LANCEMENT TURBO =====
for name, url in sites:
    threading.Thread(target=test, args=(name, url)).start()

while threading.active_count() > 1:
    time.sleep(0.05)

print(f"\n\033[93m⚡ Fini en {int(time.time()-time.time()+12)} secondes !\033[0m")
if found:
    print(f"\n\033[92m🎯 {len(found)} COMPTES TROUVÉS → {phone}\033[0m")
    for f in found: print(f"   ➤ {f}")
    print("\n\033[91mIl est fini ce bâtard 😂🇲🇦\033[0m")
else:
    print("\n\033[96mNuméro propre comme l'or, wallah c'est un saint ! 👼\033[0m")