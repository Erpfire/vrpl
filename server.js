const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Static files - serve from root directory
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Specific static file routes with longer cache
app.use('/css', express.static(path.join(__dirname, 'css'), { maxAge: '7d' }));
app.use('/js', express.static(path.join(__dirname, 'js'), { maxAge: '7d' }));
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '30d' }));

// API Routes
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Contact form submission endpoint
apiRouter.post('/contact', async (req, res) => {
  try {
    const { name, email, organization, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Log the contact form submission
    console.log('Contact Form Submission:', {
      name,
      email,
      organization: organization || 'N/A',
      phone: phone || 'N/A',
      subject,
      message: message.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });

    // TODO: In production, send email using nodemailer
    // Example nodemailer setup:
    /*
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: email,
      to: 'vrplvns@gmail.com',
      subject: `VRPL Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    */

    // For now, just return success
    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        name,
        email,
        subject
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request'
    });
  }
});

// Newsletter subscription endpoint (for future use)
apiRouter.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    console.log('Newsletter Subscription:', { email, timestamp: new Date().toISOString() });

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while processing your subscription'
    });
  }
});

// Get project stats (for future use - can be dynamic)
apiRouter.get('/stats', (req, res) => {
  res.json({
    wasteDiversion: 95,
    co2Reduction: 31,
    plasmaTemperature: 3000,
    lastUpdated: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api', apiRouter);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/technology', (req, res) => {
  res.sendFile(path.join(__dirname, 'technology.html'));
});

app.get('/phases', (req, res) => {
  res.sendFile(path.join(__dirname, 'phases.html'));
});

app.get('/impact', (req, res) => {
  res.sendFile(path.join(__dirname, 'impact.html'));
});

app.get('/government', (req, res) => {
  res.sendFile(path.join(__dirname, 'government.html'));
});

app.get('/training', (req, res) => {
  res.sendFile(path.join(__dirname, 'training.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// 404 handler - serve custom 404 page or redirect to home
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   VRPL Website Server                                     ║
║   Varanasi Recyclers Private Limited                      ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Timestamp: ${new Date().toISOString()}        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
