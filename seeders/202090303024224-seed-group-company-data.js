"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const User = [
        {
          username: "User one",
          password: 1,
          email: "userone@gmail.com",
          mobile: "9847952111",
          password: await bcrypt.hash("Password@98", 10),
          is_profile_completed: true,
          is_email_verified: true,
          is_sms_verified: true,
          designation_id: 1,
          role_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "User two",
          password: 1,
          email: "usertwo@gmail.com",
          mobile: "9847952117",
          password: await bcrypt.hash("Password@98", 10),
          is_profile_completed: true,
          is_email_verified: true,
          is_sms_verified: true,
          designation_id: 1,
          role_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "User three",
          password: 1,
          email: "userthree@gmail.com",
          mobile: "9847952115",
          password: await bcrypt.hash("Password@98", 10),
          is_profile_completed: true,
          is_email_verified: true,
          is_sms_verified: true,
          designation_id: 1,
          role_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const optionsUser = {
        returning: ["id"], // Specify which columns to return
      };

      const resultUser = await queryInterface.bulkInsert(
        "users",
        User,
        optionsUser,
        { transaction }
      );

      const userids = resultUser.map((row) => row.id);

      console.log(userids); // Output the IDs to the console for testing purposes

      const CompaniesData = [
        {
          name: "Group company one",
          city_id: 1,
          is_group_admin: true,
          has_parent: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Group company two",
          city_id: 2,

          has_parent: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Group company three",
          city_id: 3,

          has_parent: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (let i = 0; i < userids.length; i++) {
        CompaniesData[i].created_by = userids[i];
      }

      const options = {
        returning: ["id"], // Specify which columns to return
      };

      const result = await queryInterface.bulkInsert(
        "companies",
        CompaniesData,
        options,
        { transaction }
      );

      const ids = result.map((row) => row.id);

      const userCompanyData = [
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (let i = 0; i < ids.length; i++) {
        userCompanyData[i].company_id = ids[i];
        userCompanyData[i].user_id = userids[i];
        userCompanyData[i].assigned_by = userids[i];
      }

      const UserComapnyoptions = {
        returning: ["id"], // Specify which columns to return
      };
      const UserCompanyInsert = await queryInterface.bulkInsert(
        "user_companies",
        userCompanyData,
        UserComapnyoptions,
        { transaction }
      );

      const groupCompanyData = [
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (let i = 0; i < ids.length; i++) {
        groupCompanyData[i].company_id = ids[i];
        groupCompanyData[i].parent_id = ids[0];
      }

      const GroupComapnyoptions = {
        returning: ["id"], // Specify which columns to return
      };
      const resultGroupCompany = await queryInterface.bulkInsert(
        "company_groups",
        groupCompanyData,
        GroupComapnyoptions,
        { transaction }
      );
      await transaction.commit();
      console.log("GroupCompany successfully created");
      console.log(
        "Please try to login this group admin user",
        " username:9847952111 or userone@gmail.com",
        " password:Password@98"
      );
      return;
    } catch (error) {
      await transaction.rollback();
      console.log("GroupCompany error==>",error);
      //throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
