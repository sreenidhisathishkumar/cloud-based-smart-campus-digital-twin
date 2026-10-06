/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_S3_MEDIA_BUCKET?: string
  readonly VITE_CLOUDFRONT_DOMAIN?: string
  readonly VITE_DDB_BUILDINGS_TABLE?: string
  readonly VITE_DDB_FACILITIES_TABLE?: string
  readonly VITE_DDB_ISSUES_TABLE?: string
  readonly VITE_DDB_EVENTS_TABLE?: string
  readonly VITE_CLOUDWATCH_LOG_GROUP?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
