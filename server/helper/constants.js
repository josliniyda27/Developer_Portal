const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
const fs = require("fs");

//status code constants
const statusCode = {
  successCode: 200,
  notFound: 404,
  serverError: 500,
  forbidden: 403,
};

//application message constants
const messages = {
  contactSupport: "Something went wrong,Please contact support team",
  userCreatedSuccess:
    "User created successfully please verify by using sms OTP",
  userCreatedSuccessPortal: "User created successfully",
  userCompanyUpdatedSuccess: "User details updated successfully",
  adminChangedSuccess:
    "Admin changed successfully and you will be logged out soon",
  userPasswordKLinkSuccess:
    "Password rest link sent to your mail successfully. Please check",
  createdUserDetails: "Details of all users created by log in user",
  userDetails: "User details",
  userCreatedError: "Some error occurred while creating the user details",
  userNotFound: "Cannot find user details",
  userHasNoPermission: "Sorry you don't have permission on this page",
  userDetailsError: "Error retrieving user with id",
  apiError: "Error retrieving details",
  regOtpVerification: "All Otp verified successfully",
  regOtpVerificationErr: "Something went wrong in otp verification",
  resendOtp: "Otp regenerated successfully",
  resendSmsOtp: "Sms Otp regenerated successfully",
  resendEmailOtp: "Email Otp regenerated successfully",
  loginOtp: "Login Otp generated successfully",
  CompanyDetailsForSelect: "Company details for selection",
  designationDetailsForSelect: "Designation details for selection",
  userInvalide:
    "This Email ID/ Mobile Number is not registered in the platform",
  regSmsOtpVerification: "Sms Otp verified successfully.Email Otp generated",
  userUpdatedSuccess:
    "User data updated successfully ,please verify by using OTP",
  otpRequired: "Otp is required!",
  otpInvalid: "Please enter the valid OTP received in your Email/Mobile number",
  otpInvalidEmail: "Please enter the valid OTP received in your Email Id",
  otpInvalidMobile: "Please enter the valid OTP received in your Mobile number",
  invalidCred:
    "This Email Id/ Mobile number is not registered in the platform, Please register!",
  invalidEmail:
    "This email ID is not registered to the platform. Please use a registered email ID",
  invalidPasswordToken:
    "The reset password link has expired. Please try again.",
  loginOtpVerification: "Otp verification successfully completed",
  userForgotPasswordSuccess:
    "An email with a reset link has been sent to your registered email",
  userPasswordResetSuccess: "Your password updated successfully",
  smsVerification: "Sms otp verification is pending",
  smsVerificationC: "Sms verification already completed",
  invalidType: "Invalid type",
  otpExpired: "OTP token was expired",
  smsvPending: "Sms verification pending",
  emailvPending: "Email verification pending",
  passwordError: "Incorrect password",
  credRequired: "Mobile or Email is required",
  passwordRequired: "Password required",
  otpTokeRequired: "Otp access token is required",
  typeRequired: "Type is required!",
  smsvCompleted: "Sms verification already completed",
  otpTokenExpired: "The token you passed is either invalid or expired",
  otpTokenNotProvided: "No access token provided!",
  staticTokenNotProvided: "No api token provided!",
  staticTokenNotValid: "Invalid API token",
  EntityDetailsForSelect: "Entity details for selection",
  StatesDetailsForSelect: "States details for selection",
  BankDetailsForSelect: "Bank details for selection",
  BankAccountTypeDetailsForSelect: "Bank account type details for selection",
  DistrictDetailsForSelect: "District details for selection",
  CityDetailsForSelect: "City details for selection",
  PincodeDetailsForSelect: "Pincode details for selection",
  reraOperationsSuccess: "Rera operations completed successfully",
  projectInfoCreated: "Project info updated successfully",
  reraOperationsUpdate: "Rera details and Project info updated successfully",
  projectCategorySelect: "Project category list",
  documentTypeList: "Document type list",
  Projectinfoselection: "Project info details ",
  ProjectinfoByCompany: "Project info details by company",
  ProjectinfoByCompanyForSelection:
    "Project info details by company for selection",
  companyDetailsSuccess: "Company information details",
  companyDetailsUpdatedSuccess: "Company information updated successfully",
  companyNotFound: "Company not found",
  ProjectAddressSave: "Project address details added successfully",
  ProjectAddressUpdate: "Project address details updated successfully",
  ProjectDocSave: "Project documents details added successfully",
  ProjectDocUpdate: "Project doc details Updated successfully",
  areaDetailsForSelect: "area details for selection",
  talukaDetailsForSelect: "taluka details for selection",
  notFound: "No data found",
  projectIdmissing: "Project id missing",
  documentsingleDetele: "Document deleted successfully",
  documentBulkDetele: "All Document deleted successfully",
  documentNotFound: "No document found by this id",
  submittedDateMissing: "Submitted date is  missing",
  submittedProject: "Project submitted successfully",
  fileuploadempty: "Upload at least one file",
  companyDetailsSaveSuccess: "Company information added successfully",
  accessLevelData: "User role list",
  queryListData: "Query list",
  companyInfo: "Company information",
  queryNotFound: "Query with provided id not found",
  queryDetailsError: "Sorry!, Some error occured with query management",
  querycommunicationSuccess: "Query communication added successfully",
  purchaserAddedSuccess: "Purchaser added successfully",
  nocRequestListData: "NOC request list for the project",
  getAllBuildingDetails: "Get all buildings under a project",
  getAllBuildingDetailsById: "Get all buildings by id",
  getAllBuildingError: "Something error with getting details",
  buildingNotFound: "Building details not found",
  builderDetailsSuccess: "Builder details updates successfully",
  projectDetailsSuccess: "Project details updates successfully",
  workProgressSuccess: "Work progress updates successfully",
  BuildingProgressDataErr:
    "BuildingProgressData should array with at least one element",
  BuildingProgressDocumentDataErr:
    "BuildingProgressDocumentData should array with at least one element",
  createProjectBuilderSuccess: "Project builders details created successfully",
  updatedProjectBuilderSuccess: "Details updated successfully",
  projectBuilderDetails: "Project builder details by project",
  uploadExcelFile: "Please upload an excel file!",
  pleaseReferTemplate:
    "Please refer the correct template: this values not available ",
  fileBulkExcel: "File uploaded and data inserted successfully",
  dashboardAnalyticsSuccess: 'Dashboard analytics details',
  projectAnalyticsSuccess : "Project analytics details",
  dashboardNotificationsSuccess : "Dashboard notification details",
  dashboardQueriesSuccess : "Dashboard quries details",

  excelFileHeadError: "Headers do not match expected values",
  accountDetailsUpdated: "Account Details Updated successfully",
};

