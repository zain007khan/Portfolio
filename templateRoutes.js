const express = require('express');
const router = express.Router();
const multer = require('multer'); // Add multer for image uploads
const path = require('path'); // For file path handling
const fs = require('fs'); // To check and create directories

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads'); // Define upload directory
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create uploads folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Name the uploaded file uniquely
  },
});

const upload = multer({ storage });

// POST route to upload images for templates
router.post('/upload/:id', upload.single('image'), (req, res) => {
  const template = templates.find(t => t.id == req.params.id); // Find the template by ID
  if (!template) return res.status(404).send({ message: 'Template not found' });

  if (req.file) {
    template.imagePath = `/uploads/${req.file.filename}`; // Save the image path to the template
    res.send({ message: 'Image uploaded successfully', template });
  } else {
    res.status(400).send({ message: 'No file uploaded' });
  }
});

// GET route to serve template images
router.get('/image/:id', (req, res) => {
  const template = templates.find(t => t.id == req.params.id); // Find the template by ID
  if (!template || !template.imagePath) return res.status(404).send({ message: 'Image not found' });

  const imagePath = path.join(__dirname, template.imagePath); // Get the full path to the image
  res.sendFile(imagePath); // Serve the image file
});

let templates = [
  { id: 1, name: "Business Classic", category: "Business", rating: 4.2 },
  { id: 2, name: "Creative Portfolio", category: "Creative", rating: 4.7 }
];

let userSelections = {};
let customizations = {};

router.get('/browse', (req, res) => {
  res.send(templates);
});

router.get('/preview/:id', (req, res) => {
  const template = templates.find(t => t.id == req.params.id);
  template ? res.send(template) : res.status(404).send({ message: "Not found" });
});

router.post('/select', (req, res) => {
  const { userId, templateId } = req.body;
  userSelections[userId] = templateId;
  res.send({ message: `Template ${templateId} selected for user ${userId}` });
});

router.post('/customize', (req, res) => {
  const { userId, text, color, layout } = req.body;
  customizations[userId] = { text, color, layout };
  res.send({ message: 'Customization saved' });
});

router.get('/customized/:userId', (req, res) => {
  const custom = customizations[req.params.userId];
  custom ? res.send(custom) : res.status(404).send({ message: "No customizations found" });
});

router.post('/apply', (req, res) => {
  const { userId } = req.body;
  if (!userSelections[userId]) {
    return res.status(400).send({ message: "Template not selected" });
  }
  res.send({ message: `Template ${userSelections[userId]} applied` });
});

router.post('/rate', (req, res) => {
  const { templateId, rating } = req.body;
  const template = templates.find(t => t.id === templateId);
  if (!template) return res.status(404).send({ message: 'Template not found' });

  template.rating = (template.rating + rating) / 2;
  res.send({ message: 'Rating updated', newRating: template.rating.toFixed(2) });
});

router.get('/download/:id', (req, res) => {
  const template = templates.find(t => t.id == req.params.id);
  if (!template) return res.status(404).send({ message: 'Template not found' });

  res.send({ message: `Template '${template.name}' downloaded.` });
});

module.exports = router;
