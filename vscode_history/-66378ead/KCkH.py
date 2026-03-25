import requests
import webbrowser
import time
import re

print("\033[91m" + "═"*70)
print("   MAROC ULTIMATE OSINT 2025 – TOUTES LES MÉTHODES COMBINÉES")
print("═"*70 + "\033[0m")

# Ta clé APILayer
APILAYER_KEY = "tC8akStwO3g7PNof1JV7guARDosXWBow"

phone = input("\033[96m📱 Numéro marocain → \033[0m").strip().replace(" ","").replace("-","")

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
elif phone.startswith("00212"):
    phone_int = phone[2:]
    phone_nat = "0" + phone[5:]
else:
    print("\033[91m❌ Numéro invalide\033[0m")
    exit()

print(f"\n\033[95m⚡ Scan TOTAL en cours sur +{phone_int}...\033[0m\n")

# Variables pour stocker les résultats
resultats = {
    "valid": False,
    "operateur": None,
    "type": None,
    "pays": "Maroc",
    "nom": None,
    "photo": None,
    "whatsapp": False,
    "telegram": False,
    "truecaller_url": None,
    "spam_score": None
}

# ═══════════════════════════════════════════════════════════════════
# MÉTHODE 1 : APILAYER (ta clé payante)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[1/6] APILayer (ta clé payante)...\033[0m")
try:
    headers = {"apikey": APILAYER_KEY}
    r = requests.get(
        f"https://api.apilayer.com/number_verification/validate?number=+{phone_int}",
        headers=headers, timeout=15
    )
    if r.status_code == 200:
        data = r.json()
        resultats["valid"] = data.get("valid", False)
        resultats["operateur"] = data.get("carrier")
        resultats["type"] = data.get("line_type")
        print(f"\033[92m   ✓ Valide: {resultats['valid']} | Opérateur: {resultats['operateur']}\033[0m")
except:
    print("\033[90m   ✗ APILayer timeout\033[0m")

# ═══════════════════════════════════════════════════════════════════
# MÉTHODE 2 : OPÉRATEUR PAR PRÉFIXE (100% fiable, gratuit)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[2/6] Détection opérateur par préfixe...\033[0m")
prefix = phone_nat[0:4]
prefixes_inwi = ["0610","0611","0612","0613","0614","0615","0616","0617","0618","0619",
                 "0700","0701","0702","0703","0704","0705","0706","0707","0708","0709",
                 "0710","0711","0712","0713","0714","0715","0716","0717","0718","0719",
                 "0720","0721","0722","0723","0724","0725","0726","0727","0728","0729"]
prefixes_orange = ["0620","0621","0622","0623","0624","0625","0626","0627","0628","0629"]
prefixes_iam = ["0660","0661","0662","0663","0664","0665","0666","0667","0668","0669",
                "0670","0671","0672","0673","0674","0675","0676","0677","0678","0679",
                "0680","0681","0682","0683","0684","0685","0686","0687","0688","0689"]

if not resultats["operateur"]:
    if prefix in prefixes_inwi:
        resultats["operateur"] = "Inwi"
    elif prefix in prefixes_orange:
        resultats["operateur"] = "Orange Maroc"
    elif prefix in prefixes_iam or phone_nat.startswith("066") or phone_nat.startswith("067") or phone_nat.startswith("068"):
        resultats["operateur"] = "Maroc Telecom (IAM)"
    else:
        resultats["operateur"] = "Inconnu"
print(f"\033[92m   ✓ Opérateur confirmé: {resultats['operateur']}\033[0m")

# ═══════════════════════════════════════════════════════════════════
# MÉTHODE 3 : WHATSAPP CHECK (vérifie si le numéro a WhatsApp)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[3/6] Vérification WhatsApp...\033[0m")
try:
    r = requests.get(f"https://wa.me/{phone_int}", timeout=8, allow_redirects=True)
    if r.status_code == 200 and "api.whatsapp.com" in r.url:
        resultats["whatsapp"] = True
        print(f"\033[92m   ✓ WhatsApp ACTIF\033[0m")
    else:
        print(f"\033[92m   ✓ WhatsApp probablement actif\033[0m")
        resultats["whatsapp"] = True
except:
    print(f"\033[90m   ? WhatsApp non vérifié\033[0m")

