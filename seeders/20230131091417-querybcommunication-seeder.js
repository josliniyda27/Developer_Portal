'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    //projects

    await queryInterface.addColumn("queries", "case_id", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("queries", "last_submission_date", {
        type: Sequelize.DATE,
        allowNull: true,
        isDate: {
          args: true,
          msg: "Last submission date in the date format",
        },
    });

    await queryInterface.addColumn("query_communications", "task_id", {
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
