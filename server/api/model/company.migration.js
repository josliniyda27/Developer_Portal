module.exports = (sequelize, Sequelize) => {
  const Company = sequelize.define(
    "companies",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Company name already in use!",
        },
        validate: {
          notNull: { msg: "Company name is required" },
          validateName: function (value) {
            if (!/^[A-Za-z0-9.@&() ]+$/i.test(value)) {
              throw new Error(
                "Company name should have only alphabets and numbers."
              );
            }
          },
          validateOnlyString: function (value) {
            if (!/[^0-9]/i.test(value)) {
              throw new Error("Company name cannot be numbers only.");
            }
          },
          len: {
            args: [2, 100],
            msg: "Company name should be have minumum of two letters.",
          },
        },
      },
      pan_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: "PAN Number  already linked with a company",
        },
      },
      cin_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: "CIN Number  already linked with a company",
        },
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true,
        //values = PORTAL,SALESFORCE
      },
      address_line_1: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      address_line_2: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      address_line_3: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_group_company: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      group_company_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      completed_project_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      completed_project_names: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      builder_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      has_parent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_group_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_send_to_sf: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type_of_entity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pincode_value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true },
    {
      indexes: [
        {
          unique: true,
          name: "unique_name",
          fields: [sequelize.fn("lower", sequelize.col("name"))],
        },
      ],
    }
  );

  return Company;
};
