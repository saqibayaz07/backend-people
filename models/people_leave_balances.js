'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_leave_balances extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each leave balance belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in leave_balances table
        as: 'leave_owner',      // Alias for the relationship
        onDelete: 'CASCADE',    // Delete the leave balance if the corresponding person is deleted
        onUpdate: 'CASCADE',    // Cascade update if the peoples record is updated
      });
    }
  }

  people_leave_balances.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Use position_id as the primary key
        comment: 'Unique identifier for the leave balance record.',
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        // references: {
        //   model: 'peoples', // Name of the model (table) to reference
        //   key: 'id',        // Key to reference in the peoples table
        // },
        comment: 'Foreign key referencing the person for the leave balance.',
        onDelete: 'CASCADE', // Delete leave balance if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding people's record is updated
      },
      leave_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      total_days: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      used_days: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      remaining_days: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      leave_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: new Date().getFullYear(),
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Job Position record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Job Position record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'people_leave_balances', // Model name
      tableName: 'people_leave_balances', // Corresponding table name
      timestamps: true, // Disables automatic timestamp fields (createdAt, updatedAt)
      underscored: true, // Use snake_case for column names
    }
  );

  return people_leave_balances;
};
