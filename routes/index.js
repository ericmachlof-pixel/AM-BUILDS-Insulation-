const express  = require('express');
const router   = express.Router();
const supabase = require('../lib/supabase');

// Home — testimonials pulled live from Supabase
router.get('/', async (req, res) => {
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('id, author_name, location, quote, stars')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Supabase testimonials error:', error.message);
  }

  res.render('index', {
    page:         'home',
    title:        'Insulara — California Insulation & Rat Proofing Experts',
    description:  'Insulara provides premium insulation and rodent exclusion services across California. Bay Area & Greater LA. Get a free inspection today.',
    ogImage:      '/img/og-home.jpg',
    testimonials: testimonials || [],
  });
});

router.get('/services', (req, res) => {
  res.render('services', {
    page:        'services',
    title:       'Our Services — Insulation & Rat Proofing | Insulara',
    description: 'Expert insulation (attic, wall, crawlspace, spray foam) and complete rodent exclusion services across California. Licensed, certified, trusted.',
    ogImage:     '/img/og-services.jpg',
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    page:        'about',
    title:       "About Insulara — California's Premier Insulation Specialists",
    description: 'Learn about Insulara — our story, certifications, and the team delivering world-class insulation and rat proofing across California.',
    ogImage:     '/img/og-about.jpg',
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    page:        'contact',
    title:       'Contact Insulara — Free Inspection',
    description: 'Schedule your free inspection with Insulara. We serve the Bay Area and Greater Los Angeles. Call or fill out our quick form.',
    ogImage:     '/img/og-contact.jpg',
  });
});

module.exports = router;
