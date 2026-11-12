#!/usr/bin/env bash
# Publish this self-contained static site to a new personal GitHub Pages repo.
set -euo pipefail

site_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$site_dir"
site_repo_name="${1:-coachella-luxury-retreat}"
site_expected_owner="amelkonian-svg"

if [[ ! "$site_repo_name" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]]; then
  echo "Use a repository name containing only letters, digits, dots, hyphens or underscores."
  exit 1
fi
for site_command in git gh python3; do
  if ! command -v "$site_command" >/dev/null 2>&1; then
    echo "Install $site_command before running this script."
    exit 1
  fi
done
if ! gh auth status --hostname github.com >/dev/null 2>&1; then
  echo "Sign in to your personal GitHub account with: gh auth login --hostname github.com"
  echo "Then run this script again. Do not paste credentials into chat."
  exit 1
fi
site_owner="$(gh api user --jq .login)"
if [[ "$site_owner" != "$site_expected_owner" ]]; then
  echo "The active account is $site_owner. This project is intended for $site_expected_owner."
  echo "Switch to that account with: gh auth switch --hostname github.com --user $site_expected_owner"
  exit 1
fi
site_repository="$site_owner/$site_repo_name"
site_https_remote="https://github.com/$site_repository.git"
site_ssh_remote="git@github.com:$site_repository.git"
site_existing_remote=""
if [[ -d .git ]]; then
  site_existing_remote="$(git remote get-url origin 2>/dev/null || true)"
  if [[ -n "$site_existing_remote" && "$site_existing_remote" != "$site_https_remote" && "$site_existing_remote" != "$site_ssh_remote" ]]; then
    echo "This folder already points to another repository. No changes made."
    exit 1
  fi
fi
if gh repo view "$site_repository" --json name >/dev/null 2>&1; then
  if [[ -z "$site_existing_remote" ]]; then
    echo "$site_repository already exists. Choose a new name: bash publish.sh another-name"
    exit 1
  fi
  site_repo_exists=yes
else
  site_repo_exists=no
fi
for site_asset in index.html styles.css app.js assets/pool-disaster.jpg assets/bedroom-disaster.jpg assets/games-disaster.jpg; do
  if [[ ! -f "$site_asset" ]]; then
    echo "Missing required file: $site_asset"
    exit 1
  fi
done
if [[ ! -d .git ]]; then
  git init --initial-branch=main
fi
site_branch="$(git symbolic-ref --short HEAD)"
git add -- index.html styles.css app.js assets README.md publish.sh robots.txt .gitignore .nojekyll
if ! git diff --cached --quiet; then
  git -c user.name="$site_owner" -c user.email="260073827+amelkonian-svg@users.noreply.github.com" commit -m "Create Coachella group-chat listing"
fi
if [[ "$site_repo_exists" == no ]]; then
  gh repo create "$site_repository" --public --source=. --remote=origin --push --description "A Coachella vacation-listing parody for the group chat"
else
  git push --set-upstream origin "$site_branch"
fi
if ! gh api "repos/$site_repository/pages" >/dev/null 2>&1; then
  gh api --method POST "repos/$site_repository/pages" -f build_type=legacy -f "source[branch]=$site_branch" -f 'source[path]=/' >/dev/null
fi
site_public_url="$(gh api "repos/$site_repository/pages" --jq .html_url)"
python3 - "$site_public_url" <<'PY'
from pathlib import Path
import html
import re
import sys

site_url = sys.argv[1].rstrip('/') + '/'
page = Path('index.html')
text = page.read_text()
image_url = html.escape(site_url + 'assets/pool-disaster.jpg', quote=True)
text = re.sub(r'(<meta property="og:image" content=")[^"]*(">)', lambda m: m[1] + image_url + m[2], text)
url_tag = '<meta property="og:url" content="' + html.escape(site_url, quote=True) + '">'
if '<meta property="og:url"' in text:
    text = re.sub(r'<meta property="og:url"[^>]*>', lambda _: url_tag, text)
else:
    text = text.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="website">\n  ' + url_tag)
page.write_text(text)
PY
git add -- index.html
if ! git diff --cached --quiet; then
  git -c user.name="$site_owner" -c user.email="260073827+amelkonian-svg@users.noreply.github.com" commit -m "Set share-preview metadata to the published site URL"
  git push origin "$site_branch"
fi
echo "GitHub Pages configured: $site_public_url"
echo "The first deployment may take a few minutes."
