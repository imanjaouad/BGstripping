import requests
import webbrowser
import threading
import time
import re

# ═══════════════════════════════════════════════════════════════════
#                    MAROC OSINT ULTIMATE 2025
#         Numéro → Ville + Opérateur + Réseaux Sociaux
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
            "ville": None,
            "region": None,
            "whatsapp": None,
            "telegram": None,
            "facebook": None,
            "instagram": None,
            "twitter": None,
            "snapchat": None,
            "tiktok": None,
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
    
    def check_operateur_et_ville(self):
        prefix = self.phone_nat[0:4]
        
        # Opérateurs
        inwi = ["0610","0611","0612","0613","0614","0615","0616","0617","0618","0619",
                "0700","0701","0702","0703","0704","0705","0706","0707","0708","0709"]
        orange = ["0620","0621","0622","0623","0624","0625","0626","0627","0628","0629"]
        
        if prefix in inwi: 
            self.resultats["operateur"] = "🟡 Inwi"
        elif prefix in orange: 
            self.resultats["operateur"] = "🟠 Orange Maroc"
        elif self.phone_nat[0:3] in ["066","067","068"]: 
            self.resultats["operateur"] = "🔵 Maroc Telecom (IAM)"
        else: 
            self.resultats["operateur"] = "❓ Inconnu"
        
        # Villes par préfixes
        villes = {
            "0520": ("Casablanca", "Casablanca-Settat"),
            "0521": ("Casablanca", "Casablanca-Settat"),
            "0522": ("Casablanca", "Casablanca-Settat"),
            "0523": ("Casablanca", "Casablanca-Settat"),
            "0524": ("Marrakech", "Marrakech-Safi"),
            "0525": ("El Jadida", "Casablanca-Settat"),
            "0528": ("Agadir", "Souss-Massa"),
            "0530": ("Rabat", "Rabat-Salé-Kénitra"),
            "0531": ("Rabat", "Rabat-Salé-Kénitra"),
            "0535": ("Fès", "Fès-Meknès"),
            "0536": ("Oujda", "Oriental"),
            "0537": ("Rabat", "Rabat-Salé-Kénitra"),
            "0538": ("Tanger", "Tanger-Tétouan-Al Hoceïma"),
            "0539": ("Tanger", "Tanger-Tétouan-Al Hoceïma"),
            "0661": ("Casablanca", "Grand Casablanca"),
            "0662": ("Casablanca", "Grand Casablanca"),
            "0663": ("Rabat", "Rabat-Salé-Kénitra"),
            "0664": ("Rabat", "Rabat-Salé-Kénitra"),
            "0665": ("Marrakech", "Marrakech-Safi"),
            "0666": ("Marrakech", "Marrakech-Safi"),
            "0667": ("Fès", "Fès-Meknès"),
            "0668": ("Fès", "Fès-Meknès"),
            "0669": ("Tanger", "Tanger-Tétouan-Al Hoceïma"),
            "0670": ("Tanger", "Tanger-Tétouan-Al Hoceïma"),
            "0671": ("Agadir", "Souss-Massa"),
            "0672": ("Agadir", "Souss-Massa"),
            "0673": ("Oujda", "Oriental"),
            "0674": ("Oujda", "Oriental"),
            "0675": ("Meknès", "Fès-Meknès"),
            "0676": ("Meknès", "Fès-Meknès"),
            "0677": ("Kénitra", "Rabat-Salé-Kénitra"),
            "0678": ("Kénitra", "Rabat-Salé-Kénitra"),
            "0620": ("Casablanca", "Grand Casablanca"),
            "0621": ("Casablanca", "Grand Casablanca"),
            "0622": ("Rabat", "Rabat-Salé-Kénitra"),
            "0623": ("Rabat", "Rabat-Salé-Kénitra"),
            "0624": ("Marrakech", "Marrakech-Safi"),
            "0625": ("Fès", "Fès-Meknès"),
            "0626": ("Tanger", "Tanger-Tétouan-Al Hoceïma"),
            "0627": ("Agadir", "Souss-Massa"),
            "0628": ("Oujda", "Oriental"),
            "0610": ("Casablanca", "Grand Casablanca"),
            "0611": ("Rabat", "Rabat-Salé-Kénitra"),
            "0612": ("Marrakech", "Marrakech-Safi"),
            "0613": ("Fès", "Fès-Meknès"),
            "0614": ("Tanger", "Tanger-Tétouan-Al Hoceïma"),
            "0615": ("Agadir", "Souss-Massa"),
            "0700": ("Casablanca", "Grand Casablanca"),
            "0701": ("Rabat", "Rabat-Salé-Kénitra"),
            "0702": ("Marrakech", "Marrakech-Safi"),
            "0703": ("Fès", "Fès-Meknès"),
            "0704": ("Tanger", "Tanger-Tétouan-Al Hoceïma"),
            "0705": ("Agadir", "Souss-Massa"),
        }
        
        if prefix in villes:
            self.resultats["ville"] = villes[prefix][0]
            self.resultats["region"] = villes[prefix][1]
        else:
            self.resultats["ville"] = "Maroc"
            self.resultats["region"] = "National"
    
    def check_api(self):
        try:
            r = requests.get(
                f"https://api.apilayer.com/number_verification/validate?number=+{self.phone_int}",
                headers={"apikey": APILAYER_KEY}, timeout=10
            )
            if r.status_code == 200:
                data = r.json()
                self.resultats["valid"] = data.get("valid")
                if data.get("carrier"): 
                    self.resultats["operateur"] = data.get("carrier")
                if data.get("line_type"): 
                    self.resultats["type"] = data.get("line_type")
        except: pass
    
    def check_whatsapp(self):
        try:
            r = requests.get(f"https://wa.me/{self.phone_int}", timeout=5, allow_redirects=True)
            self.resultats["whatsapp"] = "api.whatsapp" in r.url or r.status_code == 200
        except: 
            self.resultats["whatsapp"] = None
    
    def check_telegram(self):
        try:
            r = requests.get(f"https://t.me/+{self.phone_int}", timeout=5)
            self.resultats["telegram"] = r.status_code == 200
        except: 
            self.resultats["telegram"] = None
    
    def check_facebook(self):
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            # Méthode 1 : Recherche par numéro
            r = requests.get(
                f"https://www.facebook.com/login/identify/?ctx=recover&phone={self.phone_int}",
                headers=headers, timeout=8, allow_redirects=True
            )
            if r.status_code == 200 and ("profile" in r.text.lower() or "compte" in r.text.lower()):
                self.resultats["facebook"] = "✅ Compte lié"
            else:
                self.resultats["facebook"] = "❓ Non vérifié"
        except:
            self.resultats["facebook"] = "❓ Non vérifié"
    
    def check_instagram(self):
        try:
            headers = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"}
            r = requests.get(
                f"https://www.instagram.com/accounts/account_recovery_send_ajax/",
                headers=headers, timeout=8
            )
            # Instagram ne permet pas la recherche directe par numéro sans login
            self.resultats["instagram"] = "🔗 Vérifier Truecaller"
        except:
            self.resultats["instagram"] = "❓ Non vérifié"
    
    def check_twitter(self):
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            r = requests.get(
                f"https://api.twitter.com/i/users/phone_number_available.json?phone_number=+{self.phone_int}",
                headers=headers, timeout=8
            )
            if r.status_code == 200:
                data = r.json()
                if data.get("taken"):
                    self.resultats["twitter"] = "✅ Compte lié"
                else:
                    self.resultats["twitter"] = "❌ Pas de compte"
            else:
                self.resultats["twitter"] = "❓ Non vérifié"
        except:
            self.resultats["twitter"] = "❓ Non vérifié"
    
    def check_snapchat(self):
        try:
            headers = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"}
            r = requests.post(
                "https://accounts.snapchat.com/accounts/merlin/login",
                json={"phone": f"+{self.phone_int}"},
                headers=headers, timeout=8
            )
            if r.status_code in [200, 400]:
                if "account" in r.text.lower() or "exists" in r.text.lower():
                    self.resultats["snapchat"] = "✅ Compte lié"
                else:
                    self.resultats["snapchat"] = "❓ Non vérifié"
            else:
                self.resultats["snapchat"] = "❓ Non vérifié"
        except:
            self.resultats["snapchat"] = "❓ Non vérifié"
    
    def check_tiktok(self):
        try:
            headers = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"}
            r = requests.get(
                f"https://www.tiktok.com/api/user/detail/?phone={self.phone_int}",
                headers=headers, timeout=8
            )
            if r.status_code == 200 and "user" in r.text.lower():
                self.resultats["tiktok"] = "✅ Compte lié"
            else:
                self.resultats["tiktok"] = "❓ Non vérifié"
        except:
            self.resultats["tiktok"] = "❓ Non vérifié"
    
    def scan(self):
        print("\033[95m   ⏳ Scan API + Opérateur...\033[0m")
        threads_phase1 = [
            threading.Thread(target=self.check_api),
            threading.Thread(target=self.check_whatsapp),
            threading.Thread(target=self.check_telegram),
        ]
        for t in threads_phase1: t.start()
        for t in threads_phase1: t.join()
        
        print("\033[95m   ⏳ Scan Réseaux Sociaux...\033[0m")
        threads_phase2 = [
            threading.Thread(target=self.check_facebook),
            threading.Thread(target=self.check_instagram),
            threading.Thread(target=self.check_twitter),
            threading.Thread(target=self.check_snapchat),
            threading.Thread(target=self.check_tiktok),
        ]
        for t in threads_phase2: t.start()
        for t in threads_phase2: t.join()
        
        self.check_operateur_et_ville()
        print("\033[92m   ✅ Scan terminé !\033[0m")
    
    def afficher(self):
        wa = "✅ Actif" if self.resultats["whatsapp"] else "❌ Non" if self.resultats["whatsapp"] == False else "❓"
        tg = "✅ Actif" if self.resultats["telegram"] else "❌ Non" if self.resultats["telegram"] == False else "❓"
        valid = "✅ Oui" if self.resultats["valid"] else "❓ Probable" if self.resultats["valid"] is None else "❌ Non"
        ville = self.resultats["ville"] or "Non déterminée"
        region = self.resultats["region"] or ""
        fb = self.resultats["facebook"] or "❓"
        ig = self.resultats["instagram"] or "❓"
        tw = self.resultats["twitter"] or "❓"
        sc = self.resultats["snapchat"] or "❓"
        tt = self.resultats["tiktok"] or "❓"
        
        print(f"""
\033[92m╔════════════════════════════════════════════════════════════════════════╗
║                       📱 RÉSULTAT OSINT COMPLET                        ║
╠════════════════════════════════════════════════════════════════════════╣
║  📞 Numéro local        │  {self.phone_nat:<45} ║
║  🌍 International       │  +{self.phone_int:<44} ║
║  ✅ Valide              │  {valid:<45} ║
║  📶 Opérateur           │  {self.resultats['operateur']:<45} ║
║  📱 Type                │  {self.resultats['type']:<45} ║
║  🏙️  Ville               │  {ville:<45} ║
║  🗺️  Région              │  {region:<45} ║
║  🇲🇦 Pays                │  Maroc                                        ║
╠════════════════════════════════════════════════════════════════════════╣
║                         💬 MESSAGERIES                                 ║
╠════════════════════════════════════════════════════════════════════════╣
║  💬 WhatsApp            │  {wa:<45} ║
║  ✈️  Telegram            │  {tg:<45} ║
╠════════════════════════════════════════════════════════════════════════╣
║                       📲 RÉSEAUX SOCIAUX                               ║
╠════════════════════════════════════════════════════════════════════════╣
║  📘 Facebook            │  {fb:<45} ║
║  📸 Instagram           │  {ig:<45} ║
║  🐦 Twitter/X           │  {tw:<45} ║
║  👻 Snapchat            │  {sc:<45} ║
║  🎵 TikTok              │  {tt:<45} ║
╠════════════════════════════════════════════════════════════════════════╣
║                          🔗 LIENS DIRECTS                              ║
╠════════════════════════════════════════════════════════════════════════╣
║  💬 WhatsApp     →  https://wa.me/{self.phone_int:<34} ║
║  ✈️  Telegram     →  https://t.me/+{self.phone_int:<33} ║
║  🔍 Truecaller   →  truecaller.com/search/ma/{self.phone_nat:<22} ║
║  📘 Facebook     →  facebook.com/search/?q={self.phone_nat:<25} ║
╠════════════════════════════════════════════════════════════════════════╣
║                       📍 LOCALISATION GPS EXACTE                       ║
╠════════════════════════════════════════════════════════════════════════╣
║  1. Va sur → grabify.link                                              ║
║  2. Crée un lien piégé                                                 ║
║  3. Envoie via WhatsApp → https://wa.me/{self.phone_int:<25} ║
║  4. Dès qu'il clique → position GPS exacte                             ║
╚════════════════════════════════════════════════════════════════════════╝\033[0m
""")

