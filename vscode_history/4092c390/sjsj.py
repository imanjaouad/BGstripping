import sqlite3
import shutil
import os
from datetime import datetime, timedelta

def get_chrome_history():
    """Récupère l'historique Chrome"""
    username = os.getlogin()
    path = fr"C:\Users\{username}\AppData\Local\Google\Chrome\User Data\Default\History"
    return path, "Chrome"

def get_edge_history():
    """Récupère l'historique Edge"""
    username = os.getlogin()
    path = fr"C:\Users\{username}\AppData\Local\Microsoft\Edge\User Data\Default\History"
    return path, "Edge"

def get_firefox_history():
    """Récupère l'historique Firefox"""
    username = os.getlogin()
    firefox_path = fr"C:\Users\{username}\AppData\Roaming\Mozilla\Firefox\Profiles"
    
    if os.path.exists(firefox_path):
        for folder in os.listdir(firefox_path):
            if folder.endswith('.default-release') or folder.endswith('.default'):
                return os.path.join(firefox_path, folder, 'places.sqlite'), "Firefox"
    return None, "Firefox"

def convert_chrome_time(chrome_time):
    """Convertit le timestamp Chrome en date lisible"""
    try:
        return datetime(1601, 1, 1) + timedelta(microseconds=chrome_time)
    except:
        return "Date inconnue"

def convert_firefox_time(firefox_time):
    """Convertit le timestamp Firefox en date lisible"""
    try:
        return datetime.fromtimestamp(firefox_time / 1000000)
    except:
        return "Date inconnue"

def fetch_history(db_path, browser_name):
    """Extrait l'historique de la base de données"""
    temp_file = f"temp_{browser_name}_history"
    history = []
    
    try:
        # Copie du fichier
        shutil.copyfile(db_path, temp_file)
        conn = sqlite3.connect(temp_file)
        cursor = conn.cursor()
        
        if browser_name == "Firefox":
            cursor.execute("""
                SELECT url, title, visit_count, last_visit_date 
                FROM moz_places 
                WHERE visit_count > 0
                ORDER BY last_visit_date DESC
            """)
            for row in cursor.fetchall():
                history.append({
                    'url': row[0],
                    'title': row[1] or "Sans titre",
                    'visits': row[2],
                    'date': convert_firefox_time(row[3]) if row[3] else "Inconnue"
                })
        else:
            cursor.execute("""
                SELECT url, title, visit_count, last_visit_time 
                FROM urls 
                ORDER BY last_visit_time DESC
            """)
            for row in cursor.fetchall():
                history.append({
                    'url': row[0],
                    'title': row[1] or "Sans titre",
                    'visits': row[2],
                    'date': convert_chrome_time(row[3])
                })
        
        conn.close()
        os.remove(temp_file)
        
    except Exception as e:
        print(f"Erreur {browser_name}: {e}")
    
    return history

def save_to_file(all_history):
    """Sauvegarde l'historique dans un fichier HTML"""
    filename = "mon_historiqu"
    e.html
    html = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mon Historique de Navigation</title>
    <style>
        body { font-family: Arial; background: #1a1a2e; color: #eee; padding: 20px; }
        h1 { color: #00d4ff; text-align: center; }
        h2 { color: #ff6b6b; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px; }
        .site { background: #16213e; padding: 15px; margin: 10px 0; border-radius: 10px; }
        .site:hover { background: #1f3460; }
        .url { color: #00d4ff; word-break: break-all; }
        .title { font-weight: bold; font-size: 16px; }
        .info { color: #888; font-size: 12px; margin-top: 5px; }
        .stats { text-align: center; background: #0f3460; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        a { color: #00d4ff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>🌐 Mon Historique de Navigation</h1>
    <div class="stats">
        <h3>📊 Statistiques</h3>
        <p>Total de sites visités: <strong>""" + str(sum(len(h) for h in all_history.values())) + """</strong></p>
    </div>
"""
    
    for browser, history in all_history.items():
        if history:
            html += f"<h2>🔹 {browser} ({len(history)} sites)</h2>"
            for site in history:
                html += f"""
                <div class="site">
                    <div class="title">{site['title']}</div>
                    <div class="url"><a href="{site['url']}" target="_blank">{site['url'][:100]}...</a></div>
                    <div class="info">📅 {site['date']} | 👁️ {site['visits']} visites</div>
                </div>
                """
    
    html += "</body></html>"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return filename

def main():
    print("=" * 50)
    print("   📜 RÉCUPÉRATION DE L'HISTORIQUE")
    print("=" * 50)
    print("\n⚠️  Fermez vos navigateurs pour de meilleurs résultats!\n")
    
    all_history = {}
    
    # Chrome
    print("🔍 Recherche Chrome...")
    path, name = get_chrome_history()
    if os.path.exists(path):
        all_history["Chrome"] = fetch_history(path, name)
        print(f"   ✅ {len(all_history['Chrome'])} sites trouvés")
    else:
        print("   ❌ Chrome non trouvé")
    
    # Edge
    print("🔍 Recherche Edge...")
    path, name = get_edge_history()
    if os.path.exists(path):
        all_history["Edge"] = fetch_history(path, name)
        print(f"   ✅ {len(all_history['Edge'])} sites trouvés")
    else:
        print("   ❌ Edge non trouvé")
    
    # Firefox
    print("🔍 Recherche Firefox...")
    path, name = get_firefox_history()
    if path and os.path.exists(path):
        all_history["Firefox"] = fetch_history(path, name)
        print(f"   ✅ {len(all_history['Firefox'])} sites trouvés")
    else:
        print("   ❌ Firefox non trouvé")
    
    # Sauvegarde
    if any(all_history.values()):
        print("\n💾 Création du fichier HTML...")
        filename = save_to_file(all_history)
        print(f"   ✅ Fichier créé: {filename}")
        
        # Ouvre automatiquement le fichier
        os.startfile(filename)
        print("\n🎉 Fichier ouvert dans votre navigateur!")
    else:
        print("\n❌ Aucun historique trouvé.")

if __name__ == "__main__":
    main()
    input("\nAppuyez sur Entrée pour quitter...")