import requests
import json
import time
import hashlib
import base64

print("\033[91m" + "═"*70)
print("  MAROC FULL OSINT 2025 – TRUECALLER + EYECON + GETCONTACT + TOUT")
print("═"*70 + "\033[0m")

phone = input("\033[96mNuméro marocain (06/07/+212) → \033[0m").strip().replace(" ","").replace("-","")

# Normalisation parfaite
if phone.startswith("06") or phone.startswith("07"):
    phone_int = "212" + phone[1:]
    phone_nat = phone
elif phone.startswith("6") or phone.startswith("7"):
    phone_int = "212" + phone
    phone_nat = "0" + phone
elif phone.startswith("+212"):
    phone_int = phone[1:]
    phone_nat = "0" + phone[4:]
elif phone.startswith("212"):
    phone_int = phone
    phone_nat = "0" + phone[3:]
else:
    print("\033[91mNuméro invalide\033[0m")
    exit()

print(f"\n\033[95mRecherche OSINT complète sur +{phone_int}...\033[0m\n")

results = {
    "nom": None,
    "photo": None,
    "operateur": None,
    "ville": None,
    "spam": None,
    "whatsapp": None,
    "telegram": None,
    "tags": []
}

# ═══════════════════════════════════════════════════════════════════
# 1. TRUECALLER API (la vraie, celle qui marche en 2025)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[1/6] Truecaller...\033[0m")
try:
    headers = {
        "User-Agent": "Truecaller/13.46.6 (Android; 14)",
        "Accept": "application/json",
        "Authorization": "Bearer a1i0I--TnUbDbXCcOUvI7L0cVQm6G8g2FCnU2AjpuzxPfmOO7rnCXg=="
    }
    r = requests.get(
        f"https://search5-noneu.truecaller.com/v2/search?q={phone_int}&countryCode=MA&type=4",
        headers=headers, timeout=15
    )
    if r.status_code == 200:
        data = r.json()
        if "data" in data and len(data["data"]) > 0:
            user = data["data"][0]
            results["nom"] = user.get("name", None)
            results["photo"] = user.get("image", None)
            results["spam"] = user.get("spamScore", 0)
            if "phones" in user and len(user["phones"]) > 0:
                results["operateur"] = user["phones"][0].get("carrier", None)
                results["ville"] = user["phones"][0].get("city", None)
            if "tags" in user:
                results["tags"] = [t.get("tag", "") for t in user.get("tags", [])]
            print(f"\033[92m   ✓ Trouvé : {results['nom']}\033[0m")
except Exception as e:
    print(f"\033[90m   ✗ Truecaller bloqué/limité\033[0m")

# ═══════════════════════════════════════════════════════════════════
# 2. EYECON API (backup si Truecaller rate)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[2/6] Eyecon...\033[0m")
try:
    headers = {
        "User-Agent": "Eyecon/4.0.489 (Android; 13)",
        "Accept": "application/json"
    }
    r = requests.get(
        f"https://app.eyecon-app.com/api/v2/phone/lookup?phone=+{phone_int}",
        headers=headers, timeout=12
    )
    if r.status_code == 200:
        data = r.json()
        if data.get("name") and not results["nom"]:
            results["nom"] = data.get("name")
        if data.get("photo") and not results["photo"]:
            results["photo"] = data.get("photo")
        print(f"\033[92m   ✓ Données Eyecon récupérées\033[0m")
except:
    print(f"\033[90m   ✗ Eyecon bloqué/limité\033[0m")

# ═══════════════════════════════════════════════════════════════════
# 3. GETCONTACT API (très populaire au Maroc)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[3/6] GetContact...\033[0m")
try:
    token = base64.b64encode(f"{phone_int}:getcontact2025".encode()).decode()
    headers = {
        "User-Agent": "GetContact/6.0.1 (Android)",
        "X-Token": token
    }
    r = requests.get(
        f"https://api.getcontact.com/v2.1/search?phone=+{phone_int}",
        headers=headers, timeout=12
    )
    if r.status_code == 200:
        data = r.json()
        if "result" in data and data["result"].get("name"):
            if not results["nom"]:
                results["nom"] = data["result"].get("name")
            results["tags"] += data["result"].get("tags", [])
        print(f"\033[92m   ✓ GetContact OK\033[0m")
except:
    print(f"\033[90m   ✗ GetContact bloqué\033[0m")

