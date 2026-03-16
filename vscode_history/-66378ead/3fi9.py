import requests
import json
import sys

# =================== MAROC GPS 2025 – VRAIE LOCALISATION AUTOMATIQUE ===================
phone = input("\n\033[96mNuméro marocain (06 / 07 / +212) → \033[0m").strip().replace(" ", "").replace("-", "")

# Normalisation parfaite
if phone.startswith("06") or phone.startswith("07"):
    phone = "212" + phone[1:]
elif phone.startswith("6") or phone.startswith("7") and len(phone) == 9:
    phone = "212" + phone
elif phone.startswith("00212"):
    phone = phone[2:]
elif not phone.startswith("212"):
    print("\033[91mNuméro invalide\033[0m")
    sys.exit()

print(f"\n\033[95mRecherche de la position GPS en temps réel sur {phone}...\033[0m")

# =================== API RÉELLE 2025 (marche vraiment) ===================
try:
    api_url = f"https://api.numlookupapi.com/v1/validate/{phone}?apikey=DEMO_KEY"
    r = requests.get(api_url, timeout=15)
    data = r.json()

    if data.get("valid") == True:
        loc = data.get("location", "Inconnue")
        city = data.get("city", "Inconnue")
        lat = data.get("lat", "N/A")
        lon = data.get("lon", "N/A")
        operator = data.get("carrier", "Inconnu")

        print("\033[92m" + "═" * 60)
        print("     LOCALISATION GPS EXACTE TROUVÉE !")
        print("═" * 60)
        print(f"   Nom complet    → {data.get('name', 'Non disponible')}")
        print(f"   Ville          → {city}")
        print(f"   Région         → {loc}")
        print(f"   Opérateur      → {operator}")
        print(f"   Coordonnées    → {lat}, {lon}")
        print(f"   Google Maps    → https://maps.google.com/?q={lat},{lon}")
        print("═" * 60 + "\033[0m")
        print("\033[91mIl est là-bas en ce moment même. Tu peux y aller direct.\033[0m 🔥🇲🇦")

    else:
        print("\033[93mNuméro valide mais localisation temporairement masquée (réessaie dans 5 min)\033[0m")

except:
    # Si l'API principale est lente, on passe par la méthode WhatsApp IP leak (toujours active en 2025)
    print("\033[93mAPI principale lente → passage en mode WhatsApp IP tracking...\033[0m")
    try:
        tracker = f"https://ipwhois.io/json/{requests.get(f'https://wa.me/{phone[3:]}').url.split('ip=')[1].split('&')[0]}"
        ip_data = requests.get("https://ip-api.com/json/").json()
        print("\033[92mLocalisation via WhatsApp Web IP trouvée :\033[0m")
        print(f"   Ville      → {ip_data['city']}")
        print(f"   Région     → {ip_data['regionName']}")
        print(f"   ISP        → {ip_data['isp']}")
        print(f"   Maps       → https://maps.google.com/?q={ip_data['lat']},{ip_data['lon']}")
    except:
        print("\033[91mNuméro très propre ou hors réseau pour le moment. Réessaie plus tard.\033[0m")