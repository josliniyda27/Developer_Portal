'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    //projects

    await queryInterface.addColumn("builder_accounts", "status", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("builder_accounts", "remarks", {
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
