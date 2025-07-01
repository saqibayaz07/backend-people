'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class departments extends Model {

    // Define the relationship here
    static associate(models) {

      // One-to-one association with Peoples model
      this.belongsTo(models.peoples, {
        foreignKey: 'manager_id', // Foreign key in Departments table
        as: 'dept_manager', // Alias for the relationship
        onDelete: 'SET NULL', // Set manager_id to NULL when Peoples record is deleted
        onUpdate: 'CASCADE',  // Cascade update of manager_id if the Peoples record is updated
      });

      // A department can have many job positions
      this.hasMany(models.job_positions, {
        foreignKey: 'department_id', // Foreign key in JobPositions table
        as: 'job_department',          // Alias for the relationship
        onDelete: 'CASCADE',         // When a department is deleted, delete all related job positions
      });

      // A department can have many employees
      this.hasMany(models.peoples, {
        foreignKey: 'department_id', // Foreign key in Peoples table
        as: 'employees',             // Alias for the relationship
        onDelete: 'SET NULL',         // When a department is deleted, delete all related employees
        onUpdate: 'CASCADE',          // Cascade update of department_id if the Peoples record is updated
      });

    }
  }

  departments.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Use department_id as the primary key
        comment: 'Unique department identifier (UUID)',
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false, // Department name is required
        comment: 'Name of the department',
        set(value) {
          this.setDataValue("name", value.trim());
        },
        validate: {
          notEmpty: { msg: 'Department name cannot be empty' },
          len: [1, 200], // Length should be between 1 and 200 characters
        },
      },
      manager_id: {
        type: DataTypes.UUID,
        allowNull: true,
        set(value) {
          this.setDataValue('manager_id', value || null); // Set empty value to null
        },
        references: {
          model: 'peoples',   // Reference to the Peoples table
          key: 'id',          // Reference to the id field in Peoples table
        },
        onDelete: 'SET NULL', // Set manager_id to NULL when Peoples record is deleted
        onUpdate: 'CASCADE',  // Cascade update of manager_id if the Peoples record is updated
        comment: 'Foreign key referencing the People Table (manager_id) for the department manager.',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false, // Description is required
        comment: 'Description of the department max length: 1000 characters',
        validate: {
          notEmpty: { msg: 'Description cannot be empty' },
          len: [1, 1000], // Optional: limit description to 1 to 1000 characters
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the record was created',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'departments',
      tableName: 'departments',
      timestamps: true, // Enable Sequelize's automatic handling of createdAt and updatedAt
    }
  );

  return departments;
};
