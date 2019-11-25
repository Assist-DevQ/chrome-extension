import * as React from 'react'
import { Button, ButtonProps, Dropdown, Grid, DropdownItemProps, DropdownProps } from 'semantic-ui-react'
import { IMessage, MessageType } from '../../types/chrome/message/message'
import { ClientType } from '../../types/chrome/message/client-types'
import { IRecordProps, IRecordState } from './types/record'
import { ChromeApi } from '../service/chromeApi'
import { StorageKey } from '../../types/StorageKeys'
import { IScenario } from '../../types/api/scenario'
import { IProject } from '../../types/api/project'

/* tslint:disable-next-line: no-var-requires */
const recordStyles = require('./Record.css')

class Record extends React.Component<IRecordProps, IRecordState> {
  private backPort: chrome.runtime.Port

  constructor(props: IRecordProps) {
    super(props)
    this.state = {
      isRecording: props.isRecording,
      eventsRecorded: 0,
      projects: [],
      scenarios: [],
      selectedProjectId: props.projectId,
      selectedScenarioId: props.scenarioId
    }
    // This binding is necessary to make `this` work in the callback
    this.toggleRecordingState = this.toggleRecordingState.bind(this)
    this.record = this.record.bind(this)
    this.recording = this.recording.bind(this)
    this.backPort = chrome.runtime.connect({ name: ClientType.Popup })
    this.backPort.onMessage.addListener(this.onBackMessage.bind(this))
    this.fetchProjects()
    if (this.state.selectedProjectId) { this.fetchScenarios(this.state.selectedProjectId)}
  }

  public async toggleRecordingState(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): Promise<void> {
    try {
      await ChromeApi.setStoreKey(StorageKey.IsRecording, !this.state.isRecording)
      const tabId = await ChromeApi.getCurrentTabId()
      chrome.tabs.sendMessage(tabId, { record: !this.state.isRecording, scenarioId: this.state.selectedScenarioId })
      this.setState((state: IRecordState) => ({
        ...state,
        isRecording: !state.isRecording
      }))
    } catch (e) {
      console.error(e.message)
    }
  }

  public selectProject = (e: any, p: DropdownProps): void => {
    const pId = p.value as number
    this.setState((prev: IRecordState) => ({
      ...prev,
      selectedProjectId: pId
    }))
    ChromeApi.setStoreKey(StorageKey.ProjectId, pId)
    this.fetchScenarios(pId)
  }

  public selectScenario = (e: any, s: DropdownProps): void => {
    const sId = s.value as number
    this.setState((prev: IRecordState) => ({
      ...prev,
      selectedScenario: sId
    }))
    ChromeApi.setStoreKey(StorageKey.ScenarioId, sId)
  }

  public record() {
    return (
      <Button color="green" onClick={this.toggleRecordingState}>
        Record
      </Button>
    )
  }

  public recording() {
    return (
      <Button color="red" onClick={this.toggleRecordingState}>
        Stop recording
      </Button>
    )
  }

  get projectDrop(): DropdownItemProps[] {
    const {projects} = this.state
    return projects ? projects.map((p: IProject) => ({key: p.id, text: p.name, value: p.id})) : []
  }

  get scenarioDrop(): DropdownItemProps[] {
    const {scenarios} = this.state
    return scenarios ? scenarios.map((s: IScenario) => ({key: s.id, text: s.name, value: s.id})) : []
  }

  public render() {
    const button = this.state.isRecording ? <this.recording /> : <this.record />
    return (
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column>
            <Dropdown
              placeholder="Project"
              search
              compact
              selection
              options={this.projectDrop}
              onChange={this.selectProject}
              value={this.state.selectedProjectId}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Dropdown
              placeholder="Scenario"
              search
              compact
              selection
              options={this.scenarioDrop}
              onChange={this.selectScenario}
              value={this.state.selectedScenarioId}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>{button}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column className={recordStyles.eventsContainer}>
            <i className="fas fa-file-code fa-2x" />
            <span className={recordStyles.events}>
              {this.state.eventsRecorded}
            </span>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  private async fetchProjects(): Promise<void> {
    const projects = await this.props.api.getProjects()
    this.setState((prev: IRecordState) => ({
      ...prev,
      projects
    })
    )
  }

  private async fetchScenarios(projectId: number): Promise<void> {
    const scenarios = await this.props.api.getScenarios(projectId)
    this.setState((prev: IRecordState) => ({
      ...prev,
      scenarios
    }))
  }

  private onBackMessage(message: any, _: any) {
    const msg: IMessage<number> = message
    switch (msg.type) {
      case MessageType.UpdateCount:
        this.setState((state: any) => {
          return {
            ...state,
            eventsRecorded: msg.payload
          }
        })
        break
    }
  }
}

export default Record
