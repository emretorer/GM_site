# Backend Deploy (Google Cloud Run)

This backend is a standalone Express API. Deploy it as a separate Cloud Run service, then use the service URL as the frontend's `VITE_API_BASE_URL`.

## Required runtime configuration

- `CORS_ORIGIN=https://geniusmethods.co`
- `FIREBASE_SERVICE_ACCOUNT=<service account JSON>`

`FIREBASE_SERVICE_ACCOUNT` should be stored in Secret Manager and exposed to Cloud Run as an environment variable.

## Deploy from source

From the `backend/` directory:

```bash
gcloud run deploy geniusmethods-api \
  --source . \
  --region REGION \
  --allow-unauthenticated \
  --set-env-vars CORS_ORIGIN=https://geniusmethods.co
```

After the first deploy, add `FIREBASE_SERVICE_ACCOUNT` in the Cloud Run service's Variables & Secrets settings, then deploy a new revision.

Cloud Run will return a service URL such as:

```text
https://geniusmethods-api-xxxxx.a.run.app
```

Use that URL as the frontend's `VITE_API_BASE_URL`.

Do not set `VITE_API_BASE_URL` to `https://geniusmethods.co` unless the backend is reverse-proxied under the same domain.
