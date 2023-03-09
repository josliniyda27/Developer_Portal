const db = require("../../model");
const config = require("../../middlewares/auth.config");
const { users: User, refreshToken: RefreshToken } = db;
const { constants } = require("../../../helper");

const jwt = require("jsonwebtoken");
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(st).json({
      message: "Please contact support team",
      status: 403,
      data: { message: "Refresh Token is required!" },
    });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });
    if (!refreshToken) {
      res.status(403).json({
        message: "Please contact support team",
        status: 403,
        data: { message: "Refresh Token not in database!" },
      });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Session was expired. Please make a new signin request",
        status: 403,
      });
      return;
    }else{
      console.log("refreshToken=======>",refreshToken.dataValues.userId)
    }

    let newAccessToken = jwt.sign({ id: refreshToken.dataValues.userId }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// Create and Save a new User
exports.create = (req, res) => {
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!",
      status: 403,
    });
    return;
  }

  const userDetails = {
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile,
  };

  // Save user in the database
  User.create(userDetails)
    .then((data) => {
      res.send({
        message: constants.messages.userCreatedSuccess,
        status: constants.statusCode.successCode,
        data: data,
      });
    })
    .catch((err) => {
      res.status(constants.statusCode.notFound).send({
        message: err.message || constants.statusCode.userCreatedError,
        status: constants.statusCode.notFound,
      });
    });
};

exports.findUser = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find user with id=${id}.`,
          status: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id,
        status: 404,
      });
    });
};
