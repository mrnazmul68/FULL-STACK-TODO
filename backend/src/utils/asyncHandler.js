export const asyncHandler = (reqHandler) => (req, res, next) => {
  //reqHandler(req, res, next) may return:a Promise (if async function ✅)or normal value
  // 👉 Promise.resolve() ensures it's always treated like a Promise.
  Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
};
