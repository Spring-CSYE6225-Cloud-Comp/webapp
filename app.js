const express = require('express');
const healthRoutes = require('./routes/allRoutes.js');

const app = express();
const PORT = 8080;

app.use(express.json());


// Routes
app.use('/', healthRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports= app;