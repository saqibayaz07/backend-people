'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_languages extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each language record belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in people_languages table
        as: 'language_owner',    // Alias for the relationship
        onDelete: 'CASCADE',     // Delete the language record if the corresponding person is deleted
        onUpdate: 'CASCADE',     // Cascade update if the peoples record is updated
      });
    }
  }

  people_languages.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Use id as the primary key
        comment: 'Unique identifier for the language record.',
      },
      people_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Foreign key referencing the person for the language record.',
        onDelete: 'CASCADE', // Delete language if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      languages: {
        type: DataTypes.JSON,  // JSON data type to store languages
        allowNull: false,      // Languages field cannot be null
        comment: 'Languages the employee is proficient in.',
      },
    },
    {
      sequelize,
      modelName: 'people_languages', // Model name should match the table name (lowercase plural)
    }
  );

  return people_languages;
};
