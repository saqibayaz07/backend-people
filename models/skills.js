'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class skills extends Model {
    // No associations are included at this point, relations can be added later
    static associate(models) {
       // A skill can be associated with many job positions through JobSkills
       this.hasMany(models.job_skills, {
        foreignKey: 'skills_id',
        as: 'skill_jobskills', // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

    }
  }

  skills.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Use skill_id as the primary key
        comment: 'Unique skill identifier (UUID)',
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false, // Skill name is required
        comment: 'Name of the skill',
        set(value) {
          this.setDataValue("name", value.trim());
        },
        validate: {
          notEmpty: { msg: 'Skill name cannot be empty' },
          len: [1, 200], // Length should be between 1 and 200 characters
        },
      },
      description: {
        type: DataTypes.TEXT,
        // allowNull: false, // Description is required
        comment: 'Description of the skill',
        validate: {
          notEmpty: { msg: 'Description cannot be empty' },
        },
      },
      category: {
        type: DataTypes.STRING(200),
        // allowNull: false, // Category is required
        comment: 'Category of the skill',
        set(value) {
          this.setDataValue("category", value.trim());
        },
        validate: {
          notEmpty: { msg: 'Skill category cannot be empty' },
          len: [1, 200], // Length should be between 1 and 200 characters
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the record was created',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'skills',
      tableName: 'skills',
      timestamps: true, // Enable Sequelize's automatic handling of createdAt and updatedAt
    }
  );

  return skills;
};
