'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class attendances extends Model {
    static associate(models) {

      // One-to-many relationship: attendances belongs to Peoples
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in attendances table
        as: 'person_attendence', // Alias for the relationship
        onDelete: 'CASCADE', // Cascade deletion of attendance records when a person is deleted
      });
    }
  }

  attendances.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the attendances record.',
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'peoples', // Reference to the Peoples table
          key: 'id', // Reference to the id field in Peoples table
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: 'Foreign key referencing Peoples table.',
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date of the Attendances record.',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'absent',
        validate: {
          isIn: [['present', 'absent', 'leave', 'overtime']],
        },
        comment: 'Status of the Attendances record.',
      },
      check_in_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp of check-in time.',
      },
      check_out_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp of check-out time.',
      },
      hours_worked: {
        type: DataTypes.DECIMAL(8, 2),

        allowNull: true,
        defaultValue: 0.00,
        comment: 'Total hours worked during the day.',
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Additional remarks regarding the Attendances.',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Attendances record was created.',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the attendances record was last updated.',
      },
    },
    {
      sequelize,
      modelName: 'attendances',
      tableName: 'attendances',
      timestamps: true,
    }
  );

  return attendances;
};
