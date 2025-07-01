'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class subcontractors extends Model {
    // No associations are included at this point, relations can be added later

    static associate(models) {
      // A subcontractor can have many site assignments
      this.hasMany(models.site_assignments, {
        foreignKey: 'subcontractor_id',
        as: 'sites_contracted_assigned',
        onDelete: 'SET NULL', // When a subcontractor is deleted, delete all related site assignments
        onUpdate: 'CASCADE',  // Cascade update of subcontractor_id if the SiteAssignments record is updated
      });

    }
  }

  subcontractors.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Unique identifier for the subcontractor record.',
      },
      company_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of the subcontracting company.',
        set(value) {
          this.setDataValue('company_name', value.trim());
        },
      },
      contact_person: {
        type: DataTypes.STRING(200),
        // allowNull: false,
        comment: 'Name of the primary contact person at the subcontracting company.',
        set(value) {
          this.setDataValue('contact_person', value.trim());
        },
      },
      phone_number: {
        type: DataTypes.STRING(20),
        // allowNull: false,
        comment: 'Phone number of the subcontractor.',
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          isEmail: { msg: 'Invalid email address' },
        },
        comment: 'Email address of the subcontractor.',
      },
      address_1: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Primary address line for the subcontractor.',
        set(value) {
          this.setDataValue('address_1', value.trim());
        },
      },
      address_2: {
        type: DataTypes.STRING(500),
        // allowNull: true,
        comment: 'Secondary address line for the subcontractor (optional).',
        set(value) {
          this.setDataValue('address_2', value ? value.trim() : null);
        },
      },
      city: {
        type: DataTypes.STRING(200),
        // allowNull: false,
        comment: 'City where the subcontractor is located.',
      },
      state: {
        type: DataTypes.STRING(200),
        // allowNull: false,
        comment: 'State or region where the subcontractor is located.',
      },
      post_code: {
        type: DataTypes.STRING(100),
        // allowNull: false,
        comment: 'Postal code of the subcontractor’s location.',
      },
      country: {
        type: DataTypes.STRING(100),
        // allowNull: false,
        comment: 'Country where the subcontractor is located.',
      },
      services_provided: {
        type: DataTypes.JSON,
        // allowNull: false,
        comment: 'List of services provided by the subcontractor (e.g., electrical, plumbing).',
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'active',
        validate: {
          isIn: [['active', 'inactive']],
        },
        comment: 'Status of the subcontractor (active or inactive).',
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        // allowNull: false,
        defaultValue: 0,
        comment: 'Rating of the subcontractor (out of 5).',
      },
      contract_start_date: {
        type: DataTypes.DATEONLY,
        // allowNull: false,
        comment: 'Start date of the contract with the subcontractor.',
      },
      contract_end_date: {
        type: DataTypes.DATEONLY,
        // allowNull: true,
        comment: 'End date of the contract with the subcontractor (if applicable).',
      },
      compliance_documents: {
        type: DataTypes.JSON,
        // allowNull: false,
        comment: 'List of compliance documents associated with the subcontractor (e.g., licenses, insurance).',
      },
      remarks: {
        type: DataTypes.TEXT,
        // allowNull: false,
        comment: 'Additional remarks regarding the subcontractor.',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the subcontractor record was created.',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the subcontractor record was last updated.',
      },
    },
    {
      sequelize,
      modelName: 'subcontractors',
      tableName: 'subcontractors',
      timestamps: true, // Automatically includes `createdAt` and `updatedAt` fields
    }
  );

  return subcontractors;
};
