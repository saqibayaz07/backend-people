'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class job_skills extends Model {

    static associate(models) {
      // A JobSkill belongs to a JobPosition and a Skill
      this.belongsTo(models.job_positions, {
        foreignKey: 'job_positions_id',
        as: 'job_jobskills', // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      this.belongsTo(models.skills, {
        foreignKey: 'skills_id',
        as: 'skill_jobskills', // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  job_skills.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Use position_id as the primary key
        comment: 'Unique identifier for the Job SKills relation record.',
      },
      job_positions_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'job_positions', // references JobPositions table
          key: 'id',
        },
        onDelete: 'CASCADE', // If a JobPosition is deleted, remove associated JobSkills
        onUpdate: 'CASCADE', // If JobPosition id is updated, update JobSkills
      },
      skills_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'skills', // references Skills table
          key: 'id',
        },
        onDelete: 'CASCADE', // If a Skill is deleted, remove associated JobSkills
        onUpdate: 'CASCADE', // If Skill id is updated, update JobSkills
      },
    },
    {
      sequelize,
      modelName: 'job_skills',
      tableName: 'job_skills', // Table name
      timestamps: true, // Automatically add createdAt and updatedAt
    }
  );

  return job_skills;
};
