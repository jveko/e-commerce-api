/**
 * @param {Response<ResBody, LocalsObj>} res
 * @param {string} message
 * @param {any} data
 * @param {number} statusCode
 */
const successResponse = (res, { message, data, statusCode = 200 }) => {
  const response = {
    status: "success",
  };
  if (message) response.message = message;
  if (data) response.data = data;
  res.status = statusCode;
  return res.json(response);
};

const failResponse = (h, error) => {
  return h
    .response({
      status: "fail",
      message: error.message,
    })
    .code(error.statusCode);
};

const errorResponse = (h) => {
  return h
    .response({
      status: "error",
      message: "Terjadi kesalahan di sisi server",
    })
    .code(500);
};

module.exports = { successResponse, failResponse, errorResponse };
