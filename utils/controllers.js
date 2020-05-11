exports.checkForOwner = (user, document) => {
  if (user.role !== "admin" && document.user.toString() !== user.id) {
    return false;
  }
  return true;
};
