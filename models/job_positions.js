'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class job_positions extends Model {

    // Define the relationship here
    static associate(models) {
      // A job position belongs to one department
      this.belongsTo(models.departments, {
        foreignKey: 'department_id', // Foreign key in JobPositions table
        as: 'job_department',            // Alias for the relationship
        onDelete: 'CASCADE',         // When a department is deleted, the related job positions are also deleted
      });

        // A JobPosition can have many JobSkills (many-to-many with Skills)
        this.hasMany(models.job_skills, {
          foreignKey: 'job_positions_id',
          as: 'job_jobskills', // Alias for the relationship
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        });
    }
  }

  job_positions.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Use position_id as the primary key
        comment: 'Unique identifier for the Job Position record.',
      },
      position_title: {
        type: DataTypes.STRING(200),
        allowNull: false, // Position title is required
        comment: 'Title of the job position',
        set(value) {
          this.setDataValue('position_title', value.trim()); // Trim spaces from the title
        },
        validate: {
          notEmpty: { msg: 'Position title cannot be empty' },
          len: [1, 200], // Length should be between 1 and 200 characters
        },
      },
      department_id: {
        type: DataTypes.UUID,
        allowNull: false, // Foreign key is required
        references: {
          model: 'departments', // The target model (Departments)
          key: 'id', // The target key in the Departments table
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: 'Foreign key referencing the department for the job position.',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false, // Description is required
        comment: 'Description of the job position',
        validate: {
          notEmpty: { msg: 'Description cannot be empty' },
        },
      },
      required_skills: {
        type: DataTypes.JSON,
        allowNull: true, // Required skills is mandatory
        comment: 'List of skills required for the position',
      },
      employment_type: {
        type: DataTypes.STRING(25),
        allowNull: false,
        defaultValue: 'full-time',
        validate: {
          isIn: [['full-time', 'part-time', 'contractor', 'intern']],
        },
        comment: 'Type of employment for the position (full-time, part-time, contractor, intern)',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Job Position record was created',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the Job Position record was last updated',
      },
    },
    {
      sequelize,
      modelName: 'job_positions',
      tableName: 'job_positions',
      timestamps: true, // Enable Sequelize's automatic handling of createdAt and updatedAt
    }
  );

  return job_positions;
};
