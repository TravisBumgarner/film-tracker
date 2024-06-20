export enum Phase {
  Exposing = 'exposing',
  Exposed = 'exposed',
  Developed = 'developed',
  Archived = 'archived',
}

export type RollPreviewListItemData = {
  id: string
  roll: string
  createdAt: string
  updatedAt: string | null
  iso: string
  cameraId: string
  phase: Phase
  cameraModel: string
  notesCount: number
  insertedIntoCameraAt: string
  removedFromCameraAt: string | null
}

export type URLParams = {
  'add-note': { rollId: string }
  'edit-roll': { rollId: string }
}

export type PartialWithRequiredKeys<T, K extends keyof T> = Partial<T> & Pick<T, K>
