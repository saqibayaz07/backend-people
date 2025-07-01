'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class peoples extends Model {

    static associate(models) {

      // // One-to-one relationship with SecurityPeopleExtensions
      this.hasOne(models.security_people_extensions, {
        foreignKey: 'people_id', // Foreign key in SecurityPeopleExtensions table
        as: 'people_security', // Alias for the association
        onDelete: 'CASCADE',
      });

      // // One-to-one relationship with Departments
      this.hasOne(models.departments, {
        foreignKey: 'manager_id', // Foreign key in Departments table
        as: 'dept_manager', // Alias for the association
        onDelete: 'SET NULL',
      });

      // // One-to-one association: Peoples has one LeaveManagement (approved_by)
      this.hasOne(models.leave_managements, {
        foreignKey: 'approved_by',  // Foreign key in leave_managements table
        as: 'leaveManagementApproval',  // Alias for the relationship
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      // // One-to-many relationship with Attendances
      this.hasMany(models.attendances, {
        foreignKey: 'people_id', // Foreign key in Attendances table
        as: 'person_attendence', // Alias for the relationship
        onDelete: 'CASCADE',
      });

      // // One-to-many relationship with Trainings
      this.hasMany(models.trainings, {
        foreignKey: 'people_id', // Foreign key in Trainings table
        as: 'trainings',         // Alias for the relationship
        onDelete: 'CASCADE',
      });

      // // One-to-many relationship with Payrolls
      this.hasMany(models.payrolls, {
        foreignKey: 'people_id', // Foreign key in Payrolls table
        as: 'payrolls',         // Alias for the relationship
        onDelete: 'CASCADE',
      });

      // // One-to-many relationship with Payrolls
      this.hasMany(models.sites, {
        foreignKey: 'manager_id', // Foreign key in Payrolls table
        as: 'site_manager',         // Alias for the relationship
        onDelete: 'SET NULL',
      });

      // // One-to-many relationship with Payrolls
      this.hasMany(models.site_assignments, {
        foreignKey: 'people_id', // Foreign key in Payrolls table
        as: 'site_assigner',         // Alias for the relationship
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      // // One-to-many relationship with Tasks 
      this.hasMany(models.tasks, {
        foreignKey: 'assignee_id', // Foreign key in Tasks table
        as : 'task_assignee', // Alias for the relationship
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      })

      // // One-to-many relationship with LeaveManagements
      this.hasMany(models.leave_managements, {
        foreignKey: 'people_id', // Foreign key in LeaveManagements table
        as: 'leavePerson', // Alias for the  relationship
        onDelete: 'CASCADE',
      });

      // // realtionship of department_id to departments table
      // // this.belongsTo(models.departments, {
      // //   foreignKey: 'department_id', // Foreign key in Peoples table
      // //   as: 'dept_manager', // Alias for the relationship
      // //   onDelete: 'SET NULL', // When a Peoples record is deleted, set department_id to NULL in Departments
      // //   onUpdate: 'CASCADE',  // Cascade update of department_id if the Peoples record is updated
      // // });

      // // relationship of people_id to people_address_histories table 
      this.hasMany(models.people_address_histories, {
        foreignKey: 'people_id', // Foreign key in Peoples table
        as: 'address_owner',     // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.hasMany(models.people_background_checks, {
        foreignKey: 'people_id', // Foreign key in Background Checks table
        as: 'background_check_owner', // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      this.hasMany(models.people_bank_details, {
        foreignKey: 'people_id', // Foreign key in Peoples table
        as: 'bank_owner_details', // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // relationship of people_id to educations table 
      this.hasMany(models.people_educations, {
        foreignKey: 'people_id', // Foreign key in Peoples table
        as: 'education_owner', // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.hasMany(models.people_emergency_contacts, {
        foreignKey: 'people_id', // Foreign key in Emergency Contacts table
        as: 'emergency_contact_owner', // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // relationship of people_id to people_employment_histories table
      this.hasMany(models.people_employment_histories, {
        foreignKey: 'people_id', // Foreign key in Peoples table
        as: 'employee_history_details', // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // relationship of people_id to leave_balances table
      this.hasMany(models.people_leave_balances, {
        foreignKey: 'people_id', // Foreign key in Peoples table
        as: 'leave_owner',      // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // // relationship of people_id to next_of_kins table
      this.hasMany(models.people_next_of_kins, {
        foreignKey: 'people_id', // Foreign key in Peoples table
        as: 'next_of_kin_owner',  // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.hasMany(models.people_performance_reviews, {
        foreignKey: 'people_id', // Foreign key in Performance Review table
        as: 'employee_reviews',  // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.hasMany(models.people_social_accounts, {
        foreignKey: 'people_id', // Foreign key in Performance Review table
        as: 'social_account_owner',  // Alias for the relationship
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  peoples.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the person. Auto-generated UUID value.',
      },
      // contact_id: {
      //   type: DataTypes.UUID,
      //   allowNull: true,  // Contact is optional
      //   comment: 'Foreign key referencing the global Contacts Table (id).',
      // },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      middle_name: {
        type: DataTypes.STRING(100),
      },
      last_name: {
        type: DataTypes.STRING(100),
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',  // Default empty string if name is not provided
        comment: 'Full name of the person.',
        // set(value) {
        //   this.setDataValue('name', value.trim());
        // },
      },

      gender: {
        type: DataTypes.STRING(25),
        allowNull: false,
        defaultValue: 'male',
        validate: {
          isIn: [['male', 'female', 'non-binary', 'prefer-not']],  // Limit values to specified genders
        },
        comment: 'Gender of the person.',
      },
      
      // Other columns here as per the previous model
      date_of_birth: {
        type: DataTypes.STRING(100),
        allowNull: true, // You can change it to false if it's required
        comment: 'The date of birth of the person.',
      },
      marital_status: {
        type: DataTypes.ENUM('single', 'married', 'divorced', 'widowed'),
        allowNull: true, // You can change it to false if it's required
        comment: 'The marital status of the person.',
      },

      nationality: {
        type: DataTypes.STRING(800),
        allowNull: true, // You can change it to false if it's required
        comment: 'The nationality of the person.',
      },
      preferred_language: {
        type: DataTypes.STRING(100),
        defaultValue: 'English', // Default value is English
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(800),
      },
      base_currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'PKR', // Default value is PKR
        allowNull: true,
      },
      timezone: {
        type: DataTypes.STRING(50),
        defaultValue: 'Asia/Karachi', // Default value is Asia/Karachi
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      work_email: {
        type: DataTypes.STRING(100),
      },
      mobile_number: {
        type: DataTypes.STRING(20),
      },
      worker_type: {
        type: DataTypes.STRING(50),
        allowNull: true, // Can be null if not provided
      },
      // two titles mr and mrs
      title: {
        type: DataTypes.ENUM,
        values: ['mr', 'mrs'],
        allowNull: true,
        defaultValue: 'mr',
      },
      // New fields
      org_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: true, // Can be null if not provided
      },
      org_group: {
        type: DataTypes.STRING(100),
        allowNull: true, // Can be null if not provided
      },
      org_position: {
        type: DataTypes.STRING(100),
        allowNull: true, // Can be null if not provided
      },
      work_id: {
        type: DataTypes.STRING(50),
        allowNull: true, // Can be null if not provided
      },
      job_title: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Job title or position of the employee.',
      },
      seniority_level: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'junior',
      },
      work_location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'on-site',
        validate: {
          isIn: [['remote', 'on-site', 'hybrid']],
        },
        comment: 'Work location (remote, on-site, hybrid).',
      },

      department_id: {
        type: DataTypes.UUID,
        // references: {
        //   model: 'departments',
        //   key: 'id',
        // },
        allowNull: true,  // Department ID is optional
        comment: 'Foreign key referencing the department (nullable).',
      },

      direct_report: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reporting_manager_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Foreign key referencing the reporting manager\'s ID.',
        set: function (value) {
          if (value) {
            // this.setDataValue('reporting_manager_id', value.trim());
            this.setDataValue('reporting_manager_id', null);
          }
        }
      },
      worker_id: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Worker ID of the employee.',
      },
      employment_type: {
        type: DataTypes.STRING(25),
        allowNull: false,
        defaultValue: 'full-time',
        validate: {
          isIn: [['full-time', 'part-time', 'contractor', 'intern']],  // Limit values to specified employment types
        },
        comment: 'Employment type (full-time, part-time, contractor, intern).',
      },
      contract_start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Contract start date.',
      },

      contract_end_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Contract end date.',
      },

      salary: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Salary of the person.',
      },

      payment_frequency: {
        type: DataTypes.ENUM,
        values: ['monthly', 'yearly', 'weekly', 'daily', 'fortnightly'],
        allowNull: true,
        defaultValue: 'monthly',
        comment: 'Payment frequency of the employee.',
      },

      payment_method: {
        type: DataTypes.ENUM,
        values: ['cash', 'bank'],
        allowNull: true,
        defaultValue: 'cash',
      },


      /* ************************************************************************************************************************************
      ************************************************************************************************************************************
      ************************************************************************************************************************************
      ************************************************************************************************************************************
      ************************************************************************************************************************************ */



      country_iso_code: {
        type: DataTypes.STRING(5),
        defaultValue: 'PK', // Default value is PK (Pakistan)
      },

      profile_picture: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'URL to the profile picture of the person.',
      },
      employment_status: {
        type: DataTypes.STRING(25),
        allowNull: false,
        defaultValue: 'inactive',
        validate: {
          isIn: [['active', 'inactive', 'terminated', 'leave']],  // Limit values to specified employment statuses
        },
        comment: 'Employment status of the person.',
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the record was last updated.',
      },
      hire_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date when the person was hired.',
      },

      termination_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Termination date if applicable (nullable).',
      },


      // New Fields Added
      salary_currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'PKR',
        comment: 'Currency of the salary.',
      },

      hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Hourly rate of the person.',
      },

      position_start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Start date of the person\'s position.',
      },

      position_end_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'End date of the person\'s position.',
      },

      shift_preferences: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'day',
        validate: {
          isIn: [['day', 'night', 'flexible']],
        },
        comment: 'Preferred shift (day, night, flexible).',
      },

      contract_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'temporary',
        validate: {
          isIn: [['permanent', 'fixed-term', 'temporary', 'zero-hours']],
        },
        comment: 'Type of contract (permanent, fixed-term, temporary, zero-hours).',
      },

      probation_end_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Probation end date (nullable).',
      },

      employee_id_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Employee ID number.',
      },

      work_permit_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'not-required',
        validate: {
          isIn: [['not-required', 'pending', 'approved', 'expired']],
        },
        comment: 'Work permit status (not-required, pending, approved, expired).',
      },
    },
    {
      sequelize,
      modelName: 'peoples',
      tableName: 'peoples',
      timestamps: false, // Set to false because timestamps are manually managed (updated_at).
      // underscored: true, // Use snake_case column names (optional).
    }
  );

  return peoples;
};