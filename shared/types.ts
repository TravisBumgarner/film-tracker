export enum Phase {
  Exposing = 'Exposing',
  Exposed = 'Exposed',
  Developed = 'Developed',
  Archived = 'Archived',
  Abandoned = 'Abandoned',
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
  removedFromCameraAt: string | null
}

export type URLParams = {
  'edit-roll': { rollId: string }
  'edit-note': { noteId: string; rollId: string }
}

export type PartialWithRequiredKeys<T, K extends keyof T> = Partial<T> & Pick<T, K>
