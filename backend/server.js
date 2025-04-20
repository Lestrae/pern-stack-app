import express from 'express';
import helmet, { contentSecurityPolicy } from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import path from 'path';

import productRoutes from './routes/productRoutes.js';
import { arcj } from './lib/arcjet.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use(
  helmet(
  {contentSecurityPolicy: false,}
));
app.use(morgan('dev'));

app.use(async (req, res, next) => {
  try {
    const decision = await arcj.protect(req, {
      requested: 1,
      // specifies that each request consumes 1 token
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ success: false, message: 'Rate limit exceeded'});
      } else if (decision.isBot()) {
        res.status(403).json({ success: false, message: 'Bot Access Denied'});
      } else {
        res.status(403).json({ success: false, message: 'Forbidden'});
      }
      return;
    }
    if (decision.results.some((results) => results.reason.isBot() && results.reason.isSpoofed())) {
      res.status(403).json({ error: 'Spoofed bot detected' });
      return;
    }
    next();
  } catch (error) {
    console.log('Arcjet Error', error);
    next(error)
  }
})

app.use('/api/products', productRoutes);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
}

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('Database connection successful');
  } catch (error){
    console.log('Database connection failed', error);
  }
};

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  });
});
