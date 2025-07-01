'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class payrolls extends Model {
    static associate(models) {
      // Belongs to a person (one-to-many from Trainings to Peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id',  // Foreign key in Trainings table
        targetKey: 'id',          // Reference to the id in Peoples table
        as: 'person_payroll',             // Alias for the relationship
      });

      // One-to-many relationship with PayrollDeductions
      this.hasMany(models.payroll_deductions, {
        foreignKey: 'payroll_id', // Foreign key in PayrollDeductions table
        as: 'payroll_deductions', // Alias for the relationship
        onDelete: 'CASCADE', // Cascade deletion of associated deductions
        onUpdate: 'CASCADE', // Cascade update of associated deductions
      });
    }
  }

  payrolls.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the Payroll record.',
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Foreign key referencing the person for the Payroll.',
        references: {
          model: 'peoples',  // The target model (Peoples)
          key: 'id',         // The target key in the Peoples table
        },
        set(value) {
          this.setDataValue('people_id', value); // Allow null or empty value to be set as null
        },
      },
      pay_period_start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Start date of the payroll pay period.',
      },
      pay_period_end: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'End date of the payroll pay period.',
      },
      gross_salary: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        comment: 'Gross salary for the pay period.',
        defaultValue: 0.00,
      },
      deductions: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'List of deductions (e.g., tax, insurance).',
        defaultValue: null
      },
      net_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Net salary after deductions.',
        defaultValue: 0.00,
      },
      payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Date the payroll was paid.',
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Additional remarks regarding the payroll.',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the payroll record was created.',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the payroll record was last updated.',
      },
    },
    {
      sequelize,
      modelName: 'payrolls',
      tableName: 'payrolls',
      timestamps: true,
    }
  );

  return payrolls;
};
