import actorService from '../services/actorService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Lấy tất cả diễn viên
export const getAllActors = asyncHandler(async (req, res) => {
  const { page, limit, search, nationality, isActive } = req.query;
  
  const result = await actorService.getAllActors({
    page,
    limit,
    search,
    nationality,
    isActive
  });

  res.status(200).json({
    success: true,
    message: 'Lấy danh sách diễn viên thành công',
    data: result.actors,
    pagination: result.pagination
  });
});

// Lấy diễn viên theo ID
export const getActorById = asyncHandler(async (req, res) => {
  const actor = await actorService.getActorById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Lấy thông tin diễn viên thành công',
    data: actor
  });
});

// Tạo diễn viên mới
export const createActor = asyncHandler(async (req, res) => {
  const actor = await actorService.createActor(req.body);

  res.status(201).json({
    success: true,
    message: 'Tạo diễn viên thành công',
    data: actor
  });
});

// Cập nhật diễn viên
export const updateActor = asyncHandler(async (req, res) => {
  const actor = await actorService.updateActor(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Cập nhật diễn viên thành công',
    data: actor
  });
});

// Xóa diễn viên (soft delete)
export const deleteActor = asyncHandler(async (req, res) => {
  await actorService.deleteActor(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Xóa diễn viên thành công'
  });
});

// Xóa vĩnh viễn
export const permanentDeleteActor = asyncHandler(async (req, res) => {
  await actorService.permanentDeleteActor(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Xóa vĩnh viễn diễn viên thành công'
  });
});

// Tìm kiếm diễn viên
export const searchActors = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Từ khóa tìm kiếm là bắt buộc'
    });
  }

  const actors = await actorService.searchActors(q);

  res.status(200).json({
    success: true,
    message: 'Tìm kiếm diễn viên thành công',
    data: actors
  });
});

// Lấy diễn viên theo quốc tịch
export const getActorsByNationality = asyncHandler(async (req, res) => {
  const actors = await actorService.getActorsByNationality(req.params.nationality);

  res.status(200).json({
    success: true,
    message: 'Lấy diễn viên theo quốc tịch thành công',
    data: actors
  });
});