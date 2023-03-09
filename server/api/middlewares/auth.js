import * as jwt from "jsonwebtoken";
const config = require("../middlewares/auth.config");
const { constants } = require("../../helper");
const db = require("../model");
const { 
  users: User,
  roles: Role,
  permissions: Permission,
} = db;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(constants.statusCode.forbidden).send({
      message: "Unauthorized! Session was expired!",
      status: constants.statusCode.forbidden,
      tokenExpired: true,
    });
  }

  return res
    .status(constants.statusCode.forbidden)
    .send({ message: "Unauthorized user!", status: 403 });
};

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!", status: 403 });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }

    req.userId = decoded.userId;
    next();
  });
};

const generateToken = (userId) => {
  let data = {
    time: Date(),
    userId: userId,
  };
  const token = jwt.sign(data, config.secret, {
    expiresIn: config.jwtExpiration,
  });
  return token;
};

const verifyOtpToken = async (req, res, next) => {
  let otpToken = req.headers["otp-access-token"];

  if (!otpToken) {
    return res
      .status(403)
      .send({ message: constants.messages.otpTokenNotProvided });
  }

  await User.findOne({
    where: { otp_token: otpToken },
  })
    .then(async (userData) => {
      if (userData) {
        next();
      } else {
        return res
          .status(401)
          .send({ message: constants.messages.otpTokenExpired });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: constants.messages.otpInvalid,
        data: constants.statusCode.notFound,
      });
    });
};

const verifyStaticToken = async (req, res, next) => {
  let apiToken = req.headers["api-token"];

  if (!apiToken) {
    return res.status(403).send({
      message: constants.messages.staticTokenNotProvided,
      status: 403,
    });
  }

  if (apiToken != constants.staticToken) {
    return res
      .status(403)
      .send({ message: constants.messages.staticTokenNotValid, status: 403 });
  }
  next();
};

const verifyRoutePermissions = (permission) => {
  return async (req, res, next) => {

  // const id = req.userId;

  // const user = await User.findAll({
  //   where: {
  //     id : id,
  //     '$role.permissions.name$': permission
  //   },
  //   include: [
  //     {
  //         model: Role,
  //         required:true,
  //         include: [
  //           {
  //               model: Permission,
  //               required:true,
  //           }
  //         ] 
  //     }
  //   ]      
  // });

  // if (user.length < 1) {
  //   return res.status(403).send({
  //     message: constants.messages.userHasNoPermission,
  //     status: 403,
  //   });
  // }

  next();

  }
}


// function verifyRoutePermissions(permission) {

//   return function(req, res, next) {
//     verifyUserRolePermission(permission, req, res, next);   
//     next();
//   }
// }

// function verifyUserRolePermission(permission, req, res, next){

//   console.log('--------------------------------------------->entered---------------->')

//   const id = req.userId;

//   User.findByPk(id, {
//     include: [
//       {
//           model: Role,
//           include: [
//             {
//                 model: Permission,
//                 where: {
//                   name: permission,
//                 }
//             }
//           ] 
//       }
//     ]      
//   }).then(async (data) => {
//     if (data) {
//       return next();
//     } else {
//       return res.status(constants.statusCode.forbidden).send({
//         status: constants.statusCode.forbidden,
//         message: constants.messages.userHasNoPermission,
//       });
//     }
//   })
// }

// function sendForbidden(res)
// {
//   return res.status(constants.statusCode.forbidden).send({
//     status: constants.statusCode.forbidden,
//     message: constants.messages.userHasNoPermission,
//   });

// }


exports.verifyToken = verifyToken;
exports.generateToken = generateToken;
exports.verifyOtpToken = verifyOtpToken;
exports.verifyStaticToken = verifyStaticToken;
exports.verifyRoutePermissions = verifyRoutePermissions;
