# 🏆 SCRIPT OFFICIEL - COUPE D'AFRIQUE (LÉGAL)
import webbrowser
import os
from datetime import datetime

# ========================================
# 🔐 DIFFUSEURS OFFICIELS DE LA COUPE D'AFRIQUE
# ========================================

OFFICIAL_BROADCASTERS = {
    # MAROC
    "🇲🇦 Arryadia": "https://snrtlive.ma/live/arryadia",
    "🇲🇦 Al Aoula": "https://snrtlive.ma/live/al-aoula",
    
    # FRANCE
    "🇫🇷 beIN Sports": "https://www.beinsports.com/france/direct-tv",
    "🇫🇷 Canal+": "https://www.canalplus.com",
    
    # AFRIQUE
    "🌍 CAF TV (officiel)": "https://www.cafonline.com",
    "🇹🇳 El Watania 1": "https://www.tunisiatv.tn/en-direct",
    "🇳🇬 SuperSport": "https://supersport.com",
    
    # INTERNATIONAUX
    "🌐 YouTube CAF": "https://www.youtube.com/@caf_online",
}

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def show_menu():
    clear_screen()
    print("🔥 COUPE D'AFRIQUE DES NATIONS")
    print("=" * 40)
    print(f"📅 {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("👉 Choisis un diffuseur officiel :\n")
    
    for i, (nom, _) in enumerate(OFFICIAL_BROADCASTERS.items(), 1):
        print(f"  {i}. {nom}")
    
    print(f"\n  0. ❌ Quitter")

def main():
    while True:
        show_menu()
        try:
            choice = input("\nNuméro du diffuseur: ")
            
            if choice == "0":
                print("\n👋 Bon match! Dima Maghrib!")
                break
                
            index = int(choice) - 1
            if 0 <= index < len(OFFICIAL_BROADCASTERS):
                nom, url = list(OFFICIAL_BROADCASTERS.items())[index]
                print(f"\n✅ Ouverture de {nom}...")
                webbrowser.open(url)
                break
            else:
                print("❌ Numéro invalide!")
                
        except ValueError:
            print("❌ Saisis un nombre!")
        except KeyboardInterrupt:
            print("\n\n👋 Au revoir!")
            break

if __name__ == "__main__":
    main()