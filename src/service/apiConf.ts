export class APIConfig {
  public baseUrl: string = process.env.API_BASE_URL || ''
  public auth: string = process.env.API_AUTH || ''
  public api: IApiEndpoints = {
    project: '/projects',
    scenario: '/scenarios',
    eventBatch: '/batch/events'
  }
}

export interface IApiEndpoints {
  project: string
  scenario: string
  eventBatch: string
}
