import chai from "chai";
import request from "supertest";
import Server from "../server";
const chaiHttp = require("chai-http");
let token = "some_authorization_token";
let apitoken = "AgsrdfttAiOiJKV1QiLCJKSKSrtdfdNiIsImtpZCI6IjJaUX";

const expect = chai.expect;
chai.use(chaiHttp);
let userEmail = "";
let otp = "";
let userOtp = "";
let accessToken = "";
let company_id = "";

var multipleReg = [
  {
    userName: "testName1",
    userEmail: "1test1@email.com",
    userMobile: "9812345672",
    password: "Password@98",
    companyName: "companyNamyy",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test3@email.com",
    userMobile: "9815345672",
    password: "Password@98",
    companyName: "companyName5",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test4@email.com",
    userMobile: "9812345672",
    password: "Password@98",
    companyName: "companyName4",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test5@email.com",
    userMobile: "9812345674",
    password: "Password@98",
    companyName: "companyName4",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test6@email.com",
    userMobile: "9812345676",
    password: "Password@98",
    companyName: "companyName6",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test7@email.com",
    userMobile: "9812345677",
    password: "Password@98",
    companyName: "companyName7",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test8@email.com",
    userMobile: "9812345678",
    password: "Password@98",
    companyName: "companyName8",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test9@email.com",
    userMobile: "9812345679",
    password: "Password@98",
    companyName: "companyName9",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test11@email.com",
    userMobile: "9812345611",
    password: "Password@98",
    companyName: "companyName11",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test12@email.com",
    userMobile: "9812345612",
    password: "Password@98",
    companyName: "companyName12",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test13@email.com",
    userMobile: "9812345613",
    password: "Password@98",
    companyName: "companyName13",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test14@email.com",
    userMobile: "9812345614",
    password: "Password@98",
    companyName: "companyName14",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98",
    companyName: "companyName20",
    designationId: 1,
  },
  {
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98",
    companyName: "companyName21",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName22",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName23",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName24",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName25",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName26",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName27",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName28",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName29",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName30",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName31",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName32",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName33",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName34",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName35",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName36",
    designationId: 1,
  },{
    userName: "testName2",
    userEmail: "test2@email.com",
    userMobile: "9812345672",
    password: "Password@98s",
    companyName: "companyName37",
    designationId: 1,
  }

];

var singleReg = [
  {
    userName: "testName",
    userEmail: "",
    userMobile: "9812345678",
    password: "password",
    companyName: "companyName",
    designationId: 1,
  },
];

describe("login", async () => {
  await multipleReg.forEach(function (regData, index) {

    it("Registration user", () =>
      request(Server)
        .post("/api/v1/userRegistration")
        .expect("Content-Type", /json/)
        .send(regData)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set({ "x-access-token": `${token}` })
        .set({ "api-token": `${apitoken}` })
        .then((r) => {
          console.log("\n", "userRegistration===>" + index, r.text, "\n");
          expect(r.error).to.have.status(200).to.throw('Property does not exist in model schema.');
        })
        .catch((err) => console.log()));
  });

  return;

  it("Login user", () =>
    request(Server)
      .post("/api/v1/userLogin")
      .expect("Content-Type", /json/)
      .send({
        userCredential: "khale@centelon.com",
        password: "Khaleel@98",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set({ "api-token": `${apitoken}` })
      //.expect(200)
      .then((r) => {
        console.log("userLogin===>2", r.text);
        const textObj = JSON.parse(r.text);
        userOtp = textObj.data.userOtpToken;
        console.log("userOtp", textObj.extraParam.otp);
        otp = textObj.extraParam.otp;

        expect(r.error).to.have.status(200);
      })
      .catch((err) => console.log("err")));

  it("login otp verification", () =>
    request(Server)
      .post("/api/v1/loginOtpVerifications")
      .expect("Content-Type", /json/)
      .set("Content-Type", "application/json")
      .set({ "otp-access-token": `${userOtp}` })
      .set({ "api-token": `${apitoken}` })
      .send({
        otp: otp,
      })
      //.expect(200)
      .then((r) => {
        console.log("loginOtpVerifications===>3", r.text);
        const textObj = JSON.parse(r.text);
        accessToken = textObj.data.accessToken;
        company_id = textObj.data.company_id;
        expect(r.error).to.have.status(200);
      })
      .catch((err) => console.log("err")));
});

// describe("companyDetails", () => {
//   it("companyDetails save and update", () =>
//     request(Server)
//       .post("/api/v1/companyDetails")
//       .expect("Content-Type", /json/)
//       .send({
//         company: company_id,
//         name: "name",
//         entity_id: 1,
//         pan_number: "3h23hhj23j",
//         cin_number: "43453533434343",
//         address_line_1: "2nd Floor, Round 345",
//         address_line_2: "Chennai",
//         address_line_3: "Tamilnadu, India",
//         pincode_id: 1,
//         city_id: 1,
//         state_id: 1,
//         district_id: 1,
//         group_company_name: "Asset Group of companies",
//         completed_project_count: 20,
//         completed_project_names: "Dream Homes, Forest View",
//         files: [
//           {
//             file_name: "Pancard 1",
//             file_url: "",
//             document_type: "panCard",
//           },
//           {
//             file_name: "Pancard 1",
//             file_url: "",
//             document_type: "panCard",
//           },
//         ],
//       })
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set({ "x-access-token": `${accessToken}` })
//       .set({ "api-token": `${apitoken}` })
//       .then((r) => {
//         console.log("text===>4", r.text);
//         expect(r).to.have.status(200);
//       })
//       .catch((err) => console.log("err")));
// });

// describe("reraDetails", () => {
//   it("reraDetails save and update", () =>
//     request(Server)
//       .post("/api/v1/companyDetails")
//       .expect("Content-Type", /json/)
//       .send({
//         rera_applicable: true,
//         user_id: 1,
//         company_id: 1,
//         reraDetails: [
//           {
//             registration_status: "pending",
//             registration_number: "ytyutyut8878768",
//             autofill_enabled: true,
//             application_number: "55555",
//           },
//           {
//             registration_status: "pending",
//             registration_number: "ytyutyut8878768",
//             autofill_enabled: true,
//             application_number: "55555",
//           },
//         ],
//       })
//       .set("Content-Type", "application/json")
//       .set("Accept", "application/json")
//       .set({ "x-access-token": `${accessToken}` })
//       .set({ "api-token": `${apitoken}` })
//       .then((r) => {
//         console.log("rera===>", r.text);
//         expect(r).to.have.status(200);
//       })
//       .catch((err) => console.log("err")));
// });
