'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_educations extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each education record belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in people_educations table
        as: 'education_owner',   // Alias for the relationship
        onDelete: 'CASCADE',     // Delete education record if the corresponding person is deleted
        onUpdate: 'CASCADE',     // Cascade update if the peoples record is updated
      });
    }
  }

  people_educations.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
        primaryKey: true, // Use id as the primary key
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'peoples', // Name of the model (table) to reference
          key: 'id',        // Key to reference in the peoples table
        },
        onDelete: 'CASCADE', // Delete education record if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      qualification_name: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      certification_type: {
        type: DataTypes.ENUM('degree', 'diploma'),
        allowNull: false,
      },
      institution_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      grade_type: {
        type: DataTypes.ENUM('cgpa', 'marks', 'percentage'),
        allowNull: false,
      },
      field_of_study: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      grade_value: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      additional_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the People Education record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the People Education record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'people_educations', // Model name in Sequelize
      tableName: 'people_educations', // Name of the table in the database
      timestamps: true, // Disable timestamps if not needed
      underscored: true, // Use underscores for column names

    }
  );

  return people_educations;
};
