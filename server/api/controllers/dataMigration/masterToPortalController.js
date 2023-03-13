"use strict";
const db = require("../../model");
const {
  companies: Company,
  usercompanies: Usercompanies,
  cities: City,
  projectCompany: Projectcompanies,
  designations: Designation,
  sequelize: Sequelize,
  users: User,
  project: Project,
  projectAddressDetail: projectAddressDetail,
  builderAccount: BuilderAccount,
  projectInventoryHistory: ProjectInventoryHistory,
} = db;
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");
const fs = require('fs');
const csv = require('csv-parser');
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");


exports.migrateBuilders = async (req, res) => {
  const rows = [];

  fs.createReadStream('./public/dataMigrations/Builder_MASTER.csv')
    .pipe(csv())
    .on('data', (row) => {
      //console.log(JSON.stringify(row));
    //  res.json(row['builder_name']);
      // Company.create({
      //   name: row.builder_name,
      //   builder_id: row.builder_number,
      //   status: row.status,
      //   createdAt: row.created_at,
      //   updatedAt: row.created_at
      // });

          rows.push([row.builder_name, row.builder_number, row.created_at]);


    })
  .on('end', async () => {

      // Respond with the parsed CSV data
      await console.log(JSON.stringify(rows));
      res.json('success');
    });
};