'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    //projects

    await queryInterface.addColumn("project_address_details", "pincode", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("projects", "project_number", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("projects", "sf_unique_number", {
        type: Sequelize.STRING,
        allowNull: true,
    });


    await queryInterface.addColumn("project_companies", "builder_id", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("project_address_details", "project_number", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("project_address_details", "city_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("project_address_details", "state_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("project_address_details", "pincode", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("project_address_details", "area_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("project_address_details", "taluka_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("project_address_details", "district_name", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("project_companies", "project_number", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("project_contacts", "builder_id", {
        type: Sequelize.STRING,
        allowNull: true,
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
  }
};
