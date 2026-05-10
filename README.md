# NZ South Island Trip Site

Static travel site for GitHub Pages.

## Local editing workflow

1. Open the site locally.
2. Go to `編輯資料`.
3. Update text, links, maps, and images locally in the browser.
4. Click `匯出 GitHub Pages 資料`.
5. Replace the repo file `trip-data.js` with the downloaded `trip-data.github-pages.js`.
6. Commit and push to `main`.
7. GitHub Pages will redeploy automatically.

## Important note about images

Images you upload in the browser are stored locally first.

To make those images visible on the public GitHub Pages site, you must export the GitHub Pages data file and replace `trip-data.js` before pushing.

## GitHub Pages setup

1. Create a GitHub repository and push this folder.
2. In GitHub repository settings, open `Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main`.
5. Wait for the `Deploy GitHub Pages` workflow to finish.

## Public update workflow

You can absolutely keep editing locally first.

But local edits do not update the public site by themselves.

The public site updates only after you:

1. export the shareable data
2. replace `trip-data.js`
3. commit and push

