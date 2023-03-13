'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    //projects

    await queryInterface.renameColumn('project_address_details', 'pincode', 'pincode_value');


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
  }
};
