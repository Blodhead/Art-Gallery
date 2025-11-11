import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routers/user.routes';
import parfumeRouter from './routers/parfume.routes';
import Parfume from './models/parfumes';

const app = express();

// ✅ Middleware
// For now allow CORS from all origins to avoid blocking browser requests.
// You can restrict this later by setting FRONTEND_ORIGIN in the environment.
app.use(bodyParser.json());

// Use the simple cors() middleware which will set Access-Control-Allow-Origin.
// If you need to restrict to one origin, set FRONTEND_ORIGIN and we can echo that.
if (process.env.FRONTEND_ORIGIN) {
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN, methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept','Authorization'], credentials: false }));
  app.options('*', cors({ origin: process.env.FRONTEND_ORIGIN }));
} else {
  app.use(cors());
  app.options('*', cors());
}

// Ensure fallback headers are present for any response (keeps behavior consistent)
app.use((req, res, next) => {
  // If cors already set an explicit header, don't overwrite; otherwise allow all.
  if (!res.getHeader('Access-Control-Allow-Origin')) {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || '*');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// ✅ MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://cirkovic33mi_db_user:HRBmcONUutUaZtwv@parfumes.qnan5ol.mongodb.net/Parfumes?retryWrites=true&w=majority&appName=Cluster0&tls=true';

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // avoids infinite hang on bad connection
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// ✅ Routers
const router = express.Router();
router.use('/users', userRouter);
router.use('/parfume', parfumeRouter);

app.use('/', router);

// ✅ Robots.txt - point crawlers to the sitemap
app.get('/robots.txt', (req, res) => {
  const origin = process.env.FRONTEND_ORIGIN || 'https://finestmiris.kesug.com';
  const lines = [
    'User-agent: *',
    'Disallow:',
    `Sitemap: ${origin.replace(/\/$/, '')}/sitemap.xml`
  ];
  res.type('text/plain').send(lines.join('\n'));
});

// ✅ Sitemap - dynamically build sitemap.xml from parfumes
app.get('/sitemap.xml', async (req, res) => {
  try {
    const origin = (process.env.FRONTEND_ORIGIN || 'https://finestmiris.kesug.com').replace(/\/$/, '');
    // fetch parfumes (only name required for now)
    const parfumes = await Parfume.find({}, { name: 1 }).lean().exec();

    const urls: string[] = [];
    // always include root and a few important static pages
    urls.push(`${origin}/`);
    urls.push(`${origin}/shippment`);
    urls.push(`${origin}/login`);
    urls.push(`${origin}/register`);

    parfumes.forEach((p: any) => {
      if (!p || !p.name) return;
      // Use a query param for the details page (frontend reads from localStorage so param is best-effort)
      const nameParam = encodeURIComponent(p.name);
      urls.push(`${origin}/details?name=${nameParam}`);
    });

    const lastmod = new Date().toISOString();

    const urlset = urls
      .map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;
    res.type('application/xml').send(xml);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// ✅ Health check route (important for Render)
app.get('/', (req, res) => {
  res.send('✅ Backend is running successfully!');
});

// ✅ Dynamic port for Render
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
