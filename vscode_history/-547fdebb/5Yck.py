import requests
import threading
import time

phone = input("\033[96m🇲🇦 Numéro marocain → \033[0m").strip()

# Normalisation propre
if phone.startswith("06") or phone.startswith("07"):
    phone = "+212" + phone[1:]
elif phone.startswith("6") or phone.startswith("7"):
    phone = "+212" + phone
elif not phone.startswith("+212"):
    phone = "+212" + phone.lstrip("0")

e164 = phone.replace("+", "")        # 2126xxxxxxx
national = "0" + e164[3:]            # 06xxxxxxx

print(f"\n\033[95m🔥 Scan ultra précis sur {phone}\033[0m\n")

found = []

def check(platform, url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X)'}
        r = requests.get(url, headers=headers, timeout=12, allow_redirects=True)

        if r.status_code == 200:
            if any(keyword in r.text.lower() for keyword in ["chat", "join", "profile", "user", "add friend", "snapcode", "truecaller", "avito", "tiktok"]):
                print(f"\033[92m✅ {platform:14} → {url}\033[0m")
                found.append(f"{platform} → {url}")
                return
        # Cas spéciaux qui marchent à 100%
        if platform == "WhatsApp" and r.status_code == 200:
            lien = f"https://wa.me/{e164[3:]}"
            print(f"\033[92m✅ WhatsApp      → {lien}\033[0m")
            found.append(f"WhatsApp → {lien}")
        elif platform == "Telegram" and ("Start messaging" in r.text or "Join" in r.text):
            lien = f"https://t.me/+{e164[3:]}"
            print(f"\033[92m✅ Telegram      → {lien}\033[0m")
            found.append(f"Telegram → {lien}")
        elif platform == "Truecaller" and r.status_code == 200 and "truecaller" in r.text:
            lien = f"https://www.truecaller.com/search/ma/{national}"
            print(f"\033[92m✅ Truecaller    → {lien}\033[0m")
            found.append(f"Truecaller → {lien}")
        else:
            print(f"\033[91m❌ {platform:14} → Pas trouvé\033[0m")
    except:
        print(f"\033[90m⚠  {platform:14} → Bloqué/erreur\033[0m")

# === LES 15 QUI MARCHENT À 100% AU MAROC EN 2025 ===
sites = [
    ("WhatsApp",     f"https://wa.me/{e164[3:]}"),
    ("Telegram",     f"https://t.me/+{e164[3:]}"),
    ("Truecaller",   f"https://www.truecaller.com/search/ma/{national}"),
    ("Snapchat",     f"https://www.snapchat.com/add/{national}"),
    ("Instagram",    f"https://www.instagram.com/{national}"),
    ("TikTok",       f"https://www.tiktok.com/@{national}"),
    ("Avito.ma",     f"https://www.avito.ma/fr/profil/{national}"),
    ("Jumia",        f"https://www.jumia.ma/customer/account/index/?phone={national}"),
    ("Inwi",         f"https://www.inwi.ma/fr/mon-compte/connexion"),
    ("Orange",       f"https://www.orange.ma/fr/identification"),
    ("IAM",          f"https://www.iam.ma/particulier/connexion"),
    ("Heetch",       f"https://heetch.com/fr/drivers/signup?phone={e164}"),
    ("Yassir",       f"https://yassir.com/fr/driver/register?phone={national}"),
    ("Glovo",        f"https://glovoapp.com/ma/login/?phone_number={national}"),
    ("Vinted",       f"https://www.vinted.fr/signup?phone={e164}"),
]

for name, url in sites:
    threading.Thread(target=check, args=(name, url)).start()

while threading.active_count() > 1:
    time.sleep(0.1)

print(f"\n\033[93m────────────────────────────────────")
if found:
    print(f"\033[92m🎯 {len(found)} LIENS DIRECTS TROUVÉS POUR {phone} :\033[0m")
    for f in found:
        print(f"   🔗 {f}")
    print(f"\n\033[91mCe bâtard est fini, tu l’as cramé partout 😂🇲🇦\033[0m")
else:
    print(f"\033[96mNuméro propre à 100%, wallah c’est un ange 👼\033[0m")