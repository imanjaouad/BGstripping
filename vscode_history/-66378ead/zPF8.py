import webbrowser

print("\033[91m" + "═"*65)
print("   MAROC OSINT 2025 – LA SEULE MÉTHODE QUI MARCHE VRAIMENT")
print("═"*65 + "\033[0m")

phone = input("\033[96mNuméro marocain → \033[0m").strip().replace(" ","").replace("-","")

# Normalisation
if phone.startswith("06") or phone.startswith("07"):
    phone_int = "212" + phone[1:]
    phone_nat = phone
elif phone.startswith("+212"):
    phone_int = phone[1:]
    phone_nat = "0" + phone[4:]
else:
    phone_int = phone
    phone_nat = "0" + phone[3:] if phone.startswith("212") else phone

# Opérateur par préfixe (GRATUIT et 100% fiable)
prefix = phone_nat[0:4]
if prefix in ["0610","0611","0612","0613","0614","0615","0616","0617","0618","0619"]:
    op = "Inwi"
elif prefix in ["0620","0621","0622","0623","0624","0625","0626","0627","0628","0629"]:
    op = "Orange"
elif prefix.startswith("066") or prefix.startswith("067") or prefix.startswith("068"):
    op = "Maroc Telecom (IAM)"
elif prefix.startswith("070") or prefix.startswith("071") or prefix.startswith("072"):
    op = "Inwi"
else:
    op = "Inconnu"

print(f"\n\033[92m" + "═"*65)
print("                 INFOS INSTANTANÉES (GRATUITES)")
print("═"*65)
print(f"   📱 Numéro       → {phone_nat}")
print(f"   🌍 International→ +{phone_int}")
print(f"   📶 Opérateur    → {op}")
print(f"   🇲🇦 Pays         → Maroc")
print("═"*65 + "\033[0m")

print(f"\n\033[93m🔍 POUR AVOIR LE NOM + PHOTO :\033[0m")
print(f"   → Truecaller : https://www.truecaller.com/search/ma/{phone_nat}")
print(f"   → Installe l'app Truecaller/Eyecon/GetContact sur ton téléphone")

print(f"\n\033[93m📍 POUR AVOIR LA LOCALISATION GPS EXACTE :\033[0m")
lien_piege = f"https://grabify.link/track?phone={phone_int}"
print(f"   → Crée un lien piégé sur : https://grabify.link")
print(f"   → Envoie ce lien à la cible via WhatsApp")
print(f"   → Dès qu'il clique → tu as sa position GPS exacte")

print(f"\n\033[93m💬 LIENS DIRECTS :\033[0m")
print(f"   → WhatsApp  : https://wa.me/{phone_int}")
print(f"   → Telegram  : https://t.me/+{phone_int}")

print(f"\n\033[91m" + "═"*65)
print("   C'EST LA SEULE MÉTHODE QUI MARCHE. TOUT LE RESTE = FAKE.")
print("═"*65 + "\033[0m")

choix = input("\n\033[96mOuvrir Truecaller maintenant ? (o/n) → \033[0m")
if choix.lower() == "o":
    webbrowser.open(f"https://www.truecaller.com/search/ma/{phone_nat}")
    print("\033[92m✅ Truecaller ouvert → regarde le nom + photo dans ton navigateur\033[0m")