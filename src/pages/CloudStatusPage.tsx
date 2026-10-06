import { awsConfig, isAwsConfigured } from '../aws/config'
import { recordLocalEvent } from '../aws/cloudwatch'

const checks = [
  ['Region', awsConfig.region],
  ['API Gateway base URL', awsConfig.apiBaseUrl],
  ['S3 media bucket', awsConfig.s3MediaBucket],
  ['CloudFront domain', awsConfig.cloudFrontDomain],
  ['DynamoDB buildings', awsConfig.dynamoTables.buildings],
  ['DynamoDB facilities', awsConfig.dynamoTables.facilities],
  ['DynamoDB issues', awsConfig.dynamoTables.issues],
  ['DynamoDB events', awsConfig.dynamoTables.events],
  ['CloudWatch log group', import.meta.env.VITE_CLOUDWATCH_LOG_GROUP ?? ''],
]

export function CloudStatusPage() {
  return (
    <div className="stack">
      <div>
        <p className="eyebrow">Sprint 5</p>
        <h2>Cloud & monitoring configuration</h2>
        <p className="lede">
          This page reports environment configuration only. AWS is{' '}
          <strong>{isAwsConfigured() ? 'ready to call' : 'not connected'}</strong>. Empty rows mean
          deployment has not been done on this machine.
        </p>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Setting</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {checks.map(([label, value]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{value ? value : 'Not set'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="panel">
        <h3>Local monitoring</h3>
        <p className="muted">
          The button writes a structured log to the browser console. It does not create a CloudWatch
          stream until a backend is deployed.
        </p>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => recordLocalEvent('manual_heartbeat', { ok: true })}
        >
          Write local heartbeat
        </button>
      </section>
    </div>
  )
}
