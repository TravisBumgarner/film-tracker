import { RollStatus } from '@/shared/types'
import { generateId } from '@/shared/utilities'
import { insertCamera, insertRoll } from './queries/insert'
import { selectCameras } from './queries/select'

const SAMPLE_DATA = {
  cameras: [
    {
      name: 'Leica M6',
      rolls: [
        {
          filmStock: 'Kodak Portra 400',
          status: RollStatus.EXPOSING,
          frameCount: 36,
          iso: 400,
          notes: 'Street photography downtown. Looking for interesting light.',
        },
        {
          filmStock: 'Ilford HP5 Plus',
          status: RollStatus.DEVELOPED,
          frameCount: 36,
          iso: 400,
          notes: 'Pushed to 1600 for night shots. Great results!',
        },
        {
          filmStock: 'Kodak Tri-X 400',
          status: RollStatus.ARCHIVED,
          frameCount: 36,
          iso: 400,
          notes: 'Classic black and white from the trip to NYC.',
        },
      ],
    },
    {
      name: 'Nikon F3',
      rolls: [
        {
          filmStock: 'Kodak Ektar 100',
          status: RollStatus.EXPOSED,
          frameCount: 36,
          iso: 100,
          notes: 'Landscape shots from the coast. Need to develop soon.',
        },
        {
          filmStock: 'Fujifilm Superia 400',
          status: RollStatus.EXPOSING,
          frameCount: 24,
          iso: 400,
          notes: 'Everyday carry roll.',
        },
        {
          filmStock: 'CineStill 800T',
          status: RollStatus.DEVELOPED,
          frameCount: 36,
          iso: 800,
          notes: 'Night city shots with the halation effect. Love it!',
        },
      ],
    },
    {
      name: 'Pentax K1000',
      rolls: [
        {
          filmStock: 'Kodak Gold 200',
          status: RollStatus.EXPOSING,
          frameCount: 36,
          iso: 200,
          notes: 'Teaching my daughter photography with this one.',
        },
        {
          filmStock: 'Ilford Delta 3200',
          status: RollStatus.EXPOSED,
          frameCount: 36,
          iso: 3200,
          notes: 'Concert photography. Very grainy but atmospheric.',
        },
      ],
    },
  ],
}

export const seedDatabase = async () => {
  // Check if database already has data
  const existingCameras = await selectCameras()
  if (existingCameras.length > 0) {
    return // Already seeded
  }

  const now = new Date()

  for (const cameraData of SAMPLE_DATA.cameras) {
    const cameraId = generateId()
    await insertCamera({
      id: cameraId,
      name: cameraData.name,
      notes: null,
      createdAt: now.toISOString(),
      sortOrder: 0,
    })

    for (let i = 0; i < cameraData.rolls.length; i++) {
      const rollData = cameraData.rolls[i]
      const rollDate = new Date(now.getTime() - i * 86400000 * 7) // Each roll 1 week apart
      await insertRoll({
        id: generateId(),
        cameraId,
        filmStock: rollData.filmStock,
        status: rollData.status,
        frameCount: rollData.frameCount,
        iso: rollData.iso,
        notes: rollData.notes,
        createdAt: rollDate.toISOString(),
        updatedAt: rollDate.toISOString(),
        exposingAt:
          rollData.status === RollStatus.EXPOSING
            ? rollDate.toISOString()
            : null,
        exposedAt:
          rollData.status === RollStatus.EXPOSED ||
          rollData.status === RollStatus.DEVELOPED ||
          rollData.status === RollStatus.ARCHIVED
            ? rollDate.toISOString()
            : null,
        developedAt:
          rollData.status === RollStatus.DEVELOPED ||
          rollData.status === RollStatus.ARCHIVED
            ? rollDate.toISOString()
            : null,
        archivedAt:
          rollData.status === RollStatus.ARCHIVED
            ? rollDate.toISOString()
            : null,
      })
    }
  }
}
