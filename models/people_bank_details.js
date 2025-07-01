
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_bank_details extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each bank detail belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in people_bank_details table
        as: 'bank_owner_details',        // Alias for the relationship
        onDelete: 'CASCADE',     // Delete bank details if the corresponding person is deleted
        onUpdate: 'CASCADE',     // Cascade update if the peoples record is updated
      });
    }
  }

  people_bank_details.init(
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
        onDelete: 'CASCADE', // Delete bank details if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      account_name: {
        type: DataTypes.STRING(300),

      },
      sort_code: {
        type: DataTypes.STRING(10),
      },
      account_number: {
        type: DataTypes.STRING(20),
      },
     
    
      bank_name: {
        type: DataTypes.STRING(255),
      },
      payment_reference: {
        type: DataTypes.STRING(300),

      },
      building_society_reference: {
        type: DataTypes.STRING(300),
      },
      iban: {
        type: DataTypes.STRING(34),
        allowNull: true,  // Nullable if the IBAN is not provided
      },
      swift_code: {
        type: DataTypes.STRING(11),
        allowNull: true,  // Nullable if the SWIFT/BIC code is not provided
      },
      country_code: {
        type: DataTypes.STRING(300),
        defaultValue: 'GB',
      },
      account_type: {
        type: DataTypes.STRING(50),
      },
      branch_address: {
        type: DataTypes.STRING(100),
        allowNull: true,  // Nullable if the branch address is not provided
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Bank Details record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Bank Details record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'people_bank_details',
      tableName: 'people_bank_details', // Table name in the database
      timestamps: true, // No need for createdAt/updatedAt fields
      underscored: true, // Use snake_case for column names
    }
  );

  return people_bank_details;
};
