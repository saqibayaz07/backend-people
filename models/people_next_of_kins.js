'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_next_of_kins extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each next of kin belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in people_next_of_kins table
        as: 'next_of_kin_owner',  // Alias for the relationship
        onDelete: 'CASCADE',      // Delete the next of kin record if the corresponding person is deleted
        onUpdate: 'CASCADE',      // Cascade update if the peoples record is updated
      });
    }
  }

  people_next_of_kins.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
        primaryKey: true,  // Use id as the primary key
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'peoples', // Name of the model (table) to reference
          key: 'id',        // Key to reference in the peoples table
        },
        onDelete: 'CASCADE', // Delete next of kin record if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      relationship: {
        type: DataTypes.STRING(50),
        // allowNull: false,
      },
      contact_number: {
        type: DataTypes.STRING(15),
        // allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Next of Kin record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Next of Kin record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'people_next_of_kins',
      tableName: 'people_next_of_kins',
      timestamps: true,  // Assuming there's no created_at and updated_at columns
      underscored: true, // Use snake_case for column names
    }
  );

  return people_next_of_kins;
};
