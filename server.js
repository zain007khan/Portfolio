const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const templateRoutes = require('./templateRoutes'); // Import template routes

const app = express();
// server.js or firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./path-to-your-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com"
});

const db = admin.firestore();
module.exports = db;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files (e.g., template images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/templates', templateRoutes); // Attach templateRoutes to the API path

// Root endpoint for documentation or testing
app.get('/', (req, res) => {
  res.send(`
    <h1>Template API</h1>
    <p>Welcome to the Template API!</p>
    <p>Available endpoints:</p>
    <ul>
      <li><code>GET /api/templates/browse</code>: List all templates</li>
      <li><code>GET /api/templates/preview/:id</code>: Preview a template</li>
      <li><code>POST /api/templates/select</code>: Select a template for a user</li>
      <li><code>POST /api/templates/customize</code>: Customize a template</li>
      <li><code>GET /api/templates/customized/:userId</code>: Get user customizations</li>
      <li><code>POST /api/templates/apply</code>: Apply a selected template</li>
      <li><code>POST /api/templates/rate</code>: Rate a template</li>
      <li><code>GET /api/templates/download/:id</code>: Download a template</li>
    </ul>
    <p>Static files served from:</p>
    <ul>
      <li><code>/public</code>: General static assets</li>
      <li><code>/uploads</code>: Uploaded files</li>
    </ul>
  `);
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).send({ error: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
