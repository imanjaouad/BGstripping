import requests
import re
import os
import yt_dlp

def download_video(url):
    """Download mn ay site"""
    os.makedirs("downloads", exist_ok=True)
    
    is_fb = any(x in url for x in ['facebook.com', 'fb.com', 'fb.watch'])
    
    if is_fb:
        print("📘 Facebook detected!\n")
        
        # Jrreb méthode 1: yt-dlp nightly
        if try_ytdlp(url):
            return
        
        # Jrreb méthode 2: Direct scraping
        if try_direct_scrape(url):
            return
            
        # Jrreb méthode 3: API externe
        if try_api_method(url):
            return
        
        print("\n😞 Ma 9dertch. Jrreb Solution 3 (cookies.txt)")
    else:
        # YouTube, TikTok, etc - normal
        try_ytdlp(url)


def try_ytdlp(url):
    """Méthode 1: yt-dlp normal"""
    print("⚡ Méthode 1: yt-dlp...")
    
    opts = {
        'format': 'best[ext=mp4]/best',
        'outtmpl': 'downloads/%(title)s.%(ext)s',
        'merge_output_format': 'mp4',
        'quiet': False,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                          'AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36',
        },
    }
    
    # Jrreb b cookies dyal browsers
    for browser in ['chrome', 'firefox', 'edge', 'brave']:
        try:
            opts_copy = opts.copy()
            opts_copy['cookiesfrombrowser'] = (browser,)
            with yt_dlp.YoutubeDL(opts_copy) as ydl:
                ydl.download([url])
            print(f"\n✅ KMEL b {browser} cookies!")
            return True
        except:
            continue
    
    # Jrreb bla cookies
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([url])
        print("\n✅ KMEL!")
        return True
    except:
        print("   ❌ yt-dlp ma khdamch\n")
        return False


def try_direct_scrape(url):
    """Méthode 2: Njbdo video URL directement mn page Facebook"""
    print("🔍 Méthode 2: Direct scraping...")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                       'AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        html = response.text
        
        # Qleb 3la video URLs f page source
        patterns = [
            r'"playable_url_quality_hd":"([^"]+)"',    # HD
            r'"playable_url":"([^"]+)"',                 # SD
            r'"hd_src":"([^"]+)"',                       # HD src
            r'"sd_src":"([^"]+)"',                       # SD src
            r'hd_src:"([^"]+)"',
            r'sd_src:"([^"]+)"',
            r'"browser_native_hd_url":"([^"]+)"',
            r'"browser_native_sd_url":"([^"]+)"',
        ]
        
        video_url = None
        quality = ""
        
        for pattern in patterns:
            match = re.search(pattern, html)
            if match:
                video_url = match.group(1)
                video_url = video_url.replace('\\/', '/')
                video_url = video_url.encode().decode('unicode_escape')
                quality = "HD" if "hd" in pattern.lower() else "SD"
                break
        
        if video_url:
            print(f"   ✅ L9it video URL ({quality})!")
            print(f"   ⬇️  Kan-télécharger...\n")
            
            # Télécharger l-video
            r = requests.get(video_url, headers=headers, stream=True, timeout=60)
            
            filename = f"downloads/facebook_video_{quality}.mp4"
            total = int(r.headers.get('content-length', 0))
            downloaded = 0
            
            with open(filename, 'wb') as f:
                for chunk in r.iter_content(chunk_size=1024 * 1024):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total > 0:
                            percent = (downloaded / total) * 100
                            mb = downloaded / (1024 * 1024)
                            total_mb = total / (1024 * 1024)
                            print(f"\r   ⬇️  {percent:.1f}% ({mb:.1f}/{total_mb:.1f} MB)", 
                                  end='', flush=True)
            
            size = os.path.getsize(filename) / (1024 * 1024)
            print(f"\n\n   ✅ KMEL! {filename} ({size:.1f} MB)")
            return True
        else:
            print("   ❌ Ma l9itch video URL f page\n")
            return False
            
    except Exception as e:
        print(f"   ❌ Erreur: {e}\n")
        return False


def try_api_method(url):
    """Méthode 3: API bach n-télécharger"""
    print("🌐 Méthode 3: API method...")
    
    try:
        api_url = f"https://www.getfvid.com/downloader"
        # Wla jrreb had l-API
        api_url2 = "https://fdownloader.net/api/ajaxSearch"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                           'AppleWebKit/537.36 Chrome/125.0.0.0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://fdownloader.net',
            'Referer': 'https://fdownloader.net/',
        }
        
        data = {
            'q': url,
            'lang': 'en',
        }
        
        response = requests.post(api_url2, data=data, headers=headers, timeout=15)
        
        if response.status_code == 200:
            result = response.json()
            html_content = result.get('data', '')
            
            # Extract download links
            download_links = re.findall(r'href="(https://[^"]+\.mp4[^"]*)"', html_content)
            
            if download_links:
                video_url = download_links[0]
                print(f"   ✅ L9it link!")
                
                r = requests.get(video_url, stream=True, timeout=60)
                filename = "downloads/facebook_video.mp4"
                
                with open(filename, 'wb') as f:
                    for chunk in r.iter_content(chunk_size=1024*1024):
                        if chunk:
                            f.write(chunk)
                
                size = os.path.getsize(filename) / (1024*1024)
                print(f"   ✅ KMEL! {filename} ({size:.1f} MB)")
                return True
        
        print("   ❌ API ma khdamch\n")
        return False
        
    except Exception as e:
        print(f"   ❌ API Error: {e}\n")
        return False


# ============ MAIN ============
if __name__ == "__main__":
    print("""
╔════════════════════════════════════════════╗
║   🎬  VIDEO DOWNLOADER (Facebook Fix!)    ║
║                                            ║
║   YouTube ✅  Facebook ✅  TikTok ✅       ║
║   Instagram ✅  Twitter ✅  +1000...       ║
╚════════════════════════════════════════════╝
    """)

    while True:
        url = input("🔗 Lien (wla 'q' tkhrej): ").strip()
        
        if url.lower() in ['q', 'quit']:
            print("👋 Bslama!")
            break
        if not url:
            continue
        
        download_video(url)