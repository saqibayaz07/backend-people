'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class field_configurations extends Model {
    
    // Each FieldConfiguration belongs to an Industry
    static associate(models) {
      this.belongsTo(models.industries, {
        foreignKey: 'industry_id', // Foreign key in FieldConfigurations table
        as: 'fieldConfigurations', // Alias for the relationship
        onDelete: 'CASCADE', // When a field configuration is deleted, its associated industry is not deleted
      });
    }
  }

  field_configurations.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the field configuration (UUID)',
      },
      industry_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'industries', // Reference to the industries table
          key: 'id', // Column to reference in industries table
        },
        comment: 'Foreign key referencing the industry this field configuration is associated with',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Name of the field configuration',
      },
      type: {
        type: DataTypes.ENUM('string', 'integer', 'json'),
        allowNull: false,
        comment: 'Type of the field configuration (string, integer, or json)',
      },
      is_required: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: 'Indicates whether this field is required',
      },
      is_visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: 'Indicates whether this field is visible',
      },
    },
    {
      sequelize,
      modelName: 'field_configurations',
      tableName: 'field_configurations',
      timestamps: true, // Sequelize will automatically handle createdAt and updatedAt
    }
  );

  return field_configurations;
};
