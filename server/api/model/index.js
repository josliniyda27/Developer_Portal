const dbConfig = require("../../common/db.config");

const commonLogs = require("../../common/logger.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: dbConfig.DBPORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },

  logging: console.log,
  logging: function (str) {
    commonLogs.info("dataBaseLog===> " + str);
  },
});

const db = {};

sequelize.authenticate().then(function (errors) {
  //logger.error(errors, "sequelize.authenticate===========>");
});
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.refreshToken = require("../model/refeshTokenModel")(sequelize, Sequelize);
db.designations = require("./designation.migration.js")(sequelize, Sequelize);
db.roles = require("./role.migration.js")(sequelize, Sequelize);
db.permissions = require("./permission.migration.js")(sequelize, Sequelize);
db.users = require("./user.migration.js")(sequelize, Sequelize);
db.userOtps = require("./userOtp.migration.js")(sequelize, Sequelize);
db.states = require("./state.migration.js")(sequelize, Sequelize);
db.cities = require("./city.migration.js")(sequelize, Sequelize);
db.companies = require("./company.migration.js")(sequelize, Sequelize);
db.usercompanies = require("./userCompanies.migration.js")(
  sequelize,
  Sequelize
);
db.userProjects = require("./userProjects.migration.js")(sequelize, Sequelize);
db.companyGroups = require("./companyGroups.migration.js")(
  sequelize,
  Sequelize
);
db.resetPassword = require("./resetPassword.migration.js")(
  sequelize,
  Sequelize
);
db.buildingCategory = require("./buildingCategory.migration.js")(
  sequelize,
  Sequelize
);
db.pincode = require("./pincode.migration.js")(sequelize, Sequelize);
db.district = require("./district.migration.js")(sequelize, Sequelize);
db.area = require("./area.migration.js")(sequelize, Sequelize);
db.taluka = require("./taluka.migration.js")(sequelize, Sequelize);
db.documentType = require("./documentType.migration.js")(sequelize, Sequelize);
db.project = require("./project.migration.js")(sequelize, Sequelize);
db.projectReraDetail = require("./projectReraDetail.migration.js")(
  sequelize,
  Sequelize
);
db.projectBuilding = require("./projectBuilding.migration.js")(
  sequelize,
  Sequelize
);
db.projectBuildingUnit = require("./projectBuildingUnit.migration.js")(
  sequelize,
  Sequelize
);
db.projectBuildingCategory = require("./projectBuildingCategory.migration.js")(
  sequelize,
  Sequelize
);
db.builderAccount = require("./builderAccount.migration.js")(
  sequelize,
  Sequelize
);
db.buildingProgressDetail = require("./buildingProgressDetail.migration.js")(
  sequelize,
  Sequelize
);
db.buildingProgressDetailDocument =
  require("./buildingProgressDetailDocument.migration.js")(
    sequelize,
    Sequelize
  );
db.projectAddressDetail = require("./projectAddressDetail.migration.js")(
  sequelize,
  Sequelize
);
db.projectCompany = require("./projectCompany.migration.js")(
  sequelize,
  Sequelize
);
db.projectDocumentType = require("./projectDocumentType.migration.js")(
  sequelize,
  Sequelize
);
db.projectDocument = require("./projectDocument.migration.js")(
  sequelize,
  Sequelize
);

db.projectPurchaser = require("./projectPurchaser.migration.js")(
  sequelize,
  Sequelize
);

db.disbursementHistory = require("./disbursementHistory.migration.js")(
  sequelize,
  Sequelize
);

db.entity = require("./entity.migration.js")(sequelize, Sequelize);
db.companySupportingMember = require("./companySupportingMember.migration.js")(
  sequelize,
  Sequelize
);
db.companyKeyMember = require("./companyKeyMember.migration.js")(
  sequelize,
  Sequelize
);
db.companyDocument = require("./companyDocument.migration.js")(
  sequelize,
  Sequelize
);
db.query = require("./query.migration.js")(sequelize, Sequelize);
db.queryCommunications = require("./queryCommunications.migration.js")(
  sequelize,
  Sequelize
);
db.query = require("./query.migration.js")(sequelize, Sequelize);
db.queryCommunicationDocuments = require("./queryCommunicationDocuments.migration.js")(
  sequelize,
  Sequelize
);
db.projectPurchaser = require("./projectPurchaser.migration.js")(
  sequelize,
  Sequelize
);
db.projectInventoryHistory = require("./projectInventoryHistory.migration.js")(
  sequelize,
  Sequelize
);
db.projectCoPurchaser = require("./projectCoPurchaser.migration.js")(
  sequelize,
  Sequelize
);
db.projectContact = require("./projectContact.migration.js")(
  sequelize,
  Sequelize
);

