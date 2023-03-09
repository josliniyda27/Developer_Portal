'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    await queryInterface.addColumn("project_documents", "is_send_to_sf", {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn("project_rera_details", "is_send_to_sf", {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn("project_building_categories", "is_send_to_sf", {
      type: Sequelize.BOOLEAN,
    });


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
  }
};
