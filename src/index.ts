import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config({ path: './config.env' });
}

import { app } from './api';

const port = process.env.PORT || 4000;

app.listen(port, () =>
  console.log(`API available on http://localhost:${port}`)
);
