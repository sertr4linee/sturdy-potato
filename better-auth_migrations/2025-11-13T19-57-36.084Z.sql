alter table "account" add column "accessTokenExpiresAt" timestamptz;

alter table "account" add column "refreshTokenExpiresAt" timestamptz;

alter table "account" add column "scope" text;