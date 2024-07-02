export enum Phase {
  Exposing = 'Exposing',
  Exposed = 'Exposed',
  Developed = 'Developed',
  Archived = 'Archived',
}

export type RollPreviewListItemData = {
  id: string
  roll: string
  createdAt: string
  updatedAt: string | null
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
  'edit-note': { noteId: string; rollId: string }
}

export type PartialWithRequiredKeys<T, K extends keyof T> = Partial<T> & Pick<T, K>
