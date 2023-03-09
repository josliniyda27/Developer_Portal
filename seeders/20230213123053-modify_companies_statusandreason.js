'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
    */
    await queryInterface.addColumn("companies", "status", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("companies", "reason", {
      type: Sequelize.TEXT,
    });
  },

  async down (queryInterface, Sequelize) {
   
  }
};
