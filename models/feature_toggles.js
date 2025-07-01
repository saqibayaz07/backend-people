'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class feature_toggles extends Model {
    static associate(models) {
      // One-to-many relationship with Industries
      this.belongsTo(models.industries, {
        foreignKey: 'industry_id',
        as: 'featureToggles', // Alias for the relationship
      });
    }
  }

  feature_toggles.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the feature toggle (UUID)',
      },
      industry_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'industries', // Reference to the industries table
          key: 'id', // Column to reference in industries table
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',

        comment: 'Foreign key referencing the industry this toggle is associated with',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Name of the feature toggle',
      },
      is_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: 'Indicates whether the feature is enabled or not',
      },
    },
    {
      sequelize,
      modelName: 'feature_toggles',
      tableName: 'feature_toggles',
      timestamps: false,  // Set to false if you don't want Sequelize to automatically manage createdAt/updatedAt
    }
  );

  return feature_toggles;
};
