const fetch = require('node-fetch');
const { Pool } = require('pg');
const dbConfig = require("../server/common/db.config");
const db = require("../server/api/model");
const {
  states: States,
  district: District,
} = db;
const { Op } = require("sequelize");

const pool = new Pool({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
  port: dbConfig.DBPORT,
});


pool.query('TRUNCATE TABLE districts restart identity CASCADE');

States.findAll().then(async (states) => {


  await states.forEach(async (state) => {

    await fetch('https://uatdeveloper.hdfc.com/cp/masterdata/api/v1/masters?master-name=district&parent-id='+state.code ,{
      method: "GET",
      headers: {
          "x-api-key": "KLBiMp45wT2SdNYcCIrSS3vpkUyJQqZ789DUuKXo",
          "client_id": "6033000e2e984686b67835f00317a9f9",
          "client_secret": "3e4C26669E7b4abaAB77BAb0860Ea85c",
      },
  })
    .then(response => response.json())
    .then(async (data) => {
      if(data.Data.length)  {
      await data.Data.forEach(async (district) => {
          await District.create(
              {
                  name : district.Name,
                  code : district.Code,
                  state_id : state.id,
                  state_code : state.code
              }
          )
          .then((data) => {
            //console.log('District inserted - '+data.name+' with id '+data.id);
          })
          .catch(error => console.error(error));
      });
     }
     else
     {
        console.log('Districts not found state '+state.code)
     }
    })
    .catch(error => console.error(error));
    
  
  });


}).catch(error => console.error(error));