def main():
    print("\033[91m" + """
╔════════════════════════════════════════════════════════════════════════╗
║                    🔥 MAROC OSINT ULTIMATE 2025 🔥                     ║
║        Numéro → Ville + Opérateur + WhatsApp + Réseaux Sociaux         ║
╚════════════════════════════════════════════════════════════════════════╝\033[0m""")
    
    while True:
        phone = input("\n\033[96m📱 Numéro marocain (06/07/+212) [q=quitter] → \033[0m").strip()
        
        if phone.lower() in ["q", "quit", "exit"]:
            print("\033[93m👋 À bientôt mon frère !\033[0m")
            break
        
        if not phone:
            print("\033[91m❌ Numéro vide\033[0m")
            continue
        
        print("\n\033[95m⚡ Scan TOTAL en cours...\033[0m")
        
        osint = MarocOSINT(phone)
        osint.scan()
        osint.afficher()
        
        print("\033[96m🔍 Options :\033[0m")
        print("   [1] Ouvrir Truecaller (Nom + Photo)")
        print("   [2] Ouvrir WhatsApp")
        print("   [3] Rechercher sur Facebook")
        print("   [4] Scanner un autre numéro")
        
        choix = input("\033[96mChoix (1/2/3/4) → \033[0m")
        
        if choix == "1":
            webbrowser.open(f"https://www.truecaller.com/search/ma/{osint.phone_nat}")
            print("\033[92m✅ Truecaller ouvert !\033[0m")
        elif choix == "2":
            webbrowser.open(f"https://wa.me/{osint.phone_int}")
            print("\033[92m✅ WhatsApp ouvert !\033[0m")
        elif choix == "3":
            webbrowser.open(f"https://www.facebook.com/search/top/?q={osint.phone_nat}")
            print("\033[92m✅ Facebook ouvert !\033[0m")

if __name__ == "__main__":
    main()