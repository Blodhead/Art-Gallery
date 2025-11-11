import 'zone.js/node';
import express from 'express';
import { join } from 'path';

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist', 'app');

// * NOTE :: leave this as require() since this file is built Dynamically from the CLI
const { ngExpressEngine } = require('@nguniversal/express-engine');
const { AppServerModule } = require('./dist/app/server/main');

app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Serve static files
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
