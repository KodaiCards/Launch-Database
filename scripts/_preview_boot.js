// Local-only boot shim for the preview tool: load .env, then start the server.
// server.js doesn't auto-load dotenv (prod injects env), so this lets the
// preview launcher run the real app with DATABASE_URL etc. Not used in prod.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'preview-dev-secret';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'preview-dummy';
// Bind app directly (routes register at module load). Skips start()'s long
// remote-DB bootstrap — the DB is already migrated — so the port opens fast.
const { app } = require('../server.js');
app.listen(3000, () => console.log('preview app listening on 3000'));
