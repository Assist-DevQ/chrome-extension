import { APIConfig } from './apiConf'
import axios, { AxiosInstance } from 'axios'
import { IProject } from '../types/api/project'

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
    return (await this.http.get<IProject[]>(this.conf.api.project)).data
  }
}
