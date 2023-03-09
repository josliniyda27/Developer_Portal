const db = require("../../model");
const {
  sequelize: Sequelize,
  projectAddressDetail: ProjectAddressDetail,
  project: Project,
  states: States,
  pincode: Pincode,
  cities: City,
  area: Area,
  taluka: Taluka,
  district: District,
} = db;
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

const { Op } = require("sequelize");

exports.addressDetail = async (req, res) => {
  let addressDetails = req.body;
  let returnStatement = false;

  await ProjectAddressDetail.findAll({
    where: { project_id: addressDetails.project_id },
  }).then((data) => {
    if (data.length > 0 && !addressDetails.id) {
      returnStatement = true;
    }
  });

  // check if address id is already
  if (returnStatement)
    return responseHelper(
      res,
      constants.statusCode.forbidden,
      "Please provide project address id,Project address already added"
    );

  let transaction;
  if (!addressDetails.id) {
    //create new address
    try {
      //transaction start
      transaction = await Sequelize.transaction();

      await ProjectAddressDetail.create(addressDetails, { transaction }).then(
        (data) => {
          let message = constants.messages.ProjectAddressSave;
        }
      );

      //update project table for step completed
      await Project.update(
        { completed_step: 5 },
        {
          where: {
            id: addressDetails.project_id,
            completed_step: {
              [Op.lt]: 5,
            },
          },
        },
        { transaction }
      ).then((data) => {});

      await transaction.commit();

      let projectData = "";
      let addressData = "";
      let finaldataJson = {};

      //find all project data by project id
      await Project.findAll({
        where: { id: addressDetails.project_id },
      }).then((data) => {
        projectData = data;
      });

      // find all address data by project id
      await ProjectAddressDetail.findAll({
        where: { project_id: addressDetails.project_id },
      })
        .then((data1) => {
          addressData = data1;
        })
        .catch((err) => {
          return;
        });

      //spread all the data to send to client
      if (projectData.length > 0) {
        let ProjectAddressData = { ProjectAddress: addressData };
        finaldataJson = { ...projectData[0].dataValues, ...ProjectAddressData };
      }

      return responseHelper(
        res,
        constants.statusCode.successCode,
        constants.messages.ProjectAddressSave,
        finaldataJson
      );
    } catch (error) {
      console.log(error);
      const catchErrmsg2 = await sequelizeError(error);
      console.log("catchErrmsg2==>",catchErrmsg2);
      await transaction.rollback();
      return responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
    }
  } else {
    try {
      //transaction start
      transaction = await Sequelize.transaction();

      await ProjectAddressDetail.update(
        addressDetails,
        { where: { id: addressDetails.id } },
        { transaction }
      ).then((data) => {
        let message = constants.messages.ProjectAddressUpdate;
      });

      await transaction.commit();
      let projectData = "";
      let addressData = "";
      let finaldataJson = {};

      //find all project data by project id
      await Project.findAll({
        where: { id: addressDetails.project_id },
      }).then((data1) => {
        projectData = data1;
      });

      // find all address data by project id
      await ProjectAddressDetail.findAll({
        where: { project_id: addressDetails.project_id },
      }).then((data1) => {
        addressData = data1;
      });

      //spread all the data to send to client
      let ProjectAddressData = { ProjectAddress: addressData };
      finaldataJson = { ...projectData[0].dataValues, ...ProjectAddressData };

      return responseHelper(
        res,
        constants.statusCode.successCode,
        constants.messages.ProjectAddressUpdate,
        finaldataJson
      );
    } catch (error) {
      console.log("log");
      const catchErrmsg2 = await sequelizeError(error);
      await transaction.rollback();
      return responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
    }
  }
};

//get all addresses from the database
exports.getAllAddress = async (req, res) => {
  let projectId = req.params.project;
  let finalData = "";
  let message = "";
  //check if project id
  if (!projectId) {
    res.status(403).send({
      message: "Project id missing",
      status: 403,
    });
    return;
  }

  try {
    //find all address data by project id
    await ProjectAddressDetail.findAll({
      where: { project_id: projectId },
      include: [States, Pincode, City, District, Area, Taluka],
    }).then((data1) => {
      //console.log("Category1.data===>", data1);
      finalData = data1;
    });

    return responseHelper(
      res,
      constants.statusCode.successCode,
      message,
      finalData
    );
  } catch (error) {
    console.log("projectInformationErr====>", error.name);
    const catchErrmsg2 = await sequelizeError(error);
    return responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};
