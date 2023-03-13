'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    //projects

    await queryInterface.addColumn("project_purchasers", "builder_account_id", {
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
