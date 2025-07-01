'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_employment_histories extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each employment history belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in people_employment_histories table
        as: 'employee',          // Alias for the relationship
        onDelete: 'CASCADE',     // Delete employment history if the corresponding person is deleted
        onUpdate: 'CASCADE',     // Cascade update if the peoples record is updated
      });
    }
  }

  people_employment_histories.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
        primaryKey: true, // Use id as the primary key
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'peoples', // Name of the model (table) to reference
          key: 'id',        // Key to reference in the peoples table
        },
        onDelete: 'CASCADE', // Delete employment history if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      company_name: {
        type: DataTypes.STRING(255),
        // allowNull: false,
      },
      job_title: {
        type: DataTypes.STRING(100),
        // allowNull: false,
      },
      job_description: {
        type: DataTypes.TEXT,
        // allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        // allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reason_for_leaving: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      references_provided: {
        type: DataTypes.BOOLEAN,
        // defaultValue: false,
      },
      
    },
    {
      sequelize,
      modelName: 'people_employment_histories',
      tableName: 'people_employment_histories',
      timestamps: true, // Assuming you don’t need `createdAt` and `updatedAt` timestamps
      underscored: true,
    }
  );

  return people_employment_histories;
};
