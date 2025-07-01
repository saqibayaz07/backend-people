'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class site_shift_details extends Model {
    // Define the relationship here
    static associate(models) {
      // A shift detail belongs to one site assignment
      this.belongsTo(models.site_assignments, {
        foreignKey: 'site_assignment_id', // Foreign key in site_shift_details table
        as: 'site_assignment_shifts',           // Alias for the relationship
        onDelete: 'CASCADE',             // Delete shift detail if the site assignment is deleted
        onUpdate: 'CASCADE',             // Cascade update if the site assignment is updated
      });
    }
  }

  site_shift_details.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
        primaryKey: true, // Use id as the primary key
      },

      site_assignment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'site_assignments', // Reference to the site_assignments table
          key: 'id',                 // Key to reference in the site_assignments table
        },
        onDelete: 'CASCADE',         // Delete shift details if the site assignment is deleted
        onUpdate: 'CASCADE',         // Update the site_assignment_id if the corresponding site assignment is updated
      },

      shift_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      shift_start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },

      shift_end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },

      shift_duration: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      shift_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'regular',
      },

      overtime_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
      },

      break_time: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 1,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Site Shift Details record was created',
      },
      
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Site Shift Details record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'site_shift_details',
      tableName: 'site_shift_details', // Table name in the database
      timestamps: true,          // Disable automatic timestamping since we already manage timestamps manually
      underscored: true,         // Use snake_case for column names
    }
  );

  return site_shift_details;
};
