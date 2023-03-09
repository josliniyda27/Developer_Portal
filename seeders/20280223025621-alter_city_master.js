'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    //projects

    await queryInterface.addColumn("states", "code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("districts", "code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("districts", "state_code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("cities", "code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("cities", "state_code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("talukas", "code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("talukas", "state_code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("areas", "code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("areas", "state_code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("areas", "city_code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("pincodes", "state_code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("pincodes", "city_code", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("pincodes", "city_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
    });

    await queryInterface.addColumn("pincodes", "district_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
    });

    await queryInterface.addColumn("cities", "state_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
    });

    await queryInterface.addColumn("talukas", "state_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
    });

    await queryInterface.addColumn("areas", "state_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
    });

    await queryInterface.addColumn("areas", "city_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
  }
};
