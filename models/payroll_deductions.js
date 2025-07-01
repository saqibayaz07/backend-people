'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class payroll_deductions extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each deduction belongs to one person (peoples)
      this.belongsTo(models.payrolls, {
        foreignKey: 'payroll_id', // Foreign key in payroll_deductions table
        as: 'deduction_payroll',   // Alias for the relationship
        onDelete: 'CASCADE',     // Delete deduction if the corresponding people record is deleted
        onUpdate: 'CASCADE',     // Cascade update if the peoples record is updated
      });
    }
  }

  payroll_deductions.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
        primaryKey: true, // Use id as the primary key
      },
      payroll_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'payrolls', // Name of the model (table) to reference
          key: 'id',        // Key to reference in the peoples table
        },
        onDelete: 'CASCADE', // Delete deduction if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      deduction_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      deduction_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deduction_frequency: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Payroll Deduction record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Payroll Deduction record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'payroll_deductions',
      tableName: 'payroll_deductions',
      underscored: true, // Use snake_case for columns in the table
      timestamps: true, // Set to false as we are managing the created_at and updated_at manually
    }
  );

  return payroll_deductions;
};