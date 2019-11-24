import { APIConfig } from './apiConf'
import axios, { AxiosInstance } from 'axios'
import { IProject, IProjectsResponse } from '../types/api/project'
import { IScenario, IBatchEvents, IScenariosResponse } from '../types/api/scenario'
import { IEventProps } from '../types/EventProps'

export class BackAPI {
  public static getInstance(): BackAPI {
    if (this.underlying) {
      return this.underlying
    }
    this.underlying = new BackAPI(new APIConfig())
    return this.underlying
  }
  private static underlying: BackAPI | undefined

  private readonly conf: APIConfig
  private readonly http: AxiosInstance

  private constructor(apiConf: APIConfig) {
    this.conf = apiConf
    this.http = axios.create({
      baseURL: this.conf.baseUrl,
      timeout: 1000,
      headers: {
        'Authorization': `Basic ${this.conf.auth}`,
        'Content-Type': 'application/json'
      }
    })
  }

  public async getProjects(): Promise<IProject[]> {
    const adminUrl = this.conf.baseUrl.replace('extension', 'admin')
    const res = await this.http.get<IProjectsResponse>(`${adminUrl}${this.conf.api.project}`)
    return res.data.projects
  }

  public async getScenarios(projetcId: number): Promise<IScenario[]> {
    const conf = {
      params: {project_id: projetcId}
    }
    const res = await this.http.get<IScenariosResponse>(this.conf.api.scenario, conf)
    return res.data.scenarios
  }

  public async saveEvents(scenarioId: number, events: IEventProps[]): Promise<boolean> {
    const body: IBatchEvents = {
      scenario_id: scenarioId,
      events
    }
    const res = await this.http.post<IBatchEvents>(this.conf.api.eventBatch, { body })
    return res.status === 200
  }
}