const staticToken = "AgsrdfttAiOiJKV1QiLCJKSKSrtdfdNiIsImtpZCI6IjJaUX";

const passwrdEncrption = {
  salt: "$2b$10$t7oxiwchWGHa/B9w0AzrYO",
  hash: "$2b$10$t7oxiwchWGHa/B9w0AzrYO2WH2rQbA86YSuQjSTmwIrpC/0ZXN7V2",
};

//token constants
const tokenConstans = {
  saltRounds: 10,
};

const otpType = ["smsOtp", "emailOtp"];

//panCinValidation
const messageResponse = function (companyName, mobileNumber) {
  let mobileStr = mobileNumber;
  let companyStr = companyName;

  //companystringMasking
  if (companyName.length > 3) {
    companyStr =
      companyName.substring(0, 2) +
      companyName
        .substring(0, companyName.length - 4)
        .replace(/[a-z\d]/gi, "*") +
      companyName.substring(companyName.length - 2, companyName.length);
  }

  //companymobileMasking
  mobileStr = mobileNumber.replace(/\b(\d\d)\d|\d(?=\d\d)/g, "$1*");

  let message =
    "Company " +
    companyStr +
    " is linked to the mobile number " +
    mobileStr +
    ". Please login using this mobile number";

  return message;
};

