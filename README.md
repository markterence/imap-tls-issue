# imap-tls-issue

## Setup 

Create a `.env`. Copy the `.env.example` and fill in the values.

For `MAIL_SERVER_HOST` try to use the Internal IP of the mail server, the domain name or the public IP for testing.

## Run

```bash
docker compose up -d

docker compose exec app sh

## Inside the container
node index.js
```
