'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class leave_managements extends Model {
    static associate(models) {
      // One-to-many relationship with Peoples
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in LeaveManagements table
        as: 'person_leave', // Alias for the relationship
        onDelete: 'CASCADE', // When a LeaveManagements record is deleted, the associated Peoples record is not affected
      });

       // One-to-one association: LeaveManagement belongs to Peoples (approved_by)
       this.belongsTo(models.peoples, {
        foreignKey: 'approved_by',  // Foreign key in leave_managements table
        as: 'approver',  // Alias for the relationship
        onDelete: 'SET NULL',  // Set approved_by to NULL if the Peoples record is deleted
        onUpdate: 'CASCADE',  // Cascade update for changes in Peoples table
      });

    }
  }

  leave_managements.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the leave record.',
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'peoples',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: 'Foreign key referencing Peoples table.',
      },
      leave_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'annual',
        validate: {
          isIn: [['annual', 'sick', 'unpaid', 'maternity']],
        },
        comment: 'The type of leave being requested.',
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'The start date of the leave.',
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'The end date of the leave.',
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'approved', 'rejected', 'canceled']],
        },
        comment: 'The status of the leave request.',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'The reason for the leave request.',
        validate: {
          notEmpty: { msg: 'Please provide a reason for the leave' },
          len: [1, 500], // Length should be between 1 and 500 characters
        },
      },
      approved_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'peoples',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        comment: 'Foreign key referencing the person who approved the leave.',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the leave request was created.',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the leave request was last updated.',
      },
    },
    {
      sequelize,
      modelName: 'leave_managements',
      tableName: 'leave_managements',
      timestamps: true, // Enable automatic creation and updating of timestamps
    }
  );

  return leave_managements;
};
