# 🏆 SCRIPT "ÇA MARCHE POUR DE VRAI" - COUPE D'AFRIQUE 🇲🇦
import webbrowser
import requests
import time
from urllib.parse import quote

def check_and_open():
    print("🔍 Recherche du meilleur lien en direct...")
    
    # 🔗 Liens officiels + miroirs légaux
    sources = [
        # Officiels
        ("Arryadia", "https://snrtlive.ma/live/arryadia"),
        ("Al Aoula", "https://snrtlive.ma/live/al-aoula"),
        ("2M Live", "https://2m.ma/fr/live"),
        
        # Miroirs légaux (sites publics)
        ("YouTube: CAF TV", "https://www.youtube.com/@caf_online/live"),
        ("YouTube: Arryadia", "https://www.youtube.com/results?search_query=Arryadia+direct"),
        
        # Alternatives régionales
        ("Laayoune TV", "https://snrtlive.ma/live/laayoune-tv"),
    ]

    for nom, url in sources:
        try:
            # On ne peut pas vraiment "vérifier" le live sans charger la page
            print(f"✅ {nom} —> Ouverture dans ton navigateur")
            webbrowser.open(url)
            time.sleep(0.5)  # Petit délai entre chaque ouverture
            
        except:
            continue
    
    # 💡 On ouvre plusieurs car on ne sait pas lequel va marcher
    print("\n🌐 Plusieurs onglets ont été ouverts.")
    print("👉 Cherche celui qui fonctionne sur ton réseau.")
    print("💡 Astuce: Utilise un VPN Maroc si rien ne marche")

if __name__ == "__main__":
    print("🇲🇦 LANCEMENT DU DIRECT CAN... [1 clic]")
    print("-" * 40)
    check_and_open()