import dotenv from 'dotenv';
import app, { initApp } from './app';
dotenv.config();

const port = Number(process.env['PORT'] || 3000);

initApp()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to start app', err);
    process.exit(1);
  });
