const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Proxy middleware for external sites
app.use('/proxy', createProxyMiddleware({
  target: 'http://example.com', // This will be dynamically changed
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add headers if needed
    proxyReq.setHeader('Referer', req.query.referer || 'https://www.google.com');
  }
}));

// Routes
app.get('/', (req, res) => {
  res.render('index', { activeTab: 'newtab', tabs: [{id: 'newtab', title: 'New Tab'}] });
});

app.get('/newtab', (req, res) => {
  res.render('newtab');
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
