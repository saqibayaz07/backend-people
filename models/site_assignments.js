'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class site_assignments extends Model {
    static associate(models) {

      // One-to-many relationship: Attendances belongs to Peoples
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in Sites table
        as: 'site_assigner', // Alias for the relationship
        onDelete: 'SET NULL', // Set manager_id to NULL when Peoples record is deleted
        onUpdate: 'CASCADE',  // Cascade update of manager_id if the Peoples record is updated
      });

      // SiteAssignments belongs to Sites, People, and Subcontractors
      this.belongsTo(models.sites, {
        foreignKey: 'site_id',
        as: 'site_assigned',  // Alias for the relationship to the Sites table
        constraints: false,  // Allow for nullable relationships
      });

      this.belongsTo(models.subcontractors, {
        foreignKey: 'subcontractor_id',
        as: 'subcontractor',  // Alias for the relationship to the Subcontractors table
        constraints: false,  // Allow for nullable relationships
      });

      // One-to-many relationship: shift_details belongs to site_shift_details
      this.hasOne(models.site_shift_details, {
        foreignKey: 'site_assignment_id',
        as: 'site_assignment_shifts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }

  site_assignments.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the site assignment record.',
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'peoples',
          key: 'id',
        },
        comment: 'Foreign key referencing the person (if applicable) for the site assignment.',

        set(value) {
          this.setDataValue("people_id", value || null); // Convert empty string to null
        },
      },
      site_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'sites',
          key: 'id',
        },
        comment: 'Foreign key referencing the site for the assignment.',
      },
      subcontractor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'subcontractors',
          key: 'id',
        },
        comment: 'Foreign key referencing the subcontractor assigned to the site.',
      },
      role: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Role of the person or subcontractor at the site.',
        validate: {
          notEmpty: { msg: 'Role cannot be empty' },
        },
        set: function (value) {
          if (value) {
            this.setDataValue("role", value.trim()); // Trim leading/trailing spaces
          }
        }
      },
      start_date: {
        type: DataTypes.DATEONLY,
        // allowNull: false,
        comment: 'Start date of the assignment.',
      },
      end_date: {
        type: DataTypes.DATEONLY,
        // allowNull: true,
        comment: 'End date of the assignment (if applicable).',
      },
      status: {
        type: DataTypes.STRING(25),
        // allowNull: false,
        defaultValue: 'active',
        validate: {
          isIn: [['active', 'inactive', 'completed']],
        },
        comment: 'Current status of the assignment.',
      },
      shift_details: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Details about the shifts or working hours, if applicable.',
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional remarks regarding the site assignment.',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the site assignment record was created.',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the site assignment record was last updated.',
      },
    },
    {
      sequelize,
      modelName: 'site_assignments',
      tableName: 'site_assignments',
      timestamps: true, // Enable Sequelize's automatic handling of createdAt and updatedAt
    }
  );

  return site_assignments;
};
