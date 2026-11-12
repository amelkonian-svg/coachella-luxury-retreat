# Coachella group-chat listing

A responsive static parody of the shared Vrbo property listing, built for GitHub Pages. The page closely follows the source listing's visual structure while mixing original photos with three deliberately disastrous photo edits and joke copy.

## Files

- `index.html` — property page, gallery and dialogs.
- `styles.css` — responsive layout and local font definitions.
- `app.js` — gallery, mobile swipe, sharing, local save state, guest/date controls and parody dialogs.
- `assets/` — locally stored listing photos, altered photos, logo and fonts.

No package installation, build step, server, analytics, sign-in, payment collection or booking integration is needed.

## Local preview

Run `python -m http.server 8080` in this directory, then open `http://localhost:8080`.

## GitHub Pages

The project repository is https://github.com/amelkonian-svg/coachella-luxury-retreat. GitHub Pages uses the `main` branch and repository root. The intended site URL is https://amelkonian-svg.github.io/coachella-luxury-retreat/.

The included `publish.sh` can publish updates from a clone of this repository and enables GitHub Pages from the repository root. It requires Git, the GitHub CLI and Python 3, with the CLI signed in as `amelkonian-svg`. Run `bash publish.sh` from the cloned repository directory. It refuses to overwrite an unrelated existing repository. To create a separate repository from an extracted copy, run `bash publish.sh your-new-name`.

The script uses the URL returned by GitHub Pages to set the social-share image and page metadata. All other assets use relative paths, so the site works under a repository subpath.

Alternatively, create an empty public GitHub repository, upload the contents of this directory, then choose **Settings → Pages → Deploy from a branch → main → /(root)**. When publishing manually, update `og:image` to the final absolute image URL and add `og:url` for reliable messaging previews.

## Interaction notes

- Clicking any gallery photo opens the full-screen gallery. Arrow keys, next/previous buttons, thumbnails and horizontal swipe work.
- The mobile hero gallery scrolls horizontally.
- Share uses the native share sheet when available, then clipboard fallback.
- Save persists in browser local storage and degrades safely when storage is unavailable.
- Date and traveller controls only change local page state.
- Check availability and account/navigation actions open joke dialogs. No reservation or account is created.
- The original property link remains available for anyone who needs the genuine listing.

## Source and parody notice

Original listing: https://www.vrbo.com/en-ca/cottage-rental/p1229286vb

This is a private-friends joke rendered as a shareable page, not an actual rental listing or review of the property or its hosts. The page includes visible parody identification and deliberately altered photos. Nearby travel estimates are reproduced from the source listing and are not live routes.
