import { db } from '../client'
import {
  CamerasTable,
  type NewCamera,
  type NewRoll,
  type NewRollPhoto,
  RollPhotosTable,
  RollsTable,
} from '../schema'

export const insertCamera = async (camera: NewCamera) => {
  return db.insert(CamerasTable).values(camera)
}

export const insertRoll = async (roll: NewRoll) => {
  return db.insert(RollsTable).values(roll)
}

export const insertRollPhoto = async (photo: NewRollPhoto) => {
  return db.insert(RollPhotosTable).values(photo)
}