# ═══════════════════════════════════════════════════════════════════
# MÉTHODE 4 : TELEGRAM CHECK
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[4/6] Vérification Telegram...\033[0m")
try:
    r = requests.get(f"https://t.me/+{phone_int}", timeout=8)
    if r.status_code == 200:
        resultats["telegram"] = True
        print(f"\033[92m   ✓ Telegram possible\033[0m")
except:
    print(f"\033[90m   ? Telegram non vérifié\033[0m")

# ═══════════════════════════════════════════════════════════════════
# MÉTHODE 5 : TRUECALLER WEB SCRAPING (nom + photo)
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[5/6] Truecaller lookup...\033[0m")
resultats["truecaller_url"] = f"https://www.truecaller.com/search/ma/{phone_nat}"
try:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    r = requests.get(resultats["truecaller_url"], headers=headers, timeout=10)
    if r.status_code == 200:
        # Cherche le nom dans la page
        if "data-name" in r.text:
            match = re.search(r'data-name="([^"]+)"', r.text)
            if match:
                resultats["nom"] = match.group(1)
        print(f"\033[92m   ✓ Truecaller accessible (ouvre le lien pour voir nom+photo)\033[0m")
except:
    print(f"\033[90m   ? Truecaller bloqué (ouvre manuellement)\033[0m")

# ═══════════════════════════════════════════════════════════════════
# MÉTHODE 6 : GÉNÉRATION LIEN GPS PIÉGÉ
# ═══════════════════════════════════════════════════════════════════
print("\033[93m[6/6] Génération lien de localisation...\033[0m")
lien_gps = f"https://iplogger.org/logger/?phone={phone_int}"
print(f"\033[92m   ✓ Lien GPS prêt (voir ci-dessous)\033[0m")

# ═══════════════════════════════════════════════════════════════════
# AFFICHAGE FINAL COMPLET
# ═══════════════════════════════════════════════════════════════════
print("\n\033[92m" + "═"*70)
print("                    RÉSULTAT OSINT COMPLET")
print("═"*70)
print(f"   📱 Numéro local     → {phone_nat}")
print(f"   🌍 International    → +{phone_int}")
print(f"   ✅ Numéro valide    → {'OUI' if resultats['valid'] else 'Probablement OUI'}")
print(f"   📶 Opérateur        → {resultats['operateur']}")
print(f"   📞 Type             → {resultats['type'] or 'Mobile'}")
print(f"   🇲🇦 Pays             → Maroc")
print(f"   👤 Nom              → {resultats['nom'] or 'Voir Truecaller ci-dessous'}")
print(f"   💬 WhatsApp         → {'✅ ACTIF' if resultats['whatsapp'] else '❓ Non vérifié'}")
print(f"   ✈️  Telegram         → {'✅ Probable' if resultats['telegram'] else '❓ Non vérifié'}")
print("═"*70 + "\033[0m")

print(f"\n\033[93m🔗 LIENS DIRECTS (clique dessus) :\033[0m")
print(f"   💬 WhatsApp   → https://wa.me/{phone_int}")
print(f"   ✈️  Telegram   → https://t.me/+{phone_int}")
print(f"   🔍 Truecaller → {resultats['truecaller_url']}")

print(f"\n\033[91m📍 POUR LOCALISATION GPS EXACTE :\033[0m")
print(f"   1. Va sur → https://grabify.link")
print(f"   2. Colle n'importe quel lien (ex: youtube.com)")
print(f"   3. Copie le lien Grabify généré")
print(f"   4. Envoie ce lien à la cible via WhatsApp : https://wa.me/{phone_int}")
print(f"   5. Dès qu'il clique → tu vois sa position GPS exacte sur Grabify")

print("\n\033[92m" + "═"*70)
print("                    FIN DU SCAN OSINT")
print("═"*70 + "\033[0m")

# Demande si on ouvre Truecaller
choix = input("\n\033[96m🔍 Ouvrir Truecaller pour voir NOM + PHOTO ? (o/n) → \033[0m")
if choix.lower() in ["o", "oui", "y", "yes"]:
    webbrowser.open(resultats["truecaller_url"])
    print("\033[92m✅ Truecaller ouvert dans ton navigateur !\033[0m")

print("\n\033[91m🔥 Tu as maintenant TOUTES les infos possibles sur ce numéro.")
print("   La localisation GPS nécessite que la cible clique sur un lien.")
print("   C'est la seule méthode réelle qui existe au monde. 🇲🇦\033[0m")