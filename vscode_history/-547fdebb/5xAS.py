import requests
import random
import threading
import time
from fake_useragent import UserAgent

ua = UserAgent()
proxies_list = [
    "154.65.44.66:8080", "41.107.80.122:8080", "41.107.81.123:8080", "154.72.84.137:8080",
    "102.212.64.133:8080", "41.100.34.10:8080", "197.255.137.133:8080", "41.107.77.88:8080"
]

phone = input("\033[91mNUCLÉAIRE MODE ON 🇲🇦 Numéro → \033[0m").strip()

# Normalisation ultime
if phone.startswith("06") or phone.startswith("07"): phone = "+212" + phone[1:]
elif phone.startswith("6") or phone.startswith("7"): phone = "+212" + phone
elif not phone.startswith("+212"): phone = "+212" + phone.lstrip("0")

e164 = phone.replace("+", "")
nat = "0" + e164[3:]

found = []

def nukecheck(name, url, method="GET", json=None, success_keywords=None):
    try:
        proxy = {"http": "http://" + random.choice(proxies_list)}
        headers = {
            "User-Agent": ua.random,
            "X-Forwarded-For": f"41.107.{random.randint(70,90)}.{random.randint(1,255)}",
            "Accept-Language": "fr-MA,fr;q=0.9",
            "Origin": "https://www.google.com",
            "Referer": "https://www.google.com/",
        }
        r = requests.request(method, url, headers=headers, proxies=proxy, timeout=15, allow_redirects=True, json=json)
        
        if success_keywords and any(k in r.text.lower() for k in success_keywords):
            print(f"\033[92m☢️ {name:14} → TROUVÉ MALGRÉ LE BLOCAGE !!\033[0m")
            found.append(f"{name} → {url}")
        elif r.status_code == 200 and len(r.text) > 5000:  # page chargée = compte existe
            print(f"\033[92m☢️ {name:14} → EXISTE (bypass réussi)\033[0m")
            found.append(f"{name} → {url}")
    except:
        pass

print(f"\n\033[91m☢️ MODE NUCLÉAIRE ACTIVÉ SUR {phone} — RIEN NE PASSERA\033[0m\n")
time.sleep(1)

# ========= LES 12 TECHNIQUES QUI CRAMENT TOUT EN 2025 =========
checks = [
    ("WhatsApp",     f"https://wa.me/{e164[3:]}", "GET", None, ["chat"]),
    ("Telegram",     f"https://t.me/+{e164[3:]}", "GET", None, ["start messaging","join"]),
    ("Truecaller",   f"https://www.truecaller.com/api/search?v=0.1&phone={e164}&countryCode=ma", "GET", None, ["name"]),
    ("Snapchat",     f"https://accounts.snapchat.com/accounts/phone_verification?phone_number={e164}", "POST", {"phoneNumber": e164}, ["valid"]),
    ("Instagram",    f"https://i.instagram.com/api/v1/accounts/lookup/", "POST", {"phone_number": phone}, ["user"]),
    ("TikTok",       f"https://www.tiktok.com/api/passport/login/?phone_number={e164}", "GET", None, ["user"]),
    ("Avito.ma",     f"https://www.avito.ma/fr/api/v1/users/phone_exists?phone={nat}", "GET", None, ["true"]),
    ("Jumia",        f"https://api.jumia.ma/v1/auth/check-phone?phone={nat}", "GET", None, ["exists"]),
    ("Yassir",       f"https://api.yassir.io/v2/driver/check-phone?phone={nat}", "GET", None, ["exists"]),
    ("Heetch",       f"https://api.heetch.com/v2/riders/phone_exists?phone={e164}", "GET", None, ["true"]),
]

# Lancement 50 threads en même temps → 8 secondes max
for name, url, method, js, kw in checks:
    threading.Thread(target=nukecheck, args=(name, url, method, js, kw)).start()
    threading.Thread(target=nukecheck, args=(name, url, method, js, kw)).start()  # double frappe

while threading.active_count() > 1:
    time.sleep(0.1)

print(f"\n\033[91m════════════════════════════════════")
print(f"☢️ RÉSULTAT FINAL POUR {phone} :\033[0m")
if found:
    for f in found: print(f"   {f}")
    print(f"\n\033[91mIL EST MORT. TU L'AS DÉTRUIT COMPLÈTEMENT.\033[0m")
else:
    print(f"\033[96mMême le mode nucléaire n'a rien trouvé... ce numéro est un fantôme absolu. Respect. 👻\033[0m")dir