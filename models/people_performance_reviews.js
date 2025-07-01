'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class people_performance_reviews extends Model {
    // Define the relationship here
    static associate(models) {
      // One-to-many relationship with the Peoples model
      // Each performance review belongs to one person (peoples)
      this.belongsTo(models.peoples, {
        foreignKey: 'people_id', // Foreign key in performance_reviews table
        as: 'employee_reviews',  // Alias for the relationship
        onDelete: 'CASCADE',     // Delete performance review if the corresponding person is deleted
        onUpdate: 'CASCADE',     // Cascade update if the peoples record is updated
      });
    }
  }

  people_performance_reviews.init(
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
        onDelete: 'CASCADE', // Delete performance review if the related person is deleted
        onUpdate: 'CASCADE', // Update the people_id if the corresponding peoples record is updated
      },
      review_date: {
        type: DataTypes.DATE,
        // allowNull: false,
      },
      reviewer_name: {
        type: DataTypes.STRING(255),
        // allowNull: false,
      },
      department: {
        type: DataTypes.STRING(100),
        // allowNull: false,
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        // allowNull: false,
      },
      comments: {
        type: DataTypes.TEXT,
        // allowNull: true,
      },
      strengths: {
        type: DataTypes.TEXT,
        // allowNull: true,
      },
      areas_of_improvement: {
        type: DataTypes.TEXT,
        // allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Background Checks record was created',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Background Checks record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'people_performance_reviews',
      tableName: 'people_performance_reviews',
      timestamps: true, // Automatically add createdAt and updatedAt fields
      underscored: true, // Underscored table name
    }
  );

  return people_performance_reviews;
};
