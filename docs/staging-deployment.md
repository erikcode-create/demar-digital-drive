# Staging Deployment

The staging site is a full website preview deployed separately from production.

## URL

Recommended public preview URL:

```text
https://staging.demartransportation.com
```

## Required Hosting Setup

Create a GreenGeeks/cPanel subdomain for `staging.demartransportation.com` and point its document root at a folder that is not production, for example:

```text
~/staging_public_html
```

## Required GitHub Secret

Add this repository secret:

```text
STAGING_SSH_TARGET_DIR=~/staging_public_html
```

The staging workflow reuses the existing production SSH secrets:

```text
SSH_PRIVATE_KEY
SSH_HOST
SSH_USERNAME
```

## Deploying

Staging deploys from either:

- Pushes to the `staging` branch
- Manual runs of `.github/workflows/deploy-staging.yml`

The workflow builds and prerenders the same way production does, then prepares the built `dist/` folder for staging by:

- Replacing `robots.txt` with `Disallow: /`
- Adding `X-Robots-Tag: noindex, nofollow, noarchive` through `.htaccess`

Those safeguards keep the staging site out of search indexes while still letting us preview the real website.
