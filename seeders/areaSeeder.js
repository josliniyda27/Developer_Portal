const fetch = require('node-fetch');
const { Pool } = require('pg');
const dbConfig = require("../server/common/db.config");
const db = require("../server/api/model");
const {
  cities: City,
  states: State,
  area: Area,
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


pool.query('TRUNCATE TABLE areas restart identity CASCADE');

State.findAll().then(async(states) => {


    await states.forEach(async(state) => {

    await fetch('https://uatdeveloper.hdfc.com/cp/masterdata/api/v1/locality?state='+state.code ,{
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
      await data.Data.forEach(async(area) => {
          const city = await City.findOne({ where: { code: area.City } });
          await Area.create(
              {
                  name : area.Description,
                  code : area.Code,
                  state_id : state.id,
                  city_id : city ? city.id : null,
                  state_code : area.State,
                  city_code : city ? city.code : null,
              }
          )
          .then((data) => {
            // console.log('Area inserted - '+data.name+' with id '+data.id);
          })
          .catch(error => console.log('Areas not found state '+state.code));
      });
    }
    else
    {
      console.log('Areas not found state '+state.code)
    }  
    })
    .catch(error => console.error(error));
    
  
  });


}).catch(error => console.error(error));



