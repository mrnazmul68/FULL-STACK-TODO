import { asyncHandler } from './../../../utils/asyncHandler.js';

export const register = asyncHandler(async(req, res)=>{
    const {name, email, password} = req.body
})