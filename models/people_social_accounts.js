'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_social_accounts extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each address history belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in people_address_histories table
        as: 'social_account_owner',     // Alias for the relationship
        onDelete: 'CASCADE',     // Delete address history if the corresponding person is deleted
        onUpdate: 'CASCADE',     // Cascade update if the peoples record is updated
      });
    }
  }
  people_social_accounts.init(
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
      },
      name: {
        type: DataTypes.STRING(100),
      },
      url: {
        type: DataTypes.STRING(100),
      }
    },
    {
      sequelize,
      modelName: 'people_social_accounts',
      tableName: 'people_social_accounts', // Specify the table name
      timestamps: false,  // Enable timestamps
      underscored: true, // Use snake_case for column names
    }
  );

  return people_social_accounts;
};
