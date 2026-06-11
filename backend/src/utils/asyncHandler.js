export const asyncHandler = (reqHandler) => async (req, res, next) => {
  try {
    await reqHandler(req, res, next);
  } catch (error) {
    next(error)
  }
};

// export const asyncHandler = (reqHandler) => (req, res, next) => {
//   Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
// };
