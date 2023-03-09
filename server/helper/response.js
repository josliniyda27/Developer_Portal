const response = (res, statusCode, message, data, extraParam) => {
  res.status(statusCode || 404).json({
    message: message || "something went wrong",
    status: statusCode || 404,
    data: data || {},
    extraParam,
  });
};

module.exports = response;
