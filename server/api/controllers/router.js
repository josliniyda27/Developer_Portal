import * as express from "express";
import controller from "./user/controller";
import { regController } from "./registration";
import { loginController } from "./login";
import { authController } from "./user";
import passwordResetController from "./passwordReset/controller";
import {
  registrationValidator,
  reraValidator,
  projectValidator,
  userValidator,
  queryValidator,
  purchaserValidator,
} from "../middlewares/validator";

import { uploadFile } from "../middlewares/fileUpload";

import {
  regOtpController,
  resendOtpController,
  loginOtpController,
  resendRegOtpController,
} from "./otpVerification";

import {
  companyController as companyMasterController,
  designationController,
  entityController,
  stateController,
  pincodeController,
  cityController,
  districtController,
  projectCategory,
  documentType,
  cityControllerStateWise,
  areaControllerStateWise,
  talukaControllerStateWise,
  accessLevelController,
  bankMasterController,
  bankAccountTypeMasterController
} from "./master";

import {
  companyController,
  companyMemberController,
  companyListController,
  builderAccountController,
} from "./company";

const auth = require("../middlewares/auth");
import {
  addressController,
  projectOperationController,
  projectInfoController,
  reraOperationController,
  inventoryController,
} from "./project";

import {
  projectDocBulkController,
  projectDocSingleController,
} from "./documents";

import {
  queryListController,
  queryCommunicationController,
} from "./queryManagement";

import { purchaserController } from "./purchaser";

import {
  nocListController,
  unitListController,
  nocFileUploadController,
} from "./constructionFinance";

import {
  dashboardController,
} from "./dashboard";

import { sfToPortalController } from "./salesforce";

import { workProgressController, workProgressOperations } from "./workProgress";

import { projectBuilderController } from "./project";

import { masterToPortalController, portalToSfController } from "./dataMigration";
const cors = require("cors");


