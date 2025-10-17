"use strict";
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
const app = (0, express_1.default)();
// ✅ Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
// ✅ Health check route (important for Render)
app.get('/', (req, res) => {
    res.send('✅ Backend is running successfully!');
});
// ✅ Dynamic port for Render
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map