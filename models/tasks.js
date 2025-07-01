'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class tasks extends Model {
    // No associations are included at this point, relations can be added later
    static associate(models) {
      // A Task can be associated with many job positions or other related entities
      // Example: this.belongsTo(models.People, { foreignKey: 'assignee_id', as: 'assignee' });

      this.belongsTo(models.peoples, {
        foreignKey: 'assignee_id',
        as: 'task_assignee',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      })
    }
  }

  tasks.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, // Use skill_id as the primary key
        comment: 'Unique task identifier',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Title of the task',

        set(value) {
          this.setDataValue('title', value.trim());
        },
        validate: {
          notEmpty: { msg: 'Task title cannot be empty' },
        },
      },
      assignee_id: {
        type: DataTypes.UUID,

        references: {
          model: 'peoples', // assuming the `People` table exists
          // key: 'task_assignee',
          as: 'task_assignee',
        },
        allowNull: true, // Assignee is optional
        comment: 'ID of the person assigned to the task',
      },
      tag: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'update', 'team'),
        allowNull: true,
        comment: 'Tag categorizing the task',
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Priority level of the task',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description of the task',
      },
      progress: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Progress cannot be less than 0'
          },
          max: {
            args: [100],
            msg: 'Progress cannot be greater than 100'
          }
        },
        comment: 'Progress percentage of the task',
      },
      time_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp of the last update',
      },
      status: {
        type: DataTypes.ENUM('inbox', 'done', 'trash'),
        allowNull: false,
        defaultValue: 'inbox',
        comment: 'Current status of the task (inbox, done, trash)',
      },
      important: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Flag indicating if the task is important',
      },
    },
    {
      sequelize,
      modelName: 'tasks',
      tableName: 'tasks',
      timestamps: true, // Sequelize automatically manages createdAt and updatedAt
      underscored: true, // Use snake_case for column names
      comment: 'Table storing tasks information with status and progress',
    }
  );

  return tasks;
};
