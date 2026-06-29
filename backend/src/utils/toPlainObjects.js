export const toPlainObjects = (doc) => {
  if (!doc) return null;
  let obj;
  if (typeof doc.toObject === "function") {
    obj = doc.toObject();
  } else {
    obj = { ...doc };
  }
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  if (obj.__v !== undefined) {
    delete obj.__v;
  }
  return obj;
};
