const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node"); // Correct import for ProfilingIntegration



// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DNS_CONFIG || "",
  integrations: [
   nodeProfilingIntegration(), // Profiling integration should now work correctly
  ],
  tracesSampleRate: 1.0, // Adjust sample rate for tracing as needed
  profilesSampleRate: 1.0, // Adjust profiling sample rate as needed
});

// module.exports = Sentry;