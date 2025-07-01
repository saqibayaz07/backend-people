'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class industries extends Model { // One-to-many relationship with FieldConfigurations

    static associate(models) {
      this.hasMany(models.field_configurations, {
        foreignKey: 'industry_id', // Foreign key in FieldConfigurations table
        as: 'fieldConfigurations', // Alias for the relationship
        onDelete: 'CASCADE', // When an industry is deleted, all associated field configurations will also be deleted
      });

      this.hasMany(models.feature_toggles, {
        foreignKey: 'industry_id', // Foreign key in FeatureToggles table
        as: 'featureToggles', // Alias for the relationship
        onDelete: 'CASCADE', // When an industry is deleted, all associated feature toggles will also be deleted
        onUpdate: 'CASCADE',
      });
    }
  }

  industries.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the industry (UUID)',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Name of the industry',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description of the industry',
      },
      settings: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Settings in JSON format related to the industry',
      },
    },
    {
      sequelize,
      modelName: 'industries',
      tableName: 'industries',
      timestamps: false, // Set to false if you do not want Sequelize to auto-manage timestamps
    }
  );

  return industries;
};