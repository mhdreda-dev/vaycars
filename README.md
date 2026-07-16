# Vay Cars Location

## Neon and Prisma setup

This project uses Neon PostgreSQL through Prisma ORM. Copy `.env.example` to
an untracked local environment file, then add the two connection strings:

```env
# Runtime: Neon pooled endpoint (the hostname normally includes `-pooler`).
DATABASE_URL=""

# Prisma CLI: Neon direct, non-pooled endpoint for migrations and seeds.
DIRECT_URL=""
```

`DATABASE_URL` is used by the Next.js server through the pooled Neon
connection. `DIRECT_URL` is used by Prisma CLI through the direct Neon
connection, including migrations and the seed. Never commit real connection
strings or any other secrets to Git.

After configuring the environment, run:

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate -- --name init_admin_data
npm run prisma:seed
```

`prisma.config.ts` uses the current Prisma configuration format. The generated
client is written to `src/generated/prisma` and is intentionally ignored by Git.

## Seed mapping

The seed imports the 11 legacy records from `prisma/seed-data/legacy-vehicles.ts` idempotently
by vehicle slug. It also creates the five initial categories, Sidi Kacem pickup
location, singleton site settings, and one main image per vehicle.

The current static vehicle source contains remote Unsplash image URLs rather
than local public paths for the individual cars. The seed preserves those exact
existing URLs; it does not invent local paths or upload assets. When local car
assets are added in a later approved step, their public paths can replace these
records through the same idempotent image upsert.

Current values map as follows:

- `Disponible` becomes `AVAILABLE`; `Sur demande` becomes `UNAVAILABLE` because
  no current static state denotes a reservation or maintenance.
- French data is copied directly. Arabic descriptions and badges are supplied
  explicitly in the seed because the existing static source has no Arabic
  vehicle fields.
- No numeric price is persisted. Only localized price-note text is stored.

The approved public design is unchanged; public vehicle data is now read from
Neon through the server-only Prisma query layer.

## Public database rendering

The public vehicle routes now query Prisma at request time, so vehicles created
by a future admin flow can appear without a new deployment. `React.cache()` in
the server-only query layer deduplicates identical reads within a request; the
exported query functions are the single place to add `revalidateTag` support
when admin mutations are introduced. Vehicle pages intentionally do not use
`generateStaticParams`, so database slugs added after deployment remain routable.

## Administrator authentication

Only administrator accounts can authenticate at `/admin/login`; there is no
public registration or customer login. Auth.js credentials sessions use
`AUTH_SECRET`, and passwords are stored only as bcrypt hashes in `AdminUser`.

Set these uncommitted values before creating the first administrator:

```env
AUTH_SECRET="a-long-random-secret"
ADMIN_EMAIL="owner@example.com"
ADMIN_PASSWORD="a-unique-password-of-at-least-12-characters"
```

Then run `npm run admin:create`. The command upserts the named administrator
and hashes the password with bcrypt; it never logs the password. Protected
`/admin` routes verify both the signed session and that the matching database
administrator remains active.

## Vehicle image uploads

Vehicle images can be uploaded by an authenticated administrator from the
vehicle create/edit form. Configure an uncommitted Vercel Blob token locally
and in the deployment environment:

```env
BLOB_READ_WRITE_TOKEN=""
```

The upload token endpoint is protected by the existing administrator session.
It accepts JPEG, PNG, and WebP images up to 8 MB and only grants writes
below the `vehicles/` Blob prefix. Uploaded public Blob URLs are saved to
`VehicleImage` only when the vehicle form is saved. Existing local and HTTPS
URLs remain supported. Never commit the Blob token.

## Public language preference

On a visitor's first public visit, the site asks them to choose French or
Arabic. The preference is saved in both `localStorage` and the `vaycars-locale`
cookie (one year, `Path=/`, `SameSite=Lax`), then reused by the language menu.
To test the first-visit experience again in the browser console, run:

```js
localStorage.removeItem("vaycars-locale");
document.cookie = "vaycars-locale=; Max-Age=0; Path=/";
location.reload();
```
