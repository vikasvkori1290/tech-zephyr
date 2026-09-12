import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Users retrieved successfully'));
});
