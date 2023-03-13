'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    //projects

    await queryInterface.addColumn("builder_accounts", "project_id", {
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
