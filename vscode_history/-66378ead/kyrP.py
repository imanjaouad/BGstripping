import requests
import webbrowser
import threading
import time

# ═══════════════════════════════════════════════════════════════════
#                    MAROC OSINT PRO 2025
# ═══════════════════════════════════════════════════════════════════

APILAYER_KEY = "tC8akStwO3g7PNof1JV7guARDosXWBow"

class MarocOSINT:
    def __init__(self, phone):
        self.phone_raw = phone
        self.phone_nat = None
        self.phone_int = None
        self.resultats = {
            "valid": None,
            "operateur": None,
            "type": "Mobile",
            "whatsapp": None,
            "telegram": None,
            "nom": None
        }
        self.normaliser()
    
    def normaliser(self):
        p = self.phone_raw.replace(" ","").replace("-","").replace("+","")
        if p.startswith("00212"): p = p[2:]
        elif p.startswith("0"): p = "212" + p[1:]
        elif p.startswith("6") or p.startswith("7"): p = "212" + p
        
        self.phone_int = p
        self.phone_nat = "0" + p[3:]
    
    def check_operateur(self):
        prefix = self.phone_nat[0:4]
        inwi = ["0610","0611","0612","0613","0614","0615","0616","0617","0618","0619",
                "0700","0701","0702","0703","0704","0705","0706","0707","0708","0709"]
        orange = ["0620","0621","0622","0623","0624","0625","0626","0627","0628","0629"]
        
        if prefix in inwi: self.resultats["operateur"] = "🟡 Inwi"
        elif prefix in orange: self.resultats["operateur"] = "🟠 Orange Maroc"
        elif self.phone_nat[0:3] in ["066","067","068"]: self.resultats["operateur"] = "🔵 Maroc Telecom (IAM)"
        else: self.resultats["operateur"] = "❓ Inconnu"
    
    def check_api(self):
        try:
            r = requests.get(
                f"https://api.apilayer.com/number_verification/validate?number=+{self.phone_int}",
                headers={"apikey": APILAYER_KEY}, timeout=10
            )
            if r.status_code == 200:
                data = r.json()
                self.resultats["valid"] = data.get("valid")
                if data.get("carrier"): self.resultats["operateur"] = data.get("carrier")
                if data.get("line_type"): self.resultats["type"] = data.get("line_type")
        except: pass
    
    def check_whatsapp(self):
        try:
            r = requests.get(f"https://wa.me/{self.phone_int}", timeout=5)
            self.resultats["whatsapp"] = r.status_code == 200
        except: self.resultats["whatsapp"] = None
    
    def check_telegram(self):
        try:
            r = requests.get(f"https://t.me/+{self.phone_int}", timeout=5)
            self.resultats["telegram"] = r.status_code == 200
        except: self.resultats["telegram"] = None
    
    def scan(self):
        threads = [
            threading.Thread(target=self.check_api),
            threading.Thread(target=self.check_whatsapp),
            threading.Thread(target=self.check_telegram)
        ]
        for t in threads: t.start()
        for t in threads: t.join()
        self.check_operateur()
    
    def afficher(self):
        wa = "✅ Actif" if self.resultats["whatsapp"] else "❌ Non" if self.resultats["whatsapp"] == False else "❓"
        tg = "✅ Actif" if self.resultats["telegram"] else "❌ Non" if self.resultats["telegram"] == False else "❓"
        valid = "✅ Oui" if self.resultats["valid"] else "❓ Probable" if self.resultats["valid"] is None else "❌ Non"
        
        print(f"""
\033[92m╔══════════════════════════════════════════════════════════════════╗
║                    📱 RÉSULTAT OSINT COMPLET                     ║
╠══════════════════════════════════════════════════════════════════╣
║  📞 Numéro local      │  {self.phone_nat:<37} ║
║  🌍 International     │  +{self.phone_int:<36} ║
║  ✅ Valide            │  {valid:<37} ║
║  📶 Opérateur         │  {self.resultats['operateur']:<37} ║
║  📱 Type              │  {self.resultats['type']:<37} ║
║  🇲🇦 Pays              │  Maroc                                  ║
║  💬 WhatsApp          │  {wa:<37} ║
║  ✈️  Telegram          │  {tg:<37} ║
╠══════════════════════════════════════════════════════════════════╣
║                       🔗 LIENS DIRECTS                           ║
╠══════════════════════════════════════════════════════════════════╣
║  💬 WhatsApp   │  https://wa.me/{self.phone_int:<24} ║
║  ✈️  Telegram   │  https://t.me/+{self.phone_int:<23} ║
║  🔍 Truecaller │  truecaller.com/search/ma/{self.phone_nat:<14} ║
╠══════════════════════════════════════════════════════════════════╣
║                    📍 LOCALISATION GPS                           ║
╠══════════════════════════════════════════════════════════════════╣
║  1. Va sur grabify.link                                          ║
║  2. Crée un lien piégé                                           ║
║  3. Envoie-le via WhatsApp à la cible                            ║
║  4. Dès qu'il clique → position GPS exacte                       ║
╚══════════════════════════════════════════════════════════════════╝\033[0m
""")

def main():
    print("\033[91m" + """
╔══════════════════════════════════════════════════════════════════╗
║             🔥 MAROC OSINT PRO 2025 🔥                           ║
║                La version qui marche vraiment                    ║
╚══════════════════════════════════════════════════════════════════╝\033[0m""")
    
    phone = input("\n\033[96m📱 Numéro marocain (06/07/+212) → \033[0m").strip()
    
    if not phone:
        print("\033[91m❌ Numéro vide\033[0m")
        return
    
    print("\n\033[95m⚡ Scan en cours...\033[0m")
    
    osint = MarocOSINT(phone)
    osint.scan()
    osint.afficher()
    
    choix = input("\033[96m🔍 Ouvrir Truecaller ? (o/n) → \033[0m")
    if choix.lower() in ["o","oui","y","yes"]:
        webbrowser.open(f"https://www.truecaller.com/search/ma/{osint.phone_nat}")
        print("\033[92m✅ Truecaller ouvert !\033[0m")
    
    print("\n\033[91m🔥 Scan terminé. Tu as tout ce qui est possible. 🇲🇦\033[0m\n")

if __name__ == "__main__":
    main()