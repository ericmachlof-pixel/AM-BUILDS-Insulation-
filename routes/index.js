const express  = require('express');
const router   = express.Router();
const supabase = require('../lib/supabase');

// Static fallback — always shown if Supabase is not configured
const FALLBACK_TESTIMONIALS = [
  { author_name: 'Jessica M.',  location: 'San Jose, CA',       stars: 5, quote: 'Insulara transformed our attic. Energy bills dropped by 30% the first month. Their rat proofing sealed every entry point we didn\'t even know existed.' },
  { author_name: 'David R.',    location: 'Los Angeles, CA',    stars: 5, quote: 'Professional, fast, and incredibly thorough. They documented everything with photos before and after. Our crawlspace looks brand new.' },
  { author_name: 'Sandra K.',   location: 'Pasadena, CA',       stars: 5, quote: 'Had a severe rat infestation. Insulara came in, sealed 23 entry points, cleaned the attic, and installed new insulation. Zero rodent issues since.' },
  { author_name: 'Michael T.',  location: 'Pasadena, CA',       stars: 5, quote: 'I\'ve hired three insulation companies over the years. Insulara is the only one that actually did what they promised, on time, and under budget.' },
  { author_name: 'Priya L.',    location: 'Burbank, CA',        stars: 5, quote: 'The spray foam in our garage has been a game changer. It\'s warmer in winter, cooler in summer, and completely quiet. Best home investment we\'ve made.' },
  { author_name: 'Robert C.',   location: 'Long Beach, CA',     stars: 5, quote: 'Called Insulara after finding rat droppings in my attic. They came out the next day, sealed everything up, removed the old insulation, and put in new. Haven\'t seen a single sign of rodents since.' },
  { author_name: 'Karen L.',    location: 'Thousand Oaks, CA',  stars: 5, quote: 'Our energy bills were through the roof every summer. Insulara did a full attic insulation job and we saw a 40% drop on our next bill. Wish we had done it sooner.' },
  { author_name: 'Tony B.',     location: 'Glendale, CA',       stars: 5, quote: 'These guys are the real deal. On time, clean, professional. They explained everything before starting and left the place spotless. The crawlspace encapsulation looks like new construction.' },
  { author_name: 'Maria G.',    location: 'Santa Monica, CA',   stars: 5, quote: 'Had three other companies quote us. Insulara was thorough, honest, and didn\'t try to oversell. The spray foam in our walls has made a huge difference — the house is so much quieter too.' },
  { author_name: 'James W.',    location: 'Torrance, CA',       stars: 5, quote: 'I manage several rental properties and Insulara is now my go-to for all of them. Fast turnaround, quality work, and the tenants always notice the difference in comfort.' },
  { author_name: 'Diane F.',    location: 'Burbank, CA',        stars: 5, quote: 'The team found 11 entry points we didn\'t even know existed. Sealed every one and decontaminated the whole attic. Professional from start to finish and worth every penny.' },
  { author_name: 'Chris M.',    location: 'Irvine, CA',         stars: 5, quote: 'Bought a house that turned out to have a serious rat problem. Insulara handled everything — exclusion, cleanup, and full insulation replacement. House feels brand new inside.' },
];

// Home
router.get('/', async (req, res) => {
  let testimonials = FALLBACK_TESTIMONIALS;

  if (supabase) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, author_name, location, quote, stars')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase testimonials error:', error.message);
    } else if (data && data.length > 0) {
      testimonials = data;
    }
  }

  res.render('index', {
    page:         'home',
    title:        'Insulara — California Insulation & Rat Proofing Experts',
    description:  'Insulara provides premium insulation and rodent exclusion services across Los Angeles County. Licensed, certified, trusted. Get a free inspection today.',
    ogImage:      '/img/og-home.jpg',
    testimonials,
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
    description: 'Schedule your free inspection with Insulara. We serve all of Los Angeles County. Call or fill out our quick form.',
    ogImage:     '/img/og-contact.jpg',
  });
});

module.exports = router;
