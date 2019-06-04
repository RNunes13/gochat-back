
export default function CustomResponse(options) {
  const success = options.success;
  const data = options.data ? options.data : null;
  const error = options.error ? options.error : {};
  const message = options.message ? options.message : '';
  
  if (success) {
    return {
      success,
      message,
      data,
    }
  } else {
    return {
      success,
      error: {
        code: error.code ? error.code : '',
        message: error.message ? error.message : '',
      }
    }
  }
}