db.bank = require("./bank.migration.js")(sequelize, Sequelize);
db.bankAccountType = require("./bankAccountType.migration.js")(sequelize, Sequelize);


//userTbale
db.users.belongsTo(db.designations, {
  foreignKey: "designation_id",
  onDelete: "SET NULL",
});
db.users.belongsTo(db.roles, { foreignKey: "role_id", onDelete: "SET NULL" });
db.users.belongsTo(db.cities, { foreignKey: "city_id", onDelete: "SET NULL" });
db.users.belongsTo(db.users, {
  foreignKey: "created_by",
  onDelete: "SET NULL",
  as: "createdBy",
});

//roleAndPermission
db.permissions.belongsToMany(db.roles, { through: "role_permissions" });
db.roles.belongsToMany(db.permissions, { through: "role_permissions" });
db.userOtps.belongsTo(db.users, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

//companies
db.companies.belongsTo(db.cities, {
  foreignKey: "city_id",
  onDelete: "SET NULL",
});
db.companies.belongsTo(db.states, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});
db.companies.belongsTo(db.entity, {
  foreignKey: "entity_id",
  onDelete: "SET NULL",
});
db.companies.belongsTo(db.pincode, {
  foreignKey: "pincode_id",
  onDelete: "SET NULL",
});

db.companies.belongsTo(db.users, {
  foreignKey: "created_by",
  onDelete: "SET NULL",
  as: "companiesUsers",
});

//userOtp
db.userOtps.belongsTo(db.users, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});
db.users.hasMany(db.usercompanies, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
  as: "userCompanies",
});

//userCompanies------need to check

db.usercompanies.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "companiUsers",
});
db.usercompanies.belongsTo(db.companies, { foreignKey: "company_id" });
db.usercompanies.belongsTo(db.users, { foreignKey: "assigned_by" });
db.users.belongsToMany(db.companies, {
  through: "user_companies",
  unique: false,
  foreignKey: "user_id",
});
db.companies.belongsToMany(db.users, {
  through: "user_companies",
  unique: false,
  foreignKey: "company_id",
});

//userPrpjects
db.users.hasMany(db.userProjects, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
  as: "userProjects",
});
db.project.hasMany(db.userProjects, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "projectUserDetails",
});
db.userProjects.belongsTo(db.project, { foreignKey: "project_id" });
db.userProjects.belongsTo(db.users, {
  foreignKey: "assigned_by",
  as: "UserProjectAssignedDetails",
});
db.userProjects.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "UserProjectDetails",
});
db.users.belongsToMany(db.project, {
  through: "user_projects",
  unique: false,
  foreignKey: "user_id",
});
db.project.belongsToMany(db.users, {
  through: "user_projects",
  unique: false,
  foreignKey: "project_id",
});

//groupComapnies
db.companies.hasMany(db.companyGroups, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
  as: "companyGroups",
});
db.companyGroups.belongsTo(db.companies, {
  foreignKey: "company_id",
  as: "groupCompanies",
});
db.companyGroups.belongsTo(db.companies, {
  foreignKey: "parent_id",
  as: "adminGroupCompanies",
});

//resetPassword
db.resetPassword.belongsTo(db.users, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

//locationData
db.pincode.belongsTo(db.states, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});
db.district.belongsTo(db.states, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});
db.cities.belongsTo(db.district, {
  foreignKey: "district_id",
  onDelete: "SET NULL",
});
db.area.belongsTo(db.district, {
  foreignKey: "district_id",
  onDelete: "SET NULL",
});
db.taluka.belongsTo(db.district, {
  foreignKey: "district_id",
  onDelete: "SET NULL",
});

//projectAndProjecCategory
db.projectBuildingCategory.belongsTo(db.buildingCategory, {
  foreignKey: "building_category_id",
  onDelete: "SET NULL",
});
db.projectBuildingCategory.belongsTo(db.project, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
});
db.project.hasMany(db.projectBuildingCategory, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "projectCategories",
});
db.project.hasMany(db.projectBuilding, {
  foreignKey: { name: "project_id", allowNull: false },
  onDelete: "CASCADE",
  as: "projectToProjectBuildings",
});

