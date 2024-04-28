import express from 'express';
import bodyParser from 'body-parser';
import { WellData } from 'well-data';
import { handleHole } from './handlers/hole-handler';

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

app.post('/hole', async (req, res) => {
  const wellData = req.body as WellData;
  const svgString = await handleHole(wellData);
  // Send the SVG as response
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svgString);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
