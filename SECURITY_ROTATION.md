Credential exposure detected — rotation & cleanup guide

Summary

Recent repository scans detected OAuth client secrets, refresh tokens, and an SMTP password in the repository history and files. These credentials must be rotated immediately and cleaned from git history if they were pushed to any remote.

Immediate steps (rotate now)

1. Google OAuth client
   - Go to Google Cloud Console > APIs & Services > Credentials.
   - Locate the OAuth 2.0 Client ID used by this project.
   - Regenerate the client secret (or create a new client ID).
   - Revoke the exposed refresh token(s) (if possible) and generate a new refresh token following OAuth flow.

2. Gmail account / SMTP password
   - If you used a Gmail account with app password, revoke the app password in Google Account settings.
   - Consider switching to an API-based provider (SendGrid, Resend, Mailgun) or Gmail API OAuth2 with a service account where appropriate.

3. Database credentials (if present in MONGO_URI)
   - Rotate the DB user password in your database hosting (MongoDB Atlas or similar).
   - Update the `MONGO_URI` environment variable on your deployment platform.

Cleanup steps (git history)

If any exposed secret was pushed to a remote, you must remove it from history and force-push. Choose one of the tools below.

A) git-filter-repo (recommended)

1) Install:
   - Windows: follow https://github.com/newren/git-filter-repo
2) Backup your repository (always):
   - git clone --mirror <repo-url> repo-backup
3) Remove the files/strings:
   - git filter-repo --invert-paths --paths backend/credentials.json --force
   - To remove by pattern (e.g., refresh token strings) use a replace:
     git filter-repo --replace-text replacements.txt
     where `replacements.txt` contains lines like:
       literal-refresh-token==>REDACTED
4) Force-push:
   - git push --force --all
   - git push --force --tags
5) Notify collaborators to re-clone (history rewritten).

B) BFG Repo-Cleaner (alternative)

1) Create a list of filenames and run:
   - java -jar bfg.jar --delete-files backend/credentials.json repo.git
   - then:
     cd repo.git
     git reflog expire --expire=now --all && git gc --prune=now --aggressive
     git push --force

Rotation checklist after cleanup

- Replace secrets in your deployments with rotated values stored in environment variables (Render/Heroku/AWS Secrets Manager).
- Remove any committed credential files from the repository and add example files (we added `backend/credentials.example.json`).
- Ensure `.gitignore` contains `backend/credentials.json` and `backend/dist/`.
- Create a runbook (password rotation, deployment update) and rotate credentials for any services that may have had their secrets leaked.

If you want, I can prepare the exact `git filter-repo` replacement file (replacements.txt) using the exact strings we found and a step-by-step script you can run locally (non-destructive preview first). I will not rewrite history without your explicit confirmation.
