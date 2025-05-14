# How to run

## Clone and install dependencies

```bash
git clone https://github.com/qhxiv/gemini-app.git
cd gemini-app
pnpm i
```

## Generate auth secret

```bash
pnpm dlx auth secret
```

## Add some environment variables

```env
AUTH_SECRET= # Your auth secret

API_KEY= # Get your Gemini api key from Google AI Studio

# Feel free to change these
POSTGRES_PASSWORD=123456
POSTGRES_USER=postgres
POSTGRES_DB=ai
POSTGRES_HOST=ai_db

PGADMIN_DEFAULT_EMAIL=user@domain.com
PGADMIN_DEFAULT_PASSWORD=123456
```

## Run the db

```bash
docker compose up -d
```

If you don't wanna use docker, create a postgres db with all of its properties matched with those variables in `.env.local`, and then run the file `db.sql` to create tables

## Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
