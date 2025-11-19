# VRPL Website

Corporate website for **Varanasi Recyclers Private Limited (VRPL)** - A government-recognized startup pioneering plasma gasification technology for waste-to-energy conversion.

## Features

- **Bio-Industrial Fusion Design** - Copper, steel, and eco-green color palette
- **Full-Screen Overlay Menu** - Image-on-hover navigation inspired by Redwood Materials
- **Smooth Scroll Sections** - Full-viewport sections with animated transitions
- **Express.js Backend** - REST API for contact forms and future features
- **Responsive Design** - Mobile-first approach for all devices
- **Performance Optimized** - Fast load times with compression and caching
- **Docker Ready** - Containerized for easy deployment on Coolify or any VPS

## Tech Stack

- **Frontend:**
  - HTML5 - Semantic markup
  - CSS3 - Modern features (Grid, Flexbox, Custom Properties)
  - Vanilla JavaScript - ES6+ for interactions

- **Backend:**
  - Node.js 18+ - Runtime environment
  - Express.js - Web server and API framework
  - Helmet - Security headers
  - Compression - Gzip compression
  - CORS - Cross-origin resource sharing

- **Deployment:**
  - Docker - Containerization
  - Docker Compose - Multi-container orchestration
  - Nginx (optional) - Reverse proxy for production
  - Coolify - VPS deployment platform

## Project Structure

```
vrpl/
├── server.js                 # Express.js server
├── package.json              # Node.js dependencies
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose setup
├── nginx-reverse-proxy.conf  # Optional Nginx config
├── .env.example              # Environment variables template
├── index.html                # Home page
├── about.html                # About page
├── technology.html           # Technology page
├── phases.html               # Project phases page
├── impact.html               # Environmental impact page
├── government.html           # Government alignment page
├── training.html             # Training & awareness page
├── contact.html              # Contact page
├── css/                      # Stylesheets
│   ├── reset.css
│   ├── variables.css
│   ├── global.css
│   ├── components.css
│   ├── navigation.css
│   ├── sections.css
│   └── responsive.css
├── js/                       # JavaScript files
│   ├── main.js
│   ├── navigation.js
│   ├── overlay-menu.js
│   ├── scroll-observer.js
│   ├── animations.js
│   └── utils.js
└── assets/                   # Images, icons, textures
    ├── images/
    ├── icons/
    └── textures/
```

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vrpl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your settings (optional for basic usage)

4. **Run development server**
   ```bash
   npm run dev
   ```
   Or for production mode:
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## API Endpoints

The server provides the following API endpoints:

### Health Check
```
GET /api/health
```
Returns server health status

### Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "organization": "Company Name (optional)",
  "phone": "+91 XXXXX XXXXX (optional)",
  "subject": "partnership",
  "message": "Your message here"
}
```

### Newsletter Subscription
```
POST /api/subscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Statistics
```
GET /api/stats
```
Returns current project statistics

## Docker Deployment

### Build and Run with Docker

1. **Build the image**
   ```bash
   docker build -t vrpl-website .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 --name vrpl-website vrpl-website
   ```

### Using Docker Compose

1. **Start services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

### With Nginx Reverse Proxy

If you want to use Nginx in front of Express.js (for SSL, caching, etc.):

1. **Edit docker-compose.yml** - Uncomment the nginx service
2. **Configure SSL certificates** (if needed)
3. **Start services**
   ```bash
   docker-compose up -d
   ```

## Coolify Deployment

### Quick Deploy

1. **Push code to Git repository** (GitHub, GitLab, etc.)

2. **In Coolify dashboard:**
   - Create new project
   - Connect your Git repository
   - Select "Docker" as deployment type
   - Coolify will auto-detect the Dockerfile
   - Set environment variables (optional)
   - Configure domain name
   - Deploy!

3. **Coolify will automatically:**
   - Build the Docker image
   - Deploy the container
   - Set up SSL certificate (if domain configured)
   - Handle health checks
   - Enable auto-deployments on git push

### Environment Variables in Coolify

Add these in Coolify dashboard (optional):

```
NODE_ENV=production
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

## Email Configuration

To enable contact form email notifications:

1. **For Gmail:**
   - Enable 2-factor authentication
   - Generate an app-specific password
   - Add to `.env` or Coolify environment:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-app-specific-password
     ```

2. **Update server.js:**
   - Uncomment the nodemailer code in the `/api/contact` endpoint (around line 83)
   - Restart the server

## Content Structure

- **Home** - Hero, vision, benefits, CTA
- **About** - Company profile, founder, mission alignment
- **Technology** - Plasma gasification process, efficiency, safety
- **Project Phases** - Phase 1 (Electricity), Phase 2 (Hydrogen)
- **Environmental Impact** - LCA results, AQI improvement, advantages
- **Government Alignment** - Policies, certifications, compliance
- **Training & Awareness** - Programs, workshops, partnerships
- **Contact** - Form and contact information

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: 90+
- Gzip compression enabled
- Static asset caching
- Image lazy loading

## Security Features

- Helmet.js security headers
- CORS configuration
- Input validation
- Non-root Docker user
- Environment variable protection

## Development Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run docker:build   # Build Docker image
npm run docker:run     # Start with Docker Compose
npm run docker:stop    # Stop Docker containers
```

## Troubleshooting

### Port already in use
If port 3000 is already in use, change it in `.env`:
```
PORT=3001
```

### Docker build fails
Make sure you have the latest Docker version:
```bash
docker --version
```

### Contact form not sending emails
1. Check environment variables are set correctly
2. Verify nodemailer code is uncommented in [server.js](server.js:83)
3. Check server logs for errors

### CSS/JS not loading
1. Check file paths in HTML
2. Verify static file middleware in server.js
3. Clear browser cache

## Future Enhancements

- [ ] Database integration for contact submissions
- [ ] Admin dashboard for managing content
- [ ] Blog/News section
- [ ] Multi-language support
- [ ] Advanced analytics integration
- [ ] Real-time chat support
- [ ] PDF brochure downloads

## License

Proprietary - © 2024 Varanasi Recyclers Private Limited

## Contact

- **Email:** vrplvns@gmail.com
- **Location:** Varanasi, Uttar Pradesh, India
- **Status:** DPIIT Certified Startup

## Support

For issues or questions, please contact the development team or open an issue in the repository.

---

**Built with ❤️ for a sustainable future**
