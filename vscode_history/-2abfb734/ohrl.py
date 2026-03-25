# -*- coding: utf-8 -*-

import webbrowser
import argparse
import urllib.parse
import time

def search_username(username):
    """
    Constructs and opens the direct profile URL for a given username on various social media platforms.
    This is the fastest method to check if a username exists on a platform.
    """
    print(f"--- Searching for username: '{username}' ---\n")

    # A dictionary of social media platforms and their URL formats.
    # The {username} part will be replaced by the actual username.
    social_platforms = {
        "Facebook": "https://www.facebook.com/{}",
        "Instagram": "https://www.instagram.com/{}",
        "X (Twitter)": "https://twitter.com/{}",
        "LinkedIn": "https://www.linkedin.com/in/{}",
        "TikTok": "https://www.tiktok.com/@{}",
        "YouTube": "https://www.youtube.com/{}",
        "Pinterest": "https://www.pinterest.com/{}",
        "Reddit": "https://www.reddit.com/user/{}",
        "Snapchat": "https://www.snapchat.com/add/{}",
        "Telegram": "https://t.me/{}",
        "Discord": "https://discord.com/users/{}", # Note: This often requires a user ID, not a username
        "Medium": "https://medium.com/@{}",
        "VK": "https://vk.com/{}",
        "Tumblr": "https://{}.tumblr.com",
        "Behance": "https://www.behance.net/{}",
        "Dribbble": "https://dribbble.com/{}",
        "Flickr": "https://www.flickr.com/people/{}/",
        "Steam": "https://steamcommunity.com/id/{}",
        "Twitch": "https://www.twitch.tv/{}",
        "Vimeo": "https://vimeo.com/{}",
        "SoundCloud": "https://soundcloud.com/{}",
        "About.me": "https://about.me/{}",
        "Bitbucket": "https://bitbucket.org/{}/",
        "GitLab": "https://gitlab.com/{}",
        "CodePen": "https://codepen.io/{}"
    }

    for platform, url_format in social_platforms.items():
        profile_url = url_format.format(username)
        
        print(f"Attempting to open {platform}: {profile_url}")
        
        # Open the URL in a new browser tab. 'new=2' opens in a new tab, if possible.
        webbrowser.open(profile_url, new=2)
        
        # A small delay to prevent overwhelming the browser or system.
        time.sleep(0.5)

    print("\n--- Done. All possible profile links have been opened in your browser. ---")


def search_name(full_name):
    """
    Opens a Google search for a given name on specific social media platforms.
    This method is useful for finding people when you only know their name.
    """
    print(f"--- Searching for full name: '{full_name}' ---\n")

    # We use Google's "site:" operator to search within a specific website.
    # The name is URL-encoded to handle spaces and special characters.
    encoded_name = urllib.parse.quote_plus(full_name)
    
    platforms = {
        "Facebook": "facebook.com",
        "Instagram": "instagram.com",
        "X (Twitter)": "twitter.com",
        "LinkedIn": "linkedin.com/in",
        "TikTok": "tiktok.com/@",
        "YouTube": "youtube.com",
        "Pinterest": "pinterest.com",
        "Reddit": "reddit.com/user",
        "Medium": "medium.com/@",
        "VK": "vk.com",
        "Tumblr": "tumblr.com",
        "Behance": "behance.net",
        "Dribbble": "dribbble.com",
        "Steam": "steamcommunity.com/id",
        "Twitch": "twitch.tv",
        "Vimeo": "vimeo.com",
        "SoundCloud": "soundcloud.com",
        "About.me": "about.me",
        "Google Photos": "photos.google.com" # Google Photos has no public username, so we search by name.
    }

    for platform_name, site_domain in platforms.items():
        # Construct the Google search query.
        search_query = f"https://www.google.com/search?q=site:{site_domain}+\"{encoded_name}\""
        
        print(f"Searching for '{full_name}' on {platform_name} via Google...")
        
        # Open the Google search results page in a new tab.
        webbrowser.open(search_query, new=2)
        
        # A small delay.
        time.sleep(1)

    print("\n--- Done. Check the search results in your browser tabs. ---")


def main():
    """
    Main function to parse command-line arguments and start the search.
    """
    parser = argparse.ArgumentParser(
        description="Search for a person's social media presence using a username or a full name.",
        epilog="Examples:\n"
              "  python social_search.py username elonmusk\n"
              "  python social_search.py name \"John Doe\"",
        formatter_class=argparse.RawTextHelpFormatter
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Choose a search method', required=True)

    # Parser for the 'username' command
    parser_username = subparsers.add_parser('username', help='Search by a single username')
    parser_username.add_argument('user', help='The username to search for (e.g., elonmusk)')

    # Parser for the 'name' command
    parser_name = subparsers.add_parser('name', help='Search by a full name')
    parser_name.add_argument('full_name', help='The full name to search for (e.g., "John Doe")')

    args = parser.parse_args()

    if args.command == 'username':
        search_username(args.user)
    elif args.command == 'name':
        search_name(args.full_name)


if __name__ == "__main__":
    main()