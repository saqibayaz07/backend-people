'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class trainings extends Model {

    static associate(models) {
      // Belongs to a person (one-to-many from Trainings to Peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id',  // Foreign key in Trainings table
        targetKey: 'id',          // Reference to the id in Peoples table
        as: 'person',             // Alias for the relationship
      });
    }
  }

  trainings.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the training record.',
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Foreign key referencing the person who participated in the training.',
        references: {
          model: 'peoples',  // The target model (Peoples)
          key: 'id',         // The target key in the Peoples table
        },
        set(value) {
          this.setDataValue('people_id', value || null); // Allow null or empty value to be set as null
        },
      },
      training_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Name of the training.',
      },
      training_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'mandatory',
        validate: {
          isIn: [['mandatory', 'optional']],
        },
        comment: 'Type of the training (mandatory or optional).',
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Start date of the training.',
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'End date of the training.',
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'not-started',
        validate: {
          isIn: [['completed', 'progress', 'not-started']],
        },
        comment: 'Status of the training.',
      },
      certification_awarded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the certification was awarded after training completion.',
      },
      trainer: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of the trainer conducting the training.',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the training record was created.',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the training record was last updated.',
      },
    },
    {
      sequelize,
      modelName: 'trainings',
      tableName: 'trainings',
      timestamps: true,
    }
  );

  return trainings;
};
