const express = require('express');
const path = require('path');

const app = express();

app.use(
  '/static',
  express.static(path.resolve(__dirname, 'frontend', 'static'))
);

app.use(
  '/components/Payment/Payment.js',
  express.static(
    path.join(__dirname, 'frontend', '/components/Payment/Payment.js')
  )
);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.listen(8080, () => console.log('Server running...'));
