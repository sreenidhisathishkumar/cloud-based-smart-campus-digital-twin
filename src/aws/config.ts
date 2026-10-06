/**
 * AWS integration placeholders.
 * Sprint 1 uses the local repository only. Do not put secrets here.
 * Values will come from environment variables during Sprint 5 deployment.
 */
export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION ?? '',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  s3MediaBucket: import.meta.env.VITE_S3_MEDIA_BUCKET ?? '',
  cloudFrontDomain: import.meta.env.VITE_CLOUDFRONT_DOMAIN ?? '',
  dynamoTables: {
    buildings: import.meta.env.VITE_DDB_BUILDINGS_TABLE ?? '',
    facilities: import.meta.env.VITE_DDB_FACILITIES_TABLE ?? '',
    issues: import.meta.env.VITE_DDB_ISSUES_TABLE ?? '',
    events: import.meta.env.VITE_DDB_EVENTS_TABLE ?? '',
  },
}

export function isAwsConfigured(): boolean {
  return Boolean(awsConfig.apiBaseUrl && awsConfig.region)
}
