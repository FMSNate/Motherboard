# Connecting `mothrboard.ai`

The app is configured for `https://mothrboard.ai` in `render.yaml`.

## Render Setup

1. In Render, create or sync the Blueprint from this GitHub repository.
2. Confirm the web service is named `motherboard-assistant-api`.
3. In the service settings, open **Custom Domains**.
4. Confirm these domains are attached:
   - `mothrboard.ai`
   - `www.mothrboard.ai`
5. Wait for Render to show the DNS target values.

## DNS Setup

At your domain registrar or DNS provider, add the records Render gives you.

Typical Render setup:

- Root domain `mothrboard.ai`: add Render's provided `A` record or ALIAS/ANAME target.
- `www.mothrboard.ai`: add a `CNAME` pointing to the service's `.onrender.com` host.

Render recommends removing conflicting `AAAA` records while configuring DNS because Render custom domains use IPv4 routing.

## Verification

After DNS is saved:

1. Return to Render.
2. Click **Verify** for the custom domain.
3. Wait for TLS certificate issuance.
4. Visit `https://mothrboard.ai`.

## Notes

Changing DNS affects live traffic for the domain. Do not remove any existing records unless you know they are not serving another website, email, or verification workflow.