const validationResponse = function (field, panCard, mobileNumber) {
  console.log("data set");
  let mobileStr = mobileNumber;
  let panCardStr = panCard;
  //panCardMasking
  if (panCard.length > 3) {
    panCardStr =
      panCard.substring(0, 2) +
      panCard.substring(0, panCard.length - 4).replace(/[a-z\d]/gi, "*") +
      panCard.substring(panCard.length - 2, panCard.length);
  }
  //mobilenumberMasking
  mobileStr = mobileNumber.replace(/\b(\d\d)\d|\d(?=\d\d)/g, "$1*");

  let message =
    field +
    " " +
    panCardStr +
    " is linked to the mobile number " +
    mobileStr +
    ". Please login using this mobile number";

  return message;
};

//end

const dbConst = {
  userSourcePortal: "portal",
};

///smsAndEmailconstants
let BroadcastConstants = {};

if (process.env.APP_ENV === "development") {
  BroadcastConstants = {
    feedid: 389288,
    userName: "8086705707",
    password: "December@2022",
    regTemplateId: "1107167332495788016",
    loginTemplatedId: "1107167332491722895",
    uRL: "https://test1bulksms.mytoday.com/BulkSms/SingleMsgApi",
    emailUrl: "https://emailapi.netcorecloud.net/v5/mail/send",
    emailApiKey: "8ea7f17927ac1aceca5fe6a62ba129ae",
    fromEmail: "info@hdfc.com",
    emailType: "html",
    resetPasswordUrl: process.env.FRONT_END_URL + "/reset/test",
    createPassword:process.env.FRONT_END_URL +"/create-password/",
    emailFromName: "HDFC Developer Portal",
  };
} else {
  BroadcastConstants = {
    feedid: 389288,
    userName: "8086705707",
    password: "December@2022",
    regTemplateId: "1107167332495788016",
    loginTemplatedId: "1107167332491722895",
    uRL: "https://test1bulksms.mytoday.com/BulkSms/SingleMsgApi",
    regMsg:
      "is the OTP for your account verification to HDFC Developer Portal. This OTP is valid for 3 Minutes -HDFC LTD.",
  };
}
//end

const sfConst = {
  sf_builderId: "HDFC_DP_BUILDERID__c",
  sf_builderName: "HDFC_DP_Builder_Name__c",
  sf_cinNo: "HDFC_DP_CIN_NO__c",
  sf_panNo: "HDFC_DP_PAN_NO__c",
  sf_addressLine1: "HDFC_DP_ADDRESS_LINE1__c",
  sf_addressLine2: "HDFC_DP_ADDRESS_LINE2__c",
  sf_addressLine3: "HDFC_DP_ADDRESS_LINE3__c",
  sf_city: "HDFC_DP_City__c",
  sf_state: "HDFC_DP_STATE__c",
  sf_pincode: "HDFC_DP_PINCODE__c",
  sf_isGroupCompany: "HDFC_DP_Is_Group_Company",
  sf_parnetCompanyId: "HDFC_DP_Parent_Company_Id",
  sf_createdDate: "HDFC_DP_Created_Date__c",
  sf_groupCompanyName: "HDFC_DP_Group_Company_Name",
  sf_ProjectCompletedPrev: "HDFC_DP_project_completed_previously_c",
  sf_addressProof: "HDFC_DP_address_proof_document_c",
  sf_keyMemberDesignation: "HDFC_DP_Key_Member_Designation_c",
  sf_keyMemberName: "HDFC_DP_Key_Member_name_c",
  sf_keyMemberMobile: "HDFC_DP_key_member_mobile_number_c",
  sf_keyMemberEmailId: "HDFC_DP_key_member_email_id_c",
  sf_keyMemberPan: "HDFC_DP_key_member_pan_number_c",
  sf_keyMemeberPan: "HDFC_DP_key_member_pan_card_url_c",
  sf_companyContatctPerson: "HDFC_DP_contact_person_name_1",
  sf_contatctPersonEmail: "HDFC_DP_contact_person_email_c",
  sf_contatactPersonMobile: "HDFC_DP_contact_person_mobile_number_c",
  sf_contatcPersonDesignation: "HDFC_DP_contact_person_designation_c",
  // HDFC_DP_registered_by_user_name_c: "HDFC_DP_registered_by_user_name_c",
  // HDFC_DP_registered_by_email_id_c: "HDFC_DP_registered_by_email_id_c",
  // HDFC_DP_registered_by_mobile_number_c: "HDFC_DP_registered_by_mobile_number_c",
  // HDFC_DP_registered_by_designation_c: "HDFC_DP_registered_by_designation_c",
};

