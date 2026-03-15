import requests
import re

print("\033[91m" + "═"*50)
print("   MAROC NOM FINDER 2025 – JUSTE LE NOM")
print("═"*50 + "\033[0m")

phone = input("\033[96mNuméro → \033[0m").strip().replace(" ","").replace("-","").replace("+","")

# Normalisation
if phone.startswith("0"): phone = "212" + phone[1:]
elif phone.startswith("6") or phone.startswith("7"): phone = "212" + phone
phone_nat = "0" + phone[3:]

print(f"\n\033[95mRecherche du nom pour +{phone}...\033[0m\n")

nom_trouve = None

# Méthode 1 : Truecaller
try:
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"}
    r = requests.get(f"https://www.truecaller.com/search/ma/{phone_nat}", headers=headers, timeout=15)
    if r.status_code == 200:
        patterns = [
            r'"name"\s*:\s*"([^"]+)"',
            r'"displayName"\s*:\s*"([^"]+)"',
            r'data-name="([^"]+)"'
        ]
        for p in patterns:
            match = re.search(p, r.text)
            if match:
                nom = match.group(1).strip()
                if len(nom) > 2 and nom.lower() not in ["null","undefined"]:
                    nom_trouve = nom
                    break
except: pass

# Affichage
print("\033[92m" + "═"*50)
if nom_trouve:
    print(f"   ✅ NOM TROUVÉ : {nom_trouve.upper()}")
    print("═"*50)
    print(f"\n   👉 Cherche '{nom_trouve}' sur :")
    print(f"      • Facebook")
    print(f"      • Instagram")
    print(f"      • TikTok")
    print(f"      • Snapchat")
else:
    print(f"   ❌ NOM NON TROUVÉ")
    print("═"*50)
    print(f"\n   👉 Ouvre Truecaller sur ton TÉLÉPHONE :")
    print(f"      1. Installe l'app Truecaller")
    print(f"      2. Tape le numéro {phone_nat}")
    print(f"      3. Tu verras le nom + photo")
print("\033[0m")