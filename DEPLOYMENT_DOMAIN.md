# Connecting `mothrboard.ai` on Heroku

The app is deployed to Heroku app `motherboard`.

Current Heroku app URL:

- `https://motherboard-773035ad8502.herokuapp.com/`

Heroku custom domains have been added:

- `mothrboard.ai`
- `www.mothrboard.ai`

## DNS Records

At your domain registrar or DNS provider, add these records:

| Host | Type | Value |
| --- | --- | --- |
| `mothrboard.ai` | `ALIAS` or `ANAME` | `cryptic-lion-d1f0hx92el8h3yh1rh0deipg.herokudns.com` |
| `www.mothrboard.ai` | `CNAME` | `functional-melon-96l958i51pazt6187y38kw17.herokudns.com` |

If your DNS provider does not support `ALIAS` or `ANAME` at the root domain, use its equivalent root-domain flattening feature. Cloudflare calls this CNAME flattening.

## HTTPS

Automatic Certificate Management is enabled in Heroku. It will issue certificates after DNS resolves correctly.

## Notes

Changing DNS affects live traffic for the domain. Do not remove existing records unless you know they are not serving another website, email, or verification workflow.
