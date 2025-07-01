'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class security_people_extensions extends Model {
    // Define associations here
    static associate(models) {
      // One-to-one association with Peoples model
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in SecurityPeopleExtensions table
        as: 'people_security', // Alias for the relationship
        onDelete: 'CASCADE', // Ensure that when a Peoples record is deleted, its associated SecurityPeopleExtensions is also deleted
      });
    }
  }

  security_people_extensions.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the security people extension record (UUID)',
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'peoples',  // Reference to the Peoples table
          key: 'id',         // Reference to the id field in Peoples table
        },
        onDelete: 'CASCADE', // Ensure that when a Peoples record is deleted, its associated SecurityPeopleExtensions record is also deleted
        comment: 'Foreign key to the Peoples table',
      },
      background_checks: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Details of background checks (e.g., criminal record, credit check)',
      },
      security_clearance_level: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
          isIn: [['low', 'medium', 'high', 'top-secret']], // Allowed values
        },
        comment: 'Security clearance level of the employee',
      },
      certifications: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Certifications related to security (e.g., security guard license)',
      },
      training_completed: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'List of completed training courses relevant to security',
      },
      license_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set: function (value) {
          this.setDataValue('license_number', value.trim());
        },
        comment: 'License number, if applicable',
      },
      license_expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'License expiry date, if applicable',
      },
      work_permit_status: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
          isIn: [['not-required', 'pending', 'approved', 'expired']], // Allowed work permit statuses
        },
        comment: 'Work permit status of the employee',
      },
      incident_reports: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Details of any reported incidents (e.g., security breaches)',
      },
      risk_assessment_score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Risk assessment score of the employee',
      },
      assigned_security_zone: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Assigned security zone for the employee',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'security_people_extensions',
      tableName: 'security_people_extensions',
      timestamps: true, // Automatically handle createdAt and updatedAt
      underscored: true, // Use underscored column names
    }
  );

  return security_people_extensions;
};
