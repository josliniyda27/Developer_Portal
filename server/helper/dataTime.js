const dateTime = () => {
  const minutesToAdd = 3;
  const currentDate = new Date();
  const expiresAt = new Date(currentDate.getTime() + minutesToAdd * 60000);
  return expiresAt;
};

module.exports = dateTime ;
