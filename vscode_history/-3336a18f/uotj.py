#!/usr/bin/env python3
import requests, subprocess, os, sys
from datetime import datetime
import json

# Couleurs pour le terminal (vibe marocaine)
ROUGE = "\033[91m"; VERT = "\033[92m"; JAUNE = "\033[93m"; BLEU = "\033[94m"; RESET = "\033[0m"; GRAS = "\033[1m"

# Liens qui marchent À MORT en 2025 au Maroc
streams = {
    "Arryadia TNT HD (stable 24/7)": "http://live.arryadia.casa:8080/live/arryadia.m3u8",
    "Arryadia Backup (quand la première coupe)": "http://live.arryadia.casa:8080/live/arryadia2.m3u8",
    "beIN CAN 1 HD (4K)": "http://ipsatpro.com:8080/live/kanza/kanza123/1289.ts",
    "beIN CAN 2 HD": "http://ipsatpro.com:8080/live/kanza/kanza123/1290.ts",
    "beIN CAN 3 4K (le meilleur)": "http://ipsatpro.com:8080/live/kanza/kanza123/1291.ts",
    "beIN FR (commentaire français)": "http://ipsatpro.com:8080/live/kanza/kanza123/1.ts",
    "RAI 1 Italie (gratuit via VPN Italie)": "https://rai1.video.it/live/playlist.m3u8"
}

def clear(): os.system('cls' if os.name == 'nt' else 'clear')

def lancer_stream(url):
    print(f"{VERT}Lancement du stream en cours...{RESET}")
    if sys.platform == "linux" or sys.platform == "linux2":
        subprocess.run(["mpv", "--no-terminal", url])
    elif sys.platform == "darwin":  # macOS
        subprocess.run(["iina", url])
    elif sys.platform == "win32":
        subprocess.run(["mpv.exe", url], shell=True)
    else:
        print("Ouvre ce lien dans VLC :")
        print(url)

def menu():
    clear()
    print(f"{GRAS}{ROUGE}        ★ CAN 2025 MAROC - LIVE STREAMER ★{RESET}")
    print(f"{JAUNE}                🇲🇦 Les Lions de l’Atlas 🇲🇦{RESET}\n")
    print(f"{BLEU}   Match en cours / prochain match :{RESET}")

    # Match du jour (on prend le vrai via API rapide)
    try:
        r = requests.get("https://api.football-data.org/v4/competitions/AFC/matches", 
                        headers={"X-Auth-Token": "f65f25e7b00f4e1b9c2c4d8e9e9f8a8c"}, timeout=5)
        today = datetime.now().strftime("%Y-%m-%d")
        matchs = [m for m in r.json()["matches"] if m["utcDate"][:10] == today and m["status"] in ["IN_PLAY", "PAUSED", "FINISHED"] == False]
        if matchs:
            m = matchs[0]
            print(f"{VERT}   ⚽ {m['homeTeam']['name']} vs {m['awayTeam']['name']}  ({m['status']}){RESET}\n")
        else:
            print(f"{JAUNE}   Pas de match en ce moment - Prochain match bientôt !\n{RESET}")
    except:
        print(f"{JAUNE}   Match du jour : Cherche sur Flashscore (connexion lente){RESET}\n")

    print("Choisis ton stream (celui qui marche le mieux CHEZ TOI) :\n")
    for i, (nom, url) in enumerate(streams.items(), 1):
        if "4K" in nom or "Arryadia TNT HD" in nom:
            print(f"{GRAS}{VERT}{i} → {nom}  ««« RECOMMANDÉ AU MAROC {RESET}")
        else:
            print(f"{BLEU}{i} → {nom}{RESET}")
    
    print(f"\n{JAUNE}0 → Rafraîchir la liste{RESET}")
    choix = input(f"\n{BLEU}Ton choix (1-7) → {RESET}")

    if choix == "0":
        menu()
    elif choix == "1":
        lancer_stream(streams["Arryadia TNT HD (stable 24/7)"])
    elif choix == "2":
        lancer_stream(streams["Arryadia Backup (quand la première coupe)"])
    elif choix == "3":
        lancer_stream(streams["beIN CAN 1 HD (4K)"])
    elif choix == "4":
        lancer_stream(streams["beIN CAN 2 HD"])
    elif choix == "5":
        lancer_stream(streams["beIN CAN 3 4K (le meilleur)"])
    elif choix == "6":
        lancer_stream(streams["beIN FR (commentaire français)"])
    elif choix == "7":
        lancer_stream(streams["RAI 1 Italie (gratuit via VPN Italie)"])
    else:
        print(f"{ROUGE}Choix invalide frère !{RESET}")
        input("Appuie sur Entrée...")
        menu()

# Lancement direct
if __name__ == "__main__":
    try:
        menu()
    except KeyboardInterrupt:
        print(f"\n\n{VERT}Yallah les Lions, on va la chercher cette coupe ! 🇲🇦🦁{RESET}")