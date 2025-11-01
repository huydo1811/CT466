import Actor from '../models/Actor.js'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'

const uploadsDir = path.join(process.cwd(), 'uploads', 'actors')

const _deleteFileIfLocal = (photoUrl) => {
  if (!photoUrl) return
  try {
    const segment = '/uploads/actors/'
    const idx = photoUrl.indexOf(segment)
    if (idx === -1) return
    const filename = photoUrl.slice(idx + segment.length)
    const fp = path.join(uploadsDir, filename)
    if (fs.existsSync(fp)) fs.unlinkSync(fp)
  } catch (err) {
    console.warn('delete actor photo error', err)
  }
}

const getAllActors = async ({ page = 1, limit = 20, search, isActive } = {}) => {
  const p = Math.max(1, parseInt(page, 10) || 1)
  const l = Math.max(1, parseInt(limit, 10) || 20)
  const filter = {}
  if (typeof isActive === 'boolean') filter.isActive = isActive
  if (search) {
    const re = new RegExp(search, 'i')
    filter.$or = [{ name: re }, { nationality: re }]
  }

  const totalItems = await Actor.countDocuments(filter)
  const actors = await Actor.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean()
  const pagination = { page: p, limit: l, totalItems, totalPages: Math.max(1, Math.ceil(totalItems / l)) }
  return { actors, pagination }
}

const createActor = async (data) => {
  // allow duplicate names: do not enforce uniqueness here
  const actor = await Actor.create(data)
  return actor
}

const updateActor = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('ID không hợp lệ')
  const existing = await Actor.findById(id).lean()
  if (!existing) throw new Error('Không tìm thấy diễn viên')

  // delete old local photo if replaced
  if (updateData.photoUrl && existing.photoUrl && updateData.photoUrl !== existing.photoUrl) {
    _deleteFileIfLocal(existing.photoUrl)
  }

  const updated = await Actor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
  if (!updated) throw new Error('Cập nhật thất bại')
  return updated
}

const deleteActor = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('ID không hợp lệ')
  const existing = await Actor.findByIdAndDelete(id)
  if (!existing) throw new Error('Không tìm thấy diễn viên')
  if (existing.photoUrl) _deleteFileIfLocal(existing.photoUrl)
  return true
}

export default {
  getAllActors,
  createActor,
  updateActor,
  deleteActor
}