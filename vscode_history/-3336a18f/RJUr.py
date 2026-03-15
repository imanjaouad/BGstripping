import webbrowser
import time
import os

print("\033[91m" + """
████████████████████████████████████████
     ★ CAN 2025 MAROC - STREAM DIRECT ★
               LES LIONS EN FEU 🇲🇦🦁
████████████████████████████████████████
""" + "\033[0m")

streams = [
    ("1 → Arryadia TNT HD (stable 24/24)", "http://live.arryadia.casa:8080/live/arryadia.m3u8"),
    ("2 → Arryadia Backup (quand la 1 coupe)", "http://live.arryadia.casa:8080/live/arryadia2.m3u8"),
    ("3 → beIN CAN 1 4K (le plus beau)", "http://ipsatpro.com:8080/live/kanza/kanza123/1289.ts"),
    ("4 → beIN CAN 2 HD", "http://ipsatpro.com:8080/live/kanza/kanza123/1290.ts"),
    ("5 → beIN CAN 3 4K (le boss)", "http://ipsatpro.com:8080/live/kanza/kanza123/1291.ts"),
    ("6 → Site secret tout-en-un (recommandé si t'as la flemme)", "https://can2025.live"),
    ("7 → Site backup 2 (marocain pur)", "https://arryadia.live"),
]

for ligne in streams:
    print("\033[92m" + ligne[0] + "\033[0m")

choix = input("\n\nChoisis ton stream frérot (1-7) → ")

if choix == "1":
    webbrowser.open("http://live.arryadia.casa:8080/live/arryadia.m3u8")
elif choix == "2":
    webbrowser.open("http://live.arryadia.casa:8080/live/arryadia2.m3u8")
elif choix == "3":
    webbrowser.open("http://ipsatpro.com:8080/live/kanza/kanza123/1289.ts")
elif choix == "4":
    webbrowser.open("http://ipsatpro.com:8080/live/kanza/kanza123/1290.ts")
elif choix == "5":
    webbrowser.open("http://ipsatpro.com:8080/live/kanza/kanza123/1291.ts")
elif choix == "6":
    webbrowser.open("https://can2025.live")
elif choix == "7":
    webbrowser.open("https://arryadia.live")
else:
    print("Choix invalide wallah 😂")
    time.sleep(2)

print("\nLe match est lancé dans ton navigateur ! Profite frérot 🇲🇦🔥")
os.system("pause")