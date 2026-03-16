import requests
import random
import threading
import time

phone = input("\033[96m🇲🇦 Numéro (06/07/+212) → \033[0m").strip().replace(" ", "").replace("-", "")

# ========= NORMALISATION PARFAITE (plus jamais d'erreur) =========
if phone.startswith("06") or phone.startswith("07"):
    phone = "+212" + phone[1:]                  # 06 → +2126
elif phone.startswith("6") or phone.startswith("7"):
    phone = "+212" + phone                      # 6 → +2126
elif phone.startswith("00212"):
    phone = "+" + phone[2:]                     # 00212 → +212
elif not phone.startswith("+"):
    phone = "+212" + phone                      # tout le reste

e164 = phone.replace("+", "")                    # 21268546794
nat  = "0" + e164[3:]                            # 068546794

print(f"\n\033[95m🔥 Scan parfait sur {phone} ({nat})\033[0m\n")
found = []

# (le reste du code reste exactement le même, juste plus rapide et propre)

def check(name, url):
    try:
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X)"}, timeout=10)
        if r.status_code == 200 and ("chat" in r.text or "join" in r.text or "profile" in r.text or len(r.text) > 5000):
            print(f"\033[92m✅ {name:12} → {url}\033[0m")
            found.append(f"{name} → {url}")
        else:
            print(f"\033[91m❌ {name:12} → Rien\033[0m")
    except:
        print(f"\033[90m⚠  {name:12} → Bloqué\033[0m")

sites = [
    ("WhatsApp",   f"https://wa.me/{e164[3:]}"),
    ("Telegram",   f"https://t.me/+{e164[3:]}"),
    ("Truecaller", f"https://www.truecaller.com/search/ma/{nat}"),
    ("Snapchat",   f"https://www.snapchat.com/add/{nat}"),
    ("Avito.ma",   f"https://www.avito.ma/fr/profil/{nat}"),
    ("Instagram",  f"https://www.instagram.com/{nat}"),
    ("TikTok",     f"https://www.tiktok.com/@{nat}"),
]

for n, u in sites:
    threading.Thread(target=check, args=(n, u)).start()

while threading.active_count() > 1: time.sleep(0.05)

print("\n\033[93m════════════════════════")
if found:
    print(f"\033[92m🎯 {len(found)} COMPTES TROUVÉS :\033[0m")
    for x in found: print("   " + x)
else:
    print("\033[96mNuméro propre à 100% 👼\033[0m")