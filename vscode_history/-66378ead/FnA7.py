import requests

print("\033[91m" + "═"*65)
print("   MAROC PHONE LOOKUP 2025 – APILAYER (API PAYANTE RÉELLE)")
print("═"*65 + "\033[0m")

# ═══════════════════════════════════════════════════════════════
# COLLE TA CLÉ APILAYER ICI (entre les guillemets)
# ═══════════════════════════════════════════════════════════════
APILAYER_KEY = "COLLE_TA_CLE_ICI"

phone = input("\033[96mNuméro marocain (06/07/+212) → \033[0m").strip().replace(" ","").replace("-","")

# Normalisation
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

print(f"\n\033[95mRequête API en cours sur +{phone_int}...\033[0m\n")

# ═══════════════════════════════════════════════════════════════
# APILAYER API (la vraie, payante, qui marche)
# ═══════════════════════════════════════════════════════════════
try:
    headers = {"apikey": APILAYER_KEY}
    r = requests.get(
        f"https://api.apilayer.com/number_verification/validate?number=+{phone_int}",
        headers=headers,
        timeout=15
    )
    
    if r.status_code == 200:
        data = r.json()
        
        print("\033[92m" + "═"*65)
        print("              RÉSULTAT API (DONNÉES RÉELLES)")
        print("═"*65)
        print(f"   📱 Numéro         → {phone_nat}")
        print(f"   🌍 International  → +{phone_int}")
        print(f"   ✅ Valide         → {'Oui' if data.get('valid') else 'Non'}")
        print(f"   📶 Opérateur      → {data.get('carrier', 'Non disponible')}")
        print(f"   📍 Localisation   → {data.get('location', 'Non disponible')}")
        print(f"   📞 Type           → {data.get('line_type', 'Mobile')}")
        print(f"   🇲🇦 Pays           → {data.get('country_name', 'Maroc')}")
        print(f"   🏳️ Code pays      → {data.get('country_code', 'MA')}")
        print(f"   💬 WhatsApp       → https://wa.me/{phone_int}")
        print("═"*65 + "\033[0m")
        
        if data.get('valid'):
            print(f"\n\033[92m✅ NUMÉRO VALIDE ET ACTIF !\033[0m")
        else:
            print(f"\n\033[91m❌ Numéro invalide ou inactif\033[0m")
    else:
        print(f"\033[91mErreur API : {r.status_code} - {r.text}\033[0m")
        
except Exception as e:
    print(f"\033[91mErreur : {e}\033[0m")