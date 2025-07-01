'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class sites extends Model {
    // Associations can be added later if needed

    static associate(models) {
      // One-to-many relationship: Attendances belongs to Peoples
      this.belongsTo(models.peoples, {
        foreignKey: 'manager_id', // Foreign key in Sites table
        as: 'site_manager', // Alias for the relationship
        onDelete: 'SET NULL', // Set manager_id to NULL when Peoples record is deleted
        onUpdate: 'CASCADE',  // Cascade update of manager_id if the Peoples record is updated
      });

       // A site can have many site assignments
      //  this.hasMany(models.site_assignments, {
      //   foreignKey: 'site_id',
      //   as: 'assignments',
      //   onDelete: 'CASCADE',
      // });
    }
  }

  sites.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Use site_id as the primary key
        comment: 'Unique identifier for the site record.',
      },
      site_name: {
        type: DataTypes.STRING(200),
        allowNull: false, // Site name is required
        comment: 'Name of the site',
        set(value) {
          this.setDataValue("site_name", value.trim());
        },
        validate: {
          notEmpty: { msg: 'Site name cannot be empty' },
          len: [1, 200], // Length should be between 1 and 200 characters
        },
      },
      site_code: {
        type: DataTypes.STRING(50),
        allowNull: false, // Site code is required
        comment: 'Unique code for the site',
        validate: {
          notEmpty: { msg: 'Site code cannot be empty' },
        },
      },
      address_1: {
        type: DataTypes.STRING(500),
        allowNull: false, // Address line 1 is required
        comment: 'Address line 1 for the site',
      },
      address_2: {
        type: DataTypes.STRING(500),
        allowNull: true, // Address line 2 is optional
        comment: 'Address line 2 for the site (optional)',
      },
      city: {
        type: DataTypes.STRING(200),
        allowNull: false, // City is required
        comment: 'City where the site is located',
      },
      state: {
        type: DataTypes.STRING(200),
        allowNull: false, // State is required
        comment: 'State where the site is located',
      },
      post_code: {
        type: DataTypes.STRING(100),
        allowNull: false, // Postal code is required
        comment: 'Postal code of the site',
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false, // Country is required
        comment: 'Country where the site is located',
      },
      contact_person: {
        type: DataTypes.STRING(200),
        allowNull: false, // Contact person is required
        comment: 'Name of the contact person for the site',
      },
      contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: false, // Contact phone is required
        comment: 'Phone number of the contact person',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false, // Email is required
        comment: 'Email address of the contact person',
      },
      manager_id: {
        type: DataTypes.UUID,
        allowNull: true, // Manager is optional
        references: {
          model: 'peoples',  // The target model (Peoples)
          key: 'id',         // The target key in the Peoples table
        },
        set(value) {
          this.setDataValue('manager_id', value || null); // Set empty value to null
        },
        comment: 'Manager assigned to the site',
      },
      site_type: {
        type: DataTypes.STRING(255),
        allowNull: false, // Site type is required
        validate: {
          isIn: [['office', 'construction', 'warehouse', 'manufacturing', 'other']],
        },
        comment: 'Type of the site',
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false, // Status is required
        defaultValue: 'active',
        validate: {
          isIn: [['active', 'inactive']],
        },
        comment: 'Current status of the site',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false, // Description is required
        validate: {
          notEmpty: { msg: 'Description cannot be empty' },
        },
        comment: 'Description of the site',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the site record was created',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the site record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'sites',
      tableName: 'sites',
      timestamps: true, // Enable Sequelize's automatic handling of createdAt and updatedAt
    }
  );

  return sites;
};
