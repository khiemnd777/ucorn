import express from 'express';
import bodyParser from 'body-parser';
import { handleHole } from './handlers/hole-handler';
import { InputValidationError } from './domain/completion';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

app.post('/hole', async (req, res) => {
  const wellData: unknown = req.body;
  try {
    const svgString = handleHole(wellData);
    // Send the SVG as response
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgString);
  } catch (error) {
    if (error instanceof InputValidationError) {
      res.status(400).json({ error: error.message, diagnostics: error.diagnostics });
    } else {
      console.error('Failed to render well schematic:', error);
      res.status(500).json({ error: 'Unable to render well schematic.' });
    }
  }
});

const PORT = 3000;
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
