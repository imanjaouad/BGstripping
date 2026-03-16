import webbrowser

# ========================================
# 📺 13 CHAÎNES TNT MAROCAINES 🇲🇦
# ========================================

chaines_tnt = {
    "1":  ("Al Aoula", "https://snrtlive.ma/live/al-aoula"),
    "2":  ("2M", "https://2m.ma/fr/live"),
    "3":  ("Arryadia", "https://snrtlive.ma/live/arryadia"),
    "4":  ("Al Maghribia", "https://snrtlive.ma/live/al-maghribia"),
    "5":  ("Aflam TV", "https://snrtlive.ma/live/aflam-tv"),
    "6":  ("Assadissa", "https://snrtlive.ma/live/assadissa"),
    "7":  ("Tamazight", "https://snrtlive.ma/live/tamazight"),
    "8":  ("Laayoune TV", "https://snrtlive.ma/live/laayoune-tv"),
    "9":  ("Arryadia 2", "https://snrtlive.ma/live/arryadia-2"),
    "10": ("Athaqafia", "https://snrtlive.ma/live/athaqafia"),
    "11": ("Chada TV", "https://snrtlive.ma/live/chada-tv"),
    "12": ("Afrique Atlantic", "https://snrtlive.ma/live/afrique-atlantic"),
    "13": ("Mohammed VI Coran", "https://snrtlive.ma/live/mohammed-6-coran"),
}

def afficher_menu():
    print("\n" + "📺" * 15)
    print("  TNT MAROC - 13 CHAÎNES 🇲🇦")
    print("📺" * 15 + "\n")
    
    for num, (nom, _) in chaines_tnt.items():
        print(f"  {num.rjust(2)}. {nom}")
    
    print("\n   0. ❌ Quitter")

def regarder():
    while True:
        afficher_menu()
        choix = input("\n👉 Choisis une chaîne (1-13): ")
        
        if choix == "0":
            print("\n👋 Bessalama!")
            break
        elif choix in chaines_tnt:
            nom, url = chaines_tnt[choix]
            print(f"\n✅ Ouverture de {nom}...")
            webbrowser.open(url)
        else:
            print("❌ Choix invalide!")

if __name__ == "__main__":
    regarder()