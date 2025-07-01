'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_background_checks extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each background check belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in background_checks table
        as: 'background_check_owner',  // Alias for the relationship
        onDelete: 'CASCADE',     // Delete background check if the corresponding person is deleted
        onUpdate: 'CASCADE',     // Cascade update if the peoples record is updated
      });
    }
  }

  people_background_checks.init(
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
        onDelete: 'CASCADE', // Delete background check if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      check_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      check_result: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isIn: [['passed', 'failed', 'pending']], // Ensure check_result is one of the valid values
        },
      },
      check_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      check_issuer: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      additional_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Background Checks record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Background Checks record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'people_background_checks',  // The model name for the table
      tableName: 'people_background_checks', // Table name in the database
      timestamps: true,  // Adds createdAt and updatedAt fields automatically
      underscored: true, // Underscored table name
    }
  );

  return people_background_checks;
};
