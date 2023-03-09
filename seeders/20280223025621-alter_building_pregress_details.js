"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("building_pregress_details", null, {});
    await queryInterface.removeColumn(
      "building_pregress_details",
      "tower_commencement_date"
    );

    await queryInterface.removeColumn(
      "building_pregress_details",
      "estimated_completion_date"
    );

    await queryInterface.addColumn(
      "building_pregress_details",
      "tower_commencement_date",
      {
        type: Sequelize.DATE,
        allowNull: false,
      }
    );

    await queryInterface.addColumn(
      "building_pregress_details",
      "estimated_completion_date",
      {
        type: Sequelize.DATE,
        allowNull: false,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
  },
};
