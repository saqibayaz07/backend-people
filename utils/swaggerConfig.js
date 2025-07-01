const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Bryxo People API",
    version: "1.0.0",
    description: `


      # Welcome to Peoples API Documentation
    
    This documentation provides an overview of the Peoples API, 
    a backend service for managing employee information, departments, roles, and other employee-related data. 
    Here you’ll find details on available endpoints, request/response formats, 
    and other important information to help you interact with the API.

    ## Key Features
    - **Employee Management**: Create, update, delete, and retrieve employee data.
    - **Departments**: Manage departments and assign employees to them.
    - **Roles**: Assign roles to employees for different access levels.
    - **Attendance**: Track employee attendance and work hours.
    - **Payroll**: Manage and process payroll information.

    ## Getting Started
    To begin using the API, make sure to authenticate your requests (if applicable) and set the appropriate headers.

    For additional assistance, contact the [Support Team](mailto:support@bryxo.com).

    `,
    contact: {
      name: "Bryxo Team",
      email: "support@bryxo.com",
    },
  },
  servers: [
    {
      url: "http://api.bryxo.one/people/v1",
      description: "Production Documentation Server",
    },
    {
      url: "http://localhost:8005/people/v1",
      description: "Local Development Server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./routes/peoples/*.js",
    "./routes/departments/*.js",
    "./routes/job_positions/*.js",
    "./routes/tasks/*.js",
    "./routes/people_bank_details/*.js",
    // "./routes/console/introduction/*.js",
    // "./routes/console/organization/*.js",
    // "./routes/console/tenants/*.js",
    // "./routes/console/verifications/*.js",
    // "./routes/console/email/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