export default express
  .Router()
  .use(auth.verifyStaticToken)
  .post("/refreshToken", authController.refreshToken)
  .get("/getUser/:id", 
  auth.verifyToken,
  auth.verifyRoutePermissions('view_own_profile'), 
  controller.findUser)
  .post(
    "/userRegistration",
    registrationValidator.validate,
    regController.userRegistration
  )
  .post("/userLogin", loginController.userLogin)
  .post(
    "/regOtpVerifications",
    auth.verifyOtpToken,
    regOtpController.regOtpVerification
  )
  .post("/resendRegOtp", auth.verifyOtpToken, resendRegOtpController.resendOtp)
  .post(
    "/loginOtpVerifications",
    auth.verifyOtpToken,
    loginOtpController.loginOtpVerification
  )
  .post("/resendLoginOtp", auth.verifyOtpToken, resendOtpController.resendOtp)

  .post(
    "/createUser",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_user'), 
    userValidator.createUserRules(),
    userValidator.validate,
    controller.create
  )

  .put(
    "/updateUser/:user",
    auth.verifyToken,
    auth.verifyRoutePermissions('edit_user'),
    userValidator.updateUserRules(),
    userValidator.validate,
    controller.update
  )

  .put(
    "/assignUserCompany/:user",
    auth.verifyToken,
    auth.verifyRoutePermissions('assign_user_to_company'),
    userValidator.assignUserCompanyRules(),
    userValidator.validate,
    controller.assignUserCompany
  )

  .get("/getCreatedUsers", 
  auth.verifyToken, 
  auth.verifyRoutePermissions('get_created_users'),
  controller.getcreatedUsers)

  .get("/getUserDetails/:user", 
  auth.verifyToken, 
  auth.verifyRoutePermissions('view_user'),
  controller.getUserDetails)

  .put("/makeUserAdmin/:user", 
  auth.verifyToken,
  auth.verifyRoutePermissions('make_admin_user'),
  controller.makeUserAdmin)

  .put(
    "/updateProfile",
    auth.verifyOtpToken,
    auth.verifyRoutePermissions('edit_own_profile'),
    userValidator.userRules(),
    userValidator.validate,
    controller.updateProfile
  )
  .get("/getAllCompanies", companyMasterController.getAllCompanies)
  .get(
    "/getAllDesignations",
    designationController.getAllDesignations
  )
  .post("/forgotPassword", passwordResetController.forgotPassword)
  .post("/resetPassword", passwordResetController.resetPassword)

  .post(
    "/rera",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    reraValidator.reraValidationRule(),
    reraValidator.validate,
    reraOperationController.reraDetails
  )

  .get("/getAllEntities", entityController.getAllEntities)
  .get("/getAllStates", stateController.getAllStates)
  .get("/getAllDistricts", districtController.getAllDistricts)
  .get("/getAllPincodes", pincodeController.getAllPincodes)
  .get("/getAllCities", cityController.getAllCities)

  .get("/getAllBankAccountTypes", bankAccountTypeMasterController.getAllBankAccountTypess)
  .get("/getAllBanks", bankMasterController.getAllBanks)

  .post(
    "/projectInfo",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    projectValidator.projectRules(),
    projectValidator.validate,
    projectOperationController.projectInformation
  )

  .get(
    "/getAllProjectCategory",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    projectCategory.getAllCategory
  )
  .get("/getAllDocument", 
  auth.verifyToken,
  auth.verifyRoutePermissions('create_project'), 
  documentType.getAllDocumentType)

  .post(
    "/companyDetails",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_company'),
    companyController.validate("createOrUpdate"),
    companyController.createOrUpdate
  )

  .post(
    "/createCompanyProject",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    companyController.validate("createProjectCompany"),
    companyController.createCompanyProject
  )
  .get("/companyDetails/:company", 
  auth.verifyToken, 
  auth.verifyRoutePermissions('view_company'),
  companyController.getById)

  .get(
    "/getAllUserCompanies",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_own_company'),
    companyController.getAllUserCompanyInfo
  )

  .post(
    "/getAllProjects",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_project'),
    projectInfoController.getAllProjectInfo
  )

  .get(
    "/getAllCompanyProjects/:company",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_project'),
    projectInfoController.getCompanyProjects
  )

  .get(
    "/getCompanyProjectsForSelection/:company",
    auth.verifyToken,
    projectInfoController.getCompanyProjectsForSelection
  )

  .post(
    "/SaveandUpdateAddressinfo",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project_address'),
    projectValidator.projectAddressRules(),
    projectValidator.validate,
    addressController.addressDetail
  )

  .get("/getAllProjectAddress/:project", 
    auth.verifyToken,
    auth.verifyRoutePermissions('edit_project_address'),
    addressController.getAllAddress)

  .post(
    "/documentBulkOperations",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    projectDocBulkController.projectDocdetail
  )
  .post(
    "/documentSingleOperations",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    projectDocSingleController.projectDocdetail
  )
  .get(
    "/getAllProjectDocuments/:project",
    auth.verifyRoutePermissions('create_project'),
    projectDocBulkController.getAllDocuments
  )
  .get("/getAllCitiesbyState", cityControllerStateWise.getAllCities)
  .get("/getAllAreabyState", areaControllerStateWise.getAllArea)
  .get("/getAllTalukabyState", talukaControllerStateWise.getAllTaluka)
  
  .post(
    "/getCompanyInfoByProject",
    auth.verifyToken,
    auth.verifyRoutePermissions('view_company'),
    projectInfoController.getCompanyInfoByProject
  )

  .post(
    "/memberDetails",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_company'),
    companyMemberController.validate("createOrUpdate"),
    companyMemberController.createOrUpdate
  )
  .get(
    "/completeCompanyDetails/:company",
    auth.verifyToken,
    auth.verifyRoutePermissions('view_company'),
    companyController.getAllCompanyInfo
  )

  .get(
    "/getAllUserCompanyList",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_own_company'),
    companyController.getAllUserCompanyList
  )

  .post(
    "/deteleDocumentByid",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    projectDocSingleController.deteleDocumentByid
  )

  .post(
    "/deteleDocumentByDocType",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    projectDocBulkController.deteleDocumentByDocType
  )

  .post(
    "/submitProject",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_project'),
    projectOperationController.submitProject
  )

  .get(
    "/getAllProjectByUser",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_own_project'),
    projectOperationController.getAllProjectByUser
  )

  .get(
    "/getAllProjectByUserForSelect",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_own_project'),
    projectOperationController.getAllProjectByUserForSelect
  )

  .get(
    "/getAllAccessLevel",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_role'),
    accessLevelController.getAllAccessLevel
  )
  .get(
    "/getCompanyByAdminuser",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_own_company'),
    companyListController.getCompanyByAdminuser
  )
  .get(
    "/getQueriesByProject/:project",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_query'),
    queryListController.getQueriesByProject
  )
  .get(
    "/getQueriesByCompany/:company",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_query'),
    queryListController.getQueriesByCompany
  )
  .get(
    "/getQueriesDetailsById/:query",
    auth.verifyToken,
    auth.verifyRoutePermissions('view_query'),
    queryListController.getQueriesDetailsById
  )

  .post(
    "/addQueryCommunication/:query",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_query'),
    queryValidator.queryCommunicationRules(),
    queryValidator.validate,
    queryCommunicationController.addQueryCommunication
  )

  .post(
    "/submitNewDate/:query",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_query'),
    queryValidator.submitNewDateRules(),
    queryValidator.validate,
    queryCommunicationController.submitNewDate
  )

  .post(
    "/addQueryCommunicationDetails",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_query'),
    // queryValidator.validate,
    queryCommunicationController.addQueryCommunicationDetails
  )

  .get(
    "/getProjectsforCompany/:company",
    //auth.verifyToken,
    projectInfoController.getProjectsforCompany
  )
  .get(
    "/getNocList/:project/:type",
    auth.verifyToken,
    auth.verifyRoutePermissions('view_project'),
    nocListController.getNocListByProject
  )
  .get(
    "/getNocDetailsForPurchaser/:project/:purchaser",
    auth.verifyToken,
    auth.verifyRoutePermissions('view_project'),
    nocListController.getNocDetailsForPurchaser
  )

  .get(
    "/getAllTowers/:project",
    auth.verifyToken,
    auth.verifyRoutePermissions('view_project'),
    workProgressController.getAllTowers
  )
  .get(
    "/getProgressHistory",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_work_progress'),
    workProgressController.getProgressHistory
  )

  .post(
    "/createUpdateProjectBuilder",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_work_progress'),
    projectBuilderController.createUpdateProjectBuilder
  )

  .get(
    "/getProjectBuilderByProjectId",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_work_progress'),
    workProgressOperations.getProjectBuilderByProjectId
  )

  .post(
    "/updateWorkProgess",
    auth.verifyToken,
    auth.verifyRoutePermissions('edit_work_progress'),
    workProgressOperations.updateWorkProgess
  )

  .get(
    "/getProgressHistoryByTower/:projectBuilding",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_work_progress'),
    workProgressController.getProgressHistoryByTower
  )

  .get(
    "/getProgressHistoryByTowerId/:projectBuilding",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_work_progress'),
    workProgressController.getProgressHistoryByTowerId
  )

  .get(
    "/getAccountListByBuilder/:company",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_bank_account'),
    builderAccountController.getAccountListByBuilder
  )

  .get(
    "/getAccountListByProject/:project",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_bank_account'),
    builderAccountController.getAccountListByProject
  )

  .get(
    "/getAccountDetailsById/:id",
    auth.verifyToken,
    auth.verifyRoutePermissions('view_bank_account'),
    builderAccountController.getAccountDetailsById
  )

  .get(
    "/getInventoryDetails/:project",
    auth.verifyToken,
    auth.verifyRoutePermissions('view_inventory'),
    inventoryController.getInventoryDetails
  )

  .post(
    "/updateInventory/:project",
    auth.verifyToken,
    auth.verifyRoutePermissions('edit_inventory'),
    inventoryController.validate("updateInventory"),
    inventoryController.updateInventory
  )

  .get(
    "/getInventoryHistory/:project",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_inventory'),
    inventoryController.getInventoryHistory
  )


  .post(
    "/createBuilder",
    companyController.validate("createOrUpdate"),
    companyController.createOrUpdate
  )

  .post("/updateBuilderDetails", sfToPortalController.updateBuilderStatus)

  .post("/updateBuilderDuplicate", sfToPortalController.updateBuilderStatus)

  .post("/updateProjectStatus", sfToPortalController.updateProjectDetails)


  .get(
    "/getUnitListByProject/:project/:tower",
    auth.verifyToken,
    auth.verifyRoutePermissions('list_inventory'),
    unitListController.getUnitListByProject
  )


  .post(
    "/addPurchaser/:company/:project",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_purchaser'),
    purchaserValidator.addPurchaseRule(),
    purchaserValidator.validate,
    purchaserController.addPurchaser
  )
  .get("/migrateBuilders", masterToPortalController.migrateBuilders)
  .post("/addCompaniesToSFS", portalToSfController.addCompaniesToSFS)

  .post(
    "/nocFileUploadData",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_purchaser'),
    uploadFile.single("file"),
    nocFileUploadController.readUploadFile
  )

  .post(
    "/createAccountforBulkCreation",
    auth.verifyToken,
    auth.verifyRoutePermissions('create_purchaser'),
    builderAccountController.createAccountforBulkCreation
  )

  .post(
    "/sendEmailNotificationToNewUser",
    auth.verifyToken,
    controller.sendEmailNotificationToNewUser
  )

  .get("/getDashboardAnalytics", dashboardController.getDashboardAnalytics)
  .get("/getDashboardProjectAnalytics", dashboardController.getDashboardProjectAnalytics)
  .get("/getDashboardNotifications", dashboardController.getDashboardNotifications)
  .get("/getDashboardQueries", dashboardController.getDashboardQueries)
  .get("/getDashboardLoanAnalytics", dashboardController.getDashboardLoanAnalytics)

  //below for testing api
  .post("/", auth.verifyToken, controller.create)
  .get("/", controller.all)
  .get("/:id", controller.byId);
