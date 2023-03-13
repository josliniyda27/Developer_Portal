const fetch = require('node-fetch');
const { Pool } = require('pg');
const dbConfig = require("../server/common/db.config");
const db = require("../server/api/model");
const {
  pincode: Pincode,
  states: State,
  cities: City,
} = db;
const { Op } = require("sequelize");

const pool = new Pool({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
  port: dbConfig.DBPORT,
});


pool.query('TRUNCATE TABLE pincodes restart identity CASCADE');

State.findAll().then(async (states) => {


    await states.forEach(async(state) => {

    await fetch('https://uatdeveloper.hdfc.com/cp/masterdata/api/v1/pincode?district='+state.code ,{
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
      await data.Data.forEach(async(pincode) => {
        const city = await City.findOne({ where: { code: pincode.City } });

        await Pincode.create(
              {
                pincode : pincode.Pincode,
                state_id : state.id,
                city_code : city ? city.code : null,
                city_id : city ? city.id : null,
                state_code : state.code
              }
          )
          .then((data) => {
           // console.log('Pincode inserted - '+data.pincode+' with id '+data.id);
          })
          .catch(error => console.error(error));
      });
      }
      else
      {
        console.log('Pincode not found state '+state.code)
      }
    })
    .catch(error => console.log('Pincode not found state '+state.code));
    
  
  });


}).catch(error => console.error(error));



