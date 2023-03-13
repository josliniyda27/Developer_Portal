const fetch = require('node-fetch');
const { Pool } = require('pg');
const dbConfig = require("../server/common/db.config");
const db = require("../server/api/model");
const {
  district: District,
  taluka: Taluka,
} = db;
const { Op } = require("sequelize");
const { district, taluka } = require('../server/api/model');

const pool = new Pool({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
  port: dbConfig.DBPORT,
});


pool.query('TRUNCATE TABLE talukas restart identity CASCADE');

District.findAll().then(async (districts) => {

    await districts.forEach(async(district) => {

    await fetch('https://uatdeveloper.hdfc.com/cp/masterdata/api/v1/taluka?district='+district.code ,{
      method: "GET",
      headers: {
          "x-api-key": "KLBiMp45wT2SdNYcCIrSS3vpkUyJQqZ789DUuKXo",
          "client_id": "6033000e2e984686b67835f00317a9f9",
          "client_secret": "3e4C26669E7b4abaAB77BAb0860Ea85c",
      },
  })
    .then(response => response.json())
    .then(async(data) => {
        if(data.Data.length){

          
        await data.Data.forEach(async(taluka) => {
            await Taluka.create(
                {
                    name : taluka.Description,
                    code : taluka.Code,
                    state_id : district.state_id,
                    district_id : district.id,
                    state_code : district.state_code
                }
            )
            .then((data) => {
          //    console.log('Taluka inserted - '+data.name+' with id '+data.id);
            })
            .catch(error => console.error(error));
        });
      }

    console.log('Talukas not found for district '+district.code)

    })
    .catch(error => console.log('Talukas not found for district '+district.code));
    
  
  });


}).catch(error => console.error(error));



