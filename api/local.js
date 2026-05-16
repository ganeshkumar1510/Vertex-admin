import app from './index.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Vertex Local API Server running on port ${PORT}`);
});
