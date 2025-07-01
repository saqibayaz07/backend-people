require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require('./sequelize/index');

// const { sequelize } = require("./models/index");

const Sentry = require("@sentry/node");
require("./utils/instrument.js");
const { sendLog } = require("./utils/GenerateLogs.js");
const { swaggerUi, swaggerSpec } = require("./utils/swaggerConfig.js");


const {
  attendances,
  departments,
  feature_toggles,
  field_configurations,
  industries,
  job_positions,
  job_skills,
  leave_managements,

  peoples,

  payrolls,
  security_people_extensions,
  site_assignments,
  sites,
  skills,
  subcontractors,
  trainings,

  people_leave_balances,
  people_next_of_kins,
  people_bank_details,
  people_address_histories,
  people_employment_histories,
  people_educations,
  people_performance_reviews,
  people_background_checks,
  people_emergency_contacts,
  people_social_accounts,

  tasks,

  payroll_deductions,
  site_shift_details,
} = require("./models");

// ---------------------------------------------------- Routes -------------------------------------------------------------------------------

const peoplesRoutes = require('./routes/peoples/index');
const departmentsRoutes = require('./routes/departments/index');
const skillsRoutes = require('./routes/skills/index');
// const securitiesRoutes = require('./routes/securities/index');
// const attendencesRoutes = require('./routes/attendences/index');
// const leavesRoutes = require('./routes/leaves/index');
const jobPositionsRoutes = require('./routes/job_positions/index');
const bankDetailRoutes = require('./routes/people_bank_details/index');
// const jobSkillsRoutes = require('./routes/jobSkills/index');
// const payrollsRoutes = require('./routes/payrolls/index');
// const trainingsRoutes = require('./routes/trainings/index');
// const sitesRoutes = require('./routes/sites/index');
// const subcontractorsRoutes = require('./routes/subcontractors/index');
// const siteAssignmentsRoutes = require('./routes/site_assignments/index');

const taskRoutes = require('./routes/tasks/index');

// ---------------------------------------------------- Middleware Configuration -------------------------------------------------------------

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use("/notify/notification", require("./routes/mongo/notification"));
connectToDatabase();

// ---------------------------------------------------- swagger integration -------------------------------------------------------------

app.use(
  "/people/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Bryxo People API Documentation",
  })
);

// ---------------------------------------------------- Testing Routes -----------------------------------------------------------------------

app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

app.get("/people", (req, res) => { res.send("Hello from People Backend"); });

// Sentry root route (test endpoint)
// Sentry.setupExpressErrorHandler(app);

/*
// app.use((req, res, next) => {
//     if (req.path.startsWith("/people/v1/api-docs")) {
//         return next();
//     }

//     const requestTime = new Date().toISOString();
//     res.set("Cache-Control", "no-store");

//     res.on("finish", () => {
//         const userId = req.query?.user_id || req.params?.user_id || req.body?.user_id || "Unknown User";

//         let errorType;
//         if (res.statusCode >= 400 && res.statusCode < 500) {
//             errorType = res.statusCode === 404 ? "not_found" : "client_error";
//         } else if (res.statusCode >= 500) {
//             errorType = "server_error";
//         } else {
//             errorType = "none";
//         }

//         const logEntry = {
//             method: req.method,
//             path: req.path,
//             originalUrl: req.originalUrl,
//             statusCode: res.statusCode,
//             userId: userId,
//             timestamp: requestTime,
//             errorType: errorType,
//         };

//         let message, level;
//         if (res.statusCode >= 400 && res.statusCode < 500) {
//             message = `Client Error: ${req.method} ${req.originalUrl} - Status ${res.statusCode}`;
//             level = "warning";
//         } else if (res.statusCode >= 500) {
//             message = `Server Error: ${req.method} ${req.originalUrl} - Status ${res.statusCode}`;
//             level = "error";
//         } else {
//             message = `Request Successful: ${req.method} ${req.originalUrl} - Status ${res.statusCode}`;
//             level = "info";
//         }

//         Sentry.addBreadcrumb({
//             category: "request",
//             message: `${req.method} ${req.originalUrl} - Status ${res.statusCode}`,
//             level: level,
//             data: {
//                 timestamp: requestTime,
//                 userId: userId,
//                 method: req.method,
//                 path: req.originalUrl,
//                 statusCode: res.statusCode,
//             },
//         });

//         if (res.statusCode >= 400) {
//             if (res.statusCode >= 500) {
//                 Sentry.captureException(new Error(message));
//             } else {
//                 Sentry.captureMessage(message, level);
//             }
//         }

//         sendLog(logEntry)
//             .then((data) => {
//                 console.log("Log sent successfully:", data);
//             })
//             .catch((error) => {
//                 console.error("Failed to send log:", error.message);
//             });
//     });

//     next();
// });

*/

// ---------------------------------------------------- People Routes -----------------------------------------------------------------------

app.use('/people/v1/people', peoplesRoutes);
app.use('/people/v1/department', departmentsRoutes);
app.use('/people/v1/skill', skillsRoutes);
// app.use('/people/v1/security', securitiesRoutes);
// app.use('/people/v1/attendance', attendencesRoutes);
// app.use('/people/v1/leave', leavesRoutes);
app.use('/people/v1/job-position', jobPositionsRoutes);
app.use('/people/v1/bank-detail', bankDetailRoutes);
// app.use('/people/v1/job-skill', jobSkillsRoutes);
// app.use('/people/v1/payroll', payrollsRoutes);
// app.use('/people/v1/training', trainingsRoutes);
// app.use('/people/v1/site', sitesRoutes);
// app.use('/people/v1/subcontractor', subcontractorsRoutes);
// app.use('/people/v1/site-assignment', siteAssignmentsRoutes);
app.use('/people/v1/task', taskRoutes);


// ---------------------------------------------------- SYNC TABLES -------------------------------------------------------------------------

/*
// Sync all models that are defined in your application
sequelize.sync({ force: false }) // Set 'force: true' to drop and recreate tables
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
*/

// ---------------------------------------------------- Server  Port -------------------------------------------------------------------------

const port = process.env.PORT || 8005;

app.listen(port, () => {
  console.log(`Server is running perfectly on http://localhost:${port}`);
});

// ---------------------------------------------------- ALTER TABLES -------------------------------------------------------------------------

// async function alterTable() {
//   try {
//     await job_skills.sync({ force: true });
//     console.log("The table for the new model was just (re)created!");
//   } catch (error) {
//     console.error("Error syncing the table:", error.message);
//   }
// }

// alterTable();