db.projectBuilding.belongsTo(db.project, {
  foreignKey: { name: "project_id", allowNull: false },
  onDelete: "CASCADE",
  as: "projectBuildingsToProject",
});
db.projectBuildingUnit.belongsTo(db.project, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
});
db.projectBuildingUnit.belongsTo(db.projectBuilding, {
  foreignKey: "project_building_id",
  onDelete: "SET NULL",
});
db.buildingProgressDetail.belongsTo(db.projectBuilding, {
  foreignKey: {
    name: "project_building_id",
    allowNull: false,
    validate: {
      notNull: {
        msg: "Project building id cannot be null.",
      },
      notEmpty: {
        msg: "Project building id cannot be empty.",
      },
    },
  },
  onDelete: "SET NULL",
});
db.projectBuilding.hasMany(db.buildingProgressDetail, {
  foreignKey: {
    name: "project_building_id",
    allowNull: false,
    validate: {
      notNull: {
        msg: "Project building id cannot be null.",
      },
      notEmpty: {
        msg: "Project building id cannot be empty.",
      },
    },
  },
  onDelete: "SET NULL",
  as: "projectBuildingProgressDetail",
});

db.project.hasMany(db.projectBuilding, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "projectBuildingProgressDetail",
});

db.projectBuilding.hasMany(db.buildingProgressDetailDocument, {
  foreignKey: {
    name: "project_building_id",
    allowNull: false,
    validate: {
      notNull: {
        msg: "Project building id cannot be null.",
      },
      notEmpty: {
        msg: "Project building id cannot be empty.",
      },
    },
  },
  onDelete: "SET NULL",
  as: "projectBuildingProgressDetailDocument",
});
db.buildingProgressDetail.belongsTo(db.users, {
  foreignKey: "added_by",
  onDelete: "SET NULL",
});
db.buildingProgressDetailDocument.belongsTo(db.buildingProgressDetail, {
  foreignKey: "building_progress_detail_id",
  onDelete: "SET NULL",
});
db.buildingProgressDetailDocument.belongsTo(db.users, {
  foreignKey: "uploaded_by",
  onDelete: "SET NULL",
});
db.builderAccount.belongsTo(db.companies, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
});
db.builderAccount.belongsTo(db.users, {
  foreignKey: "Added_by",
  onDelete: "SET NULL",
});
db.project.hasMany(db.projectCompany, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "projectCompany",
});
db.companies.hasMany(db.projectCompany, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
  as: "companyProjects",
});

db.project.belongsToMany(db.companies, {
  through: db.projectCompany,
  unique: false,
  foreignKey: "project_id",
});
db.companies.belongsToMany(db.project, {
  through: db.projectCompany,
  unique: false,
  foreignKey: "company_id",
});

db.project.belongsTo(db.users, {
  foreignKey: "created_by",
  onDelete: "SET NULL",
});
db.project.belongsTo(db.users, { foreignKey: "user_id", onDelete: "SET NULL" });

//projectAddress-----need to check
db.project.hasOne(db.projectAddressDetail, {
  foreignKey: "project_id",
  allowNull: false,
  onDelete: "SET NULL",
});
db.projectAddressDetail.belongsTo(db.pincode, {
  foreignKey: "pincode_id",
  allowNull: false,
  onDelete: "SET NULL",
});
db.projectAddressDetail.belongsTo(db.states, {
  foreignKey: "state_id",
  allowNull: false,
  onDelete: "SET NULL",
});
db.projectAddressDetail.belongsTo(db.cities, {
  foreignKey: "city_id",
  allowNull: false,
  onDelete: "SET NULL",
});
db.projectAddressDetail.belongsTo(db.district, {
  foreignKey: "district_id",
  onDelete: "SET NULL",
});
db.projectAddressDetail.belongsTo(db.area, {
  foreignKey: "area_id",
  onDelete: "SET NULL",
});
db.projectAddressDetail.belongsTo(db.taluka, {
  foreignKey: "taluka_id",
  onDelete: "SET NULL",
});

//projectCompany
db.projectCompany.belongsTo(db.project, { foreignKey: "project_id" });
db.projectCompany.belongsTo(db.companies, { foreignKey: "company_id" });

