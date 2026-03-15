import yt_dlp
import os

def download(url, quality="best"):
    """Télécharger ay video mn ay site"""
    
    os.makedirs("downloads", exist_ok=True)

    ydl_opts = {
        # Akhir qualité
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        
        # Fin yt-sauvegarder
        'outtmpl': 'downloads/%(title)s.%(ext)s',
        
        # Merge f mp4
        'merge_output_format': 'mp4',
        
        # Progress
        'progress_hooks': [hook],

        # Bach Facebook ykhdm mzyan
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
    }

    # Ila bghiti qualité specifique
    if quality == "720":
        ydl_opts['format'] = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720]/best'
    elif quality == "480":
        ydl_opts['format'] = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480]/best'
    elif quality == "360":
        ydl_opts['format'] = 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360]/best'
    elif quality == "audio":
        ydl_opts['format'] = 'bestaudio/best'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '320',
        }]
        ydl_opts['outtmpl'] = 'downloads/%(title)s.%(ext)s'

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print("\n📡 Kan-jbed info dyal l-video...")
            info = ydl.extract_info(url, download=False)
            
            print(f"""
{'='*50}
📌 Titre    : {info.get('title', '???')}
👤 Source   : {info.get('uploader', '???')}
⏱️  Durée    : {info.get('duration', 0) // 60}min {info.get('duration', 0) % 60}s
🌐 Site     : {info.get('extractor', '???')}
{'='*50}
            """)
            
            print("⬇️  Kan-télécharger...\n")
            ydl.download([url])
            print(f"\n✅ KMEL! Video f dossier: downloads/")
            
    except Exception as e:
        print(f"\n❌ Erreur: {e}")


def hook(d):
    if d['status'] == 'downloading':
        p = d.get('_percent_str', '?')
        s = d.get('_speed_str', '?')
        print(f"\r⬇️  {p} | {s}  ", end='', flush=True)
    elif d['status'] == 'finished':
        print("\n📦 Kan-finalize...")


# ============ MAIN ============
if __name__ == "__main__":
    print("""
╔════════════════════════════════════════╗
║   🎬  VIDEO DOWNLOADER  - AY VIDEO    ║
║                                        ║
║   YouTube ✅  Facebook ✅  Twitter ✅   ║
║   Instagram ✅ TikTok ✅  w +1000...   ║
╚════════════════════════════════════════╝
    """)

    while True:
        url = input("\n🔗 Lien dyal video (wla 'q' bach tkhrej): ").strip()
        
        if url.lower() in ['q', 'quit', 'exit']:
            print("👋 Bslama!")
            break

        if not url:
            print("❌ Dkhel lien!")
            continue

        print("""
  1. 🎯 Akhir qualité (best)
  2. 📺 720p
  3. 📱 480p
  4. 📼 360p
  5. 🎵 Audio bach (MP3)
        """)
        
        q = input("Khtar qualité (1-5) [1]: ").strip() or "1"
        
        qualities = {"1": "best", "2": "720", "3": "480", "4": "360", "5": "audio"}
        quality = qualities.get(q, "best")
        
        download(url, quality)