const uploadFileType = {
  nocFileUploadData: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

const towerFilerCase = (sortOrderType) => {
  let today = "";
  let endDay = "";
  let returnJson = {};
  if (sortOrderType === "LastWeek") {
    today = new Date();
    endDay = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    today = today.setDate(today.getDate() + 1);
    endDay = endDay.setDate(endDay.getDate() - 1);

    returnJson = {
      createdAt: {
        [Op.between]: [endDay, today],
      },
    };
    return returnJson;
  } else if (sortOrderType === "LastMonth") {
    today = new Date();
    endDay = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );

    today = today.setDate(today.getDate() + 1);
    endDay = endDay.setDate(endDay.getDate() - 1);

    returnJson = {
      createdAt: {
        [Op.between]: [endDay, today],
      },
    };
    return returnJson;
  } else if (sortOrderType === "Last3Month") {
    today = new Date();
    endDay = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      today.getDate()
    );
    today = today.setDate(today.getDate() + 1);
    endDay = endDay.setDate(endDay.getDate() - 1);

    returnJson = {
      createdAt: {
        [Op.between]: [endDay, today],
      },
    };
    return returnJson;
  } else if (sortOrderType === "Last6Month") {
    today = new Date();
    endDay = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      today.getDate()
    );
    today = today.setDate(today.getDate() + 1);
    endDay = endDay.setDate(endDay.getDate() - 1);

    returnJson = {
      createdAt: {
        [Op.between]: [endDay, today],
      },
    };
    return returnJson;
  } else if (sortOrderType === "LastYear") {
    today = new Date();
    endDay = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      today.getDate()
    );
    today = today.setDate(today.getDate() + 1);
    endDay = endDay.setDate(endDay.getDate() - 1);

    returnJson = {
      createdAt: {
        [Op.between]: [endDay, today],
      },
    };
    return returnJson;
  }
};

const validColumnsForExcel = [
  "name",
  "file_number",
  "mobile_number",
  "email",
  "noc_status",
  "loan_status",
  "disbursement_request_status",
  "institution",
  "issued_on",
  "unit_type",
  "unit_type_name",
  "unit_number",
  "booking_date",
  "carpet_area",
  "rate_per_sqfeet",
  "agreement_value",
  "sanctioned_loan_amount",
  "balance_recievable",
  "noc_file",
  "requested_date",
  "requested_amount",
  "last_disbursed_date",
];

const deleteFile = async (path) => {
  await fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return err;
    }
    console.log(`${path} was deleted`);
    return `${path} was deleted`;
  });
};

module.exports = {
  statusCode,
  messages,
  tokenConstans,
  otpType,
  staticToken,
  messageResponse,
  validationResponse,
  dbConst,
  BroadcastConstants,
  sfConst,
  uploadFileType,
  towerFilerCase,
  validColumnsForExcel,
  deleteFile,
};
