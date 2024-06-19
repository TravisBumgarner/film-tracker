export enum Phase {
  Exposing = 'exposing',
  Exposed = 'exposed',
  Developed = 'developed',
  Archived = 'archived',
}

export type RollPreviewListItemData = {
  uuid: string
  roll: string
  createdAt: string
  updatedAt: string | null
  iso: number
  cameraId: string
  phase: Phase
  cameraModel: string
  notesCount: number
}
