export const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

export const handleError = (err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : {}
  });
};