//projectDocument
db.projectDocumentType.belongsTo(db.project, { foreignKey: "project_id" });
db.projectDocumentType.belongsTo(db.documentType, {
  foreignKey: "document_type_id",
});

db.project.hasMany(db.projectDocument, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "projectDocument",
});
db.projectDocument.belongsTo(db.project, { foreignKey: "project_id" });

db.projectDocument.belongsTo(db.documentType, {
  foreignKey: "document_type_id",
});

db.projectPurchaser.belongsTo(db.project, { foreignKey: "project_id" });
db.project.hasMany(db.projectPurchaser, {
  foreignKey: {
    name: "project_id",
    allowNull: false,
    validate: {
      notNull: {
        msg: "Project id cannot be null.",
      },
      notEmpty: {
        msg: "Project id cannot be empty.",
      },
    },
  },
  as: "projectPurchasers",
});
db.projectPurchaser.belongsTo(db.projectBuilding, {
  foreignKey: "project_building_id",
});
db.projectPurchaser.belongsTo(db.users, { foreignKey: "created_by" });

db.disbursementHistory.belongsTo(db.project, { foreignKey: "project_id" });
db.disbursementHistory.belongsTo(db.projectPurchaser, {
  foreignKey: "project_purchaser_id",
});

//companies---need to check
db.companies.hasMany(db.companyDocument, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
});
db.companies.hasMany(db.companyKeyMember, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
});
db.companies.hasMany(db.companySupportingMember, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
});

//companiesDependacy
db.companyKeyMember.belongsTo(db.companies, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
});
db.companySupportingMember.belongsTo(db.companies, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
});

db.companyKeyMember.belongsTo(db.designations, {
  foreignKey: "designation_id",
  onDelete: "SET NULL",
});
db.companySupportingMember.belongsTo(db.designations, {
  foreignKey: "designation_id",
  onDelete: "SET NULL",
});

//query
db.query.belongsTo(db.project, { foreignKey: "project_id" });
db.query.belongsTo(db.companies, { foreignKey: "company_id" });
db.query.belongsTo(db.users, { foreignKey: "user_id" });
db.query.hasMany(db.queryCommunications, {
  foreignKey: "query_id",
  onDelete: "SET NULL",
  as: "queryCommunications",
});
db.queryCommunicationDocuments.belongsTo(db.queryCommunications, {
  foreignKey: "query_communication_id",
});
db.queryCommunications.hasMany(db.queryCommunicationDocuments, {
  foreignKey: "query_communication_id",
  onDelete: "SET NULL",
  as: "queryCommunicationDocuments",
});

//inventory
db.projectInventoryHistory.belongsTo(db.project, { foreignKey: "project_id" });
db.project.hasMany(db.projectInventoryHistory, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "projectInventoryHistories",
});

//builder account
db.builderAccount.belongsTo(db.project, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
});

db.project.hasMany(db.builderAccount, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "builderAccounts",
});

db.projectCoPurchaser.belongsTo(db.projectPurchaser, {
  foreignKey: "project_purchaser_id",
});

db.projectPurchaser.hasMany(db.projectCoPurchaser, {
  foreignKey: "project_purchaser_id",
  onDelete: "SET NULL",
  as: "projectCoPurchasers",
});

db.projectPurchaser.belongsTo(db.builderAccount, {
  foreignKey: "builder_account_id",
  onDelete: "SET NULL",
  //as:"builderAccountPurchase"
});

db.pincode.belongsTo(db.cities, {
  foreignKey: "city_id",
  onDelete: "SET NULL",
});
db.pincode.belongsTo(db.district, {
  foreignKey: "district_id",
  onDelete: "SET NULL",
});
db.cities.belongsTo(db.states, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});
db.taluka.belongsTo(db.states, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});
db.area.belongsTo(db.states, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});
db.area.belongsTo(db.cities, {
  foreignKey: "city_id",
  onDelete: "SET NULL",
});

db.project.hasMany(db.projectContact, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "projectContact",
});

db.projectContact.belongsTo(db.project, { foreignKey: "project_id" });

db.companies.hasMany(db.projectContact, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
  as: "projectContact",
});

db.projectContact.belongsTo(db.companies, { foreignKey: "company_id" });

module.exports = db;
