export type PartialWithRequiredKeys<T, K extends keyof T> = Partial<T> &
  Pick<T, K>

export const RollStatus = {
  IN_CAMERA: 'IN_CAMERA',
  EXPOSING: 'EXPOSING',
  EXPOSED: 'EXPOSED',
  DEVELOPED: 'DEVELOPED',
  ARCHIVED: 'ARCHIVED',
} as const

export type RollStatusType = (typeof RollStatus)[keyof typeof RollStatus]

export const ROLL_STATUS_LABELS: Record<RollStatusType, string> = {
  IN_CAMERA: 'In Camera',
  EXPOSING: 'Exposing',
  EXPOSED: 'Exposed',
  DEVELOPED: 'Developed',
  ARCHIVED: 'Archived',
}

export type URLParams = {
  'add-roll': { cameraId: string }
  'edit-roll': { rollId: string }
  'edit-camera': { cameraId: string }
  'roll-detail': { rollId: string }
}

export type Camera = {
  id: string
  name: string
  notes: string | null
  createdAt: string
  updatedAt: string | null
  sortOrder: number
}

export type Roll = {
  id: string
  cameraId: string
  filmStock: string
  status: RollStatusType
  frameCount: number
  framesShot: number | null
  notes: string | null
  createdAt: string
  updatedAt: string | null
  startedAt: string | null
  developedAt: string | null
}

export type RollPhoto = {
  id: string
  rollId: string
  uri: string
  createdAt: string
  sortOrder: number
}
