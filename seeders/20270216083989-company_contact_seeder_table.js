'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    await queryInterface.addColumn("companies", "type_of_entity", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("companies", "city_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("companies", "state_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("companies", "pincode", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("company_key_members", "builder_id", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("company_key_members", "designation_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("company_supporting_members", "builder_id", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("company_supporting_members", "designation_name", {
      type: Sequelize.STRING,
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
  }
};
