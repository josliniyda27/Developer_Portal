const xlsx = require("xlsx");
const readExcel = (file) => {
  const excelDatas = {};
  const workbook = xlsx.readFile(file);
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const headers = [];
  const range = xlsx.utils.decode_range(worksheet["!ref"]);

  for (let C = range.s.c; C <= range.e.c; ++C) {
    // Get the cell address of the current header
    const cellAddress = xlsx.utils.encode_cell({ r: range.s.r, c: C });
    // Push the header value to the h,eaders array
    if (worksheet[cellAddress]) {
      headers.push(worksheet[cellAddress].v);
    }
  }
  excelDatas.headers = headers;
  excelDatas.data = data;
  excelDatas.worksheet = worksheet;
  excelDatas.sheet_name_list = sheet_name_list;

  return excelDatas;
};

const excelReadOutPut = (data, coPurchaserLimit, projectId, userId) => {
  const newJson = {
    data: data.map((obj) => {
      const innerJson = [];

      for (let i = 1; i < coPurchaserLimit; i++) {
        if (obj["co_purchaser_name_" + i]) {
          const json_object = {
            co_purchaser_name: obj["co_purchaser_name_" + i],
            co_purchaser_email: obj["co_purchaser_email_" + i],
          };
          innerJson.push(json_object);
        }
      }

      return {
        project_id: projectId,
        name: obj.name ? obj.name : null,
        file_number: obj.file_number ? obj.file_number : null,
        email: obj.email ? obj.email : null,
        noc_status: obj.noc_status ? obj.noc_status : null,
        loan_status: obj.loan_status ? obj.loan_status : null,
        disbursement_request_status: obj.disbursement_request_status
          ? obj.disbursement_request_status
          : null,
        institution: obj.institution ? obj.institution : null,
        issued_on: obj.issued_on ? obj.issued_on : null,
        unit_type: obj.unit_type ? obj.unit_type : null,
        unit_type_name: obj.unit_type_name ? obj.unit_type_name : null,
        unit_number: obj.unit_number ? obj.unit_number : null,
        booking_date: obj.booking_date ? obj.booking_date : null,

        carpet_area: obj.carpet_area ? obj.carpet_area : null,
        rate_per_sqfeet: obj.rate_per_sqfeet ? obj.rate_per_sqfeet : null,
        agreement_value: obj.agreement_value ? obj.agreement_value : null,
        sanctioned_loan_amount: obj.sanctioned_loan_amount
          ? obj.sanctioned_loan_amount
          : null,

        balance_recievable: obj.balance_recievable
          ? obj.balance_recievable
          : null,
        noc_file: obj.noc_file ? obj.noc_file : null,
        requested_date: obj.requested_date ? obj.requested_date : null,
        requested_amount: obj.requested_amount ? obj.requested_amount : null,
        last_disbursed_date: obj.last_disbursed_date
          ? obj.last_disbursed_date
          : null,
        created_by: userId ? userId : null,

        projectCoPurchasers: innerJson,
      };
    }),
  };

  return newJson;
};

module.exports = {
  excelReadOutPut,
  readExcel,
};
