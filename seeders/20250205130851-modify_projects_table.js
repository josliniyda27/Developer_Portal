'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */

    //projects


    await queryInterface.addColumn("projects", "units_for_sales", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("projects", "sold_units", {
        type: Sequelize.STRING,
        allowNull: true,
    }); 
    
    await queryInterface.addColumn("projects", "avg_rate_per_square_feet", {
        type: Sequelize.STRING,
        allowNull: true,
    }); 

    await queryInterface.addColumn("projects", "total_unsold_inventory", {
        type: Sequelize.STRING,
        allowNull: true,
    });
    
    await queryInterface.addColumn("projects", "total_value_of_unsold_inventory", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("projects", "total_number_of_loans", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("projects", "total_loan_amount", {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.addColumn("projects", "total_number_of_floors", {
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
