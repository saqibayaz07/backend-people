'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_emergency_contacts extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each emergency contact belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in people_emergency_contacts table
        as: 'emergency_contact_owner', // Alias for the relationship
        onDelete: 'CASCADE', // Delete emergency contact if the corresponding person is deleted
        onUpdate: 'CASCADE', // Cascade update if the peoples record is updated
      });
    }
  }

  people_emergency_contacts.init(
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
        onDelete: 'CASCADE', // Delete emergency contact if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      contact_name: {
        type: DataTypes.STRING(100),
        // allowNull: false,
      },
      relationship: {
        type: DataTypes.STRING(100),
        // allowNull: false,
      },
      contact_number: {
        type: DataTypes.STRING(15),
        // allowNull: false,
      },
      contact_address: {
        type: DataTypes.STRING(100),
        allowNull: true, // Optional field
      },
      contact_email: {
        type: DataTypes.STRING(25),
        allowNull: true, // Optional field
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Emergency Contact record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Emergency Contact record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'people_emergency_contacts',
      tableName: 'people_emergency_contacts',
      timestamps: true, // Since we manually manage created_at and updated_at
      underscored: true,
    }
  );

  return people_emergency_contacts;
};
