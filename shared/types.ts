export type PartialWithRequiredKeys<T, K extends keyof T> = Partial<T> &
  Pick<T, K>

export const RollStatus = {
  EXPOSING: 'EXPOSING',
  EXPOSED: 'EXPOSED',
  DEVELOPED: 'DEVELOPED',
  ARCHIVED: 'ARCHIVED',
  ABANDONED: 'ABANDONED',
} as const

export type RollStatusType = (typeof RollStatus)[keyof typeof RollStatus]

export const ROLL_STATUS_LABELS: Record<RollStatusType, string> = {
  EXPOSING: 'Exposing',
  EXPOSED: 'Exposed',
  DEVELOPED: 'Developed',
  ARCHIVED: 'Archived',
  ABANDONED: 'Abandoned',
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
  iso: number | null
  notes: string | null
  createdAt: string
  updatedAt: string | null
  exposingAt: string | null
  exposedAt: string | null
  developedAt: string | null
  archivedAt: string | null
  abandonedAt: string | null
}

export type RollPhoto = {
  id: string
  rollId: string
  uri: string
  createdAt: string
  sortOrder: number
}