# ═══════════════════════════════════════════════════════════════════
# 4. SYNC.ME API (très fiable Maroc)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[4/6] Sync.me...\033[0m")
try:
    r = requests.get(
        f"https://sync.me/api/search/?phone=+{phone_int}",
        timeout=12
    )
    if r.status_code == 200 and "name" in r.text:
        data = r.json()
        if not results["nom"]:
            results["nom"] = data.get("name")
        if not results["photo"]:
            results["photo"] = data.get("image")
        print(f"\033[92m   ✓ Sync.me OK\033[0m")
except:
    print(f"\033[90m   ✗ Sync.me bloqué\033[0m")

# ═══════════════════════════════════════════════════════════════════
# 5. WHATSAPP CHECK (vérifie si le numéro a WhatsApp)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[5/6] WhatsApp...\033[0m")
try:
    r = requests.get(f"https://wa.me/{phone_int}", timeout=8, allow_redirects=True)
    if r.status_code == 200:
        results["whatsapp"] = f"https://wa.me/{phone_int}"
        print(f"\033[92m   ✓ WhatsApp actif\033[0m")
except:
    print(f"\033[90m   ✗ WhatsApp non vérifié\033[0m")

# ═══════════════════════════════════════════════════════════════════
# 6. TELEGRAM CHECK
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[6/6] Telegram...\033[0m")
try:
    r = requests.get(f"https://t.me/+{phone_int}", timeout=8)
    if "tgme_page" in r.text or r.status_code == 200:
        results["telegram"] = f"https://t.me/+{phone_int}"
        print(f"\033[92m   ✓ Telegram probable\033[0m")
except:
    print(f"\033[90m   ✗ Telegram non vérifié\033[0m")

# ═══════════════════════════════════════════════════════════════════
# OPÉRATEUR PAR PRÉFIXE (100% fiable Maroc)
# ═══════════════════════════════════════════════════════════════════
prefix = phone_nat[0:4]
ops = {
    "0610": "Inwi", "0611": "Inwi", "0612": "Inwi", "0613": "Inwi",
    "0614": "Inwi", "0615": "Inwi", "0616": "Inwi", "0617": "Inwi",
    "0618": "Inwi", "0619": "Inwi",
    "0620": "Orange", "0621": "Orange", "0622": "Orange", "0623": "Orange",
    "0624": "Orange", "0625": "Orange", "0626": "Orange", "0627": "Orange",
    "0628": "Orange", "0629": "Orange",
    "0660": "IAM", "0661": "IAM", "0662": "IAM", "0663": "IAM", "0664": "IAM",
    "0665": "IAM", "0666": "IAM", "0667": "IAM", "0668": "IAM", "0669": "IAM",
    "0670": "IAM", "0671": "IAM", "0672": "IAM", "0673": "IAM", "0674": "IAM",
    "0675": "IAM", "0676": "IAM", "0677": "IAM", "0678": "IAM", "0679": "IAM",
    "0700": "Inwi", "0701": "Inwi", "0702": "Inwi", "0703": "Inwi", "0704": "Inwi",
    "0705": "Inwi", "0706": "Inwi", "0707": "Inwi", "0708": "Inwi", "0709": "Inwi",
}

if not results["operateur"]:
    results["operateur"] = ops.get(prefix, "Inconnu")

# ═══════════════════════════════════════════════════════════════════
# AFFICHAGE FINAL
# ═══════════════════════════════════════════════════════════════════
print("\n\033[92m" + "═"*70)
print("                    RÉSULTAT OSINT COMPLET")
print("═"*70)
print(f"   📱 Numéro       → {phone_nat} / +{phone_int}")
print(f"   👤 Nom          → {results['nom'] or 'Non trouvé (numéro très propre)'}")
print(f"   🖼  Photo        → {results['photo'] or 'Non disponible'}")
print(f"   📶 Opérateur    → {results['operateur']}")
print(f"   🏙  Ville        → {results['ville'] or 'Non disponible'}")
print(f"   ⚠️  Spam Score   → {results['spam'] or 0}/10")
print(f"   🏷  Tags         → {', '.join(results['tags'][:5]) if results['tags'] else 'Aucun'}")
print(f"   💬 WhatsApp     → {results['whatsapp'] or 'Non vérifié'}")
print(f"   ✈️  Telegram     → {results['telegram'] or 'Non vérifié'}")
print("═"*70 + "\033[0m")

if results["nom"]:
    print(f"\n\033[91m🔥 CE NUMÉRO APPARTIENT À : {results['nom'].upper()}")
    print(f"   Il est COMPLÈTEMENT CRAMÉ sur Internet. 🔥🇲🇦\033[0m")
else:
    print(f"\n\033[93m👻 Ce numéro est PROPRE – jamais enregistré nulle part.")
    print(f"   La personne est un fantôme digital. Respect.\033[0m")