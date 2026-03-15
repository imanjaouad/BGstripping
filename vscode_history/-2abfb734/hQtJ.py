# -*- coding: utf-8 -*-

import webbrowser
import argparse
import urllib.parse
import time

def search_username(username):
    """
    Construit et ouvre les URL de profil pour un nom d'utilisateur donné
    sur plusieurs plateformes de réseaux sociaux.
    """
    # Dictionnaire des plateformes et de leurs formats d'URL.
    # La partie {username} sera remplacée par le nom d'utilisateur réel.
    social_platforms = {
        "Facebook": "https://www.facebook.com/{}",
        "Instagram": "https://www.instagram.com/{}",
        "X (Twitter)": "https://twitter.com/{}",
        "LinkedIn": "https://www.linkedin.com/in/{}",
        "TikTok": "https://www.tiktok.com/@{}",
        "YouTube": "https://www.youtube.com/{}",
        "GitHub": "https://github.com/{}",
        "Pinterest": "https://www.pinterest.com/{}",
        "Reddit": "https://www.reddit.com/user/{}",
        "Snapchat": "https://www.snapchat.com/add/{}",
        "Telegram": "https://t.me/{}",
        "Discord": "https://discord.com/users/{}" # Note: Nécessite souvent un ID utilisateur, pas un nom d'utilisateur
    }

    print(f"--- Recherche du nom d'utilisateur : '{username}' ---\n")

    for platform, url_format in social_platforms.items():
        profile_url = url_format.format(username)
        
        print(f"Tentative d'ouverture de {platform} : {profile_url}")
        
        # Ouvre l'URL dans un nouvel onglet du navigateur
        webbrowser.open(profile_url, new=2)
        
        # Un petit délai pour ne pas surcharger le navigateur ou le système
        time.sleep(0.5)

    print("\n--- Terminé. Tous les liens de profil possibles ont été ouverts dans votre navigateur. ---")


def search_name(full_name):
    """
    Ouvre une recherche Google pour un nom complet sur des plateformes spécifiques.
    """
    # On utilise l'opérateur "site:" de Google pour chercher dans un site spécifique.
    # Le nom est encodé pour gérer les espaces et les caractères spéciaux.
    encoded_name = urllib.parse.quote_plus(full_name)
    
    platforms = {
        "Facebook": "facebook.com",
        "Instagram": "instagram.com",
        "X (Twitter)": "twitter.com",
        "LinkedIn": "linkedin.com/in",
        "TikTok": "tiktok.com/@",
        "GitHub": "github.com",
        "Reddit": "reddit.com/user"
    }

    print(f"--- Recherche du nom complet : '{full_name}' ---\n")

    for platform_name, site_domain in platforms.items():
        # Construire la requête de recherche Google
        search_query = f"https://www.google.com/search?q=site:{site_domain}+\"{encoded_name}\""
        
        print(f"Recherche de '{full_name}' sur {platform_name} via Google...")
        
        # Ouvre la page de résultats de recherche Google dans un nouvel onglet
        webbrowser.open(search_query, new=2)
        
        # Un petit délai
        time.sleep(1)

    print("\n--- Terminé. Vérifiez les résultats de recherche dans les onglets de votre navigateur. ---")


def main():
    """
    Fonction principale pour analyser les arguments de la ligne de commande
    et lancer la recherche appropriée.
    """
    parser = argparse.ArgumentParser(
        description="Rechercher un nom d'utilisateur ou un nom complet sur plusieurs plateformes de réseaux sociaux.",
        epilog="Exemples :\n"
              "  python chercheur_social.py username elonmusk\n"
              "  python chercheur_social.py name \"John Doe\"",
        formatter_class=argparse.RawTextHelpFormatter
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Type de recherche à effectuer', required=True)

    # Analyseur pour la commande 'username'
    parser_username = subparsers.add_parser('username', help='Rechercher par un seul nom d\'utilisateur')
    parser_username.add_argument('user', help='Le nom d\'utilisateur à rechercher (ex: elonmusk)')

    # Analyseur pour la commande 'name'
    parser_name = subparsers.add_parser('name', help='Rechercher par un nom complet')
    parser_name.add_argument('full_name', help='Le nom complet à rechercher (ex: "John Doe")')

    args = parser.parse_args()

    if args.command == 'username':
        search_username(args.user)
    elif args.command == 'name':
        search_name(args.full_name)


if __name__ == "__main__":
    main()