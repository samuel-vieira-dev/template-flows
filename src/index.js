import express from 'express';
import routes from './routes/index.js';

const app = express();
const PORT = 4343;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
