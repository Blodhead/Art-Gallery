"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const parfume_routes_1 = __importDefault(require("./routers/parfume.routes"));
const parfumes_1 = __importDefault(require("./models/parfumes"));
const app = (0, express_1.default)();
// ✅ Middleware
// Allow CORS from the frontend. In production you may want to restrict this to your domain(s).
const allowedOrigins = [
    process.env.FRONTEND_ORIGIN || 'https://finestmiris.kesug.com',
    '*'
];
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl)
        if (!origin)
            return callback(null, true);
        // allow if origin is in allowedOrigins or if '*' is present
        if (allowedOrigins.indexOf('*') !== -1 || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: false,
};
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)(corsOptions));
// enable pre-flight across-the-board
app.options('*', (0, cors_1.default)(corsOptions));
// fallback headers for older clients
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI ||
    'mongodb+srv://cirkovic33mi_db_user:HRBmcONUutUaZtwv@parfumes.qnan5ol.mongodb.net/Parfumes?retryWrites=true&w=majority&appName=Cluster0&tls=true';
mongoose_1.default
    .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // avoids infinite hang on bad connection
})
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});
// ✅ Routers
const router = express_1.default.Router();
router.use('/users', user_routes_1.default);
router.use('/parfume', parfume_routes_1.default);
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
app.get('/sitemap.xml', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const origin = (process.env.FRONTEND_ORIGIN || 'https://finestmiris.kesug.com').replace(/\/$/, '');
        // fetch parfumes (only name required for now)
        const parfumes = yield parfumes_1.default.find({}, { name: 1 }).lean().exec();
        const urls = [];
        // always include root and a few important static pages
        urls.push(`${origin}/`);
        urls.push(`${origin}/shippment`);
        urls.push(`${origin}/login`);
        urls.push(`${origin}/register`);
        parfumes.forEach((p) => {
            if (!p || !p.name)
                return;
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
    }
    catch (err) {
        console.error('Error generating sitemap:', err);
        res.status(500).send('Error generating sitemap');
    }
}));
// ✅ Health check route (important for Render)
app.get('/', (req, res) => {
    res.send('✅ Backend is running successfully!');
});
// ✅ Dynamic port for Render
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map