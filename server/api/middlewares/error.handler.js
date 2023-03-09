// eslint-disable-next-line no-unused-vars, no-shadow
export default function errorHandler(err, req, res, next) {
  console.log("err===>",err);
  const errors = err.errors || [{ message: err.message }];
  let resp = "";
  try {
    if (err.errors.length > 0) {
      let basicerr = err.errors;
      console.log(basicerr, "basicerr");
      resp = {
        status: 403,
        message: basicerr[0].message,
        data: basicerr[0].path,
      };
    } else {
      resp = {
        status: 403,
        message: [{ message: err.message }],
      };
    }
  } catch (error) {
    resp = {
      status: 403,
      message: "Please contact support team",
      data:err
    };
  }

  res.status(err.status || 500).json(resp);
}
