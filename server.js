require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Expose request path to all EJS templates
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Shared site data injected into every render
app.locals.siteData = {
  name: 'Insulara',
  tagline: 'Insulation & Rat Proofing',
  phone: '(888) 555-0142',
  email: 'info@insulara.com',
  address: 'Serving the Bay Area & Greater Los Angeles, California',
  year: new Date().getFullYear(),
  social: {
    instagram: 'https://instagram.com/insulara',
    facebook: 'https://facebook.com/insulara',
    yelp: 'https://yelp.com/biz/insulara-california'
  }
};

// Routes
const indexRouter = require('./routes/index');
const contactRouter = require('./routes/contact');

app.use('/', indexRouter);
app.use('/contact', contactRouter);

// Sitemap
app.get('/sitemap.xml', (req, res) => {
  const base = `https://www.insulara.com`;
  const pages = ['', '/services', '/about', '/contact'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${base}${p}</loc><changefreq>monthly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
});

// Robots
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: https://www.insulara.com/sitemap.xml`);
});

// 404
app.use((req, res) => {
  res.status(404).render('404', {
    page: '404',
    title: '404 — Page Not Found | Insulara',
    description: 'Page not found. Return home and explore Insulara insulation and rat proofing services.',
    ogImage: '/img/og-home.jpg'
  });
});

// Start
app.listen(PORT, () => {
  console.log(`\n🏗  Insulara running → http://localhost:${PORT}\n`);
});
