console.log('Starting debug server...');

try {
  const express = require('express');
  console.log('Express loaded successfully');
  
  const app = express();
  console.log('Express app created');
  
  const PORT = 5001;
  
  app.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Test server is working!' });
  });
  
  console.log('Routes defined');
  
  const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is now listening on port ${PORT}`);
    console.log(`PID: ${process.pid}`);
    console.log('Try: curl http://127.0.0.1:5001/test');
  });
  
  server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
  
  // Keep process alive
  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
  
  // Log every 10 seconds to show the process is still running
  setInterval(() => {
    console.log(`Server still running... ${new Date().toISOString()}`);
  }, 10000);
  
} catch (error) {
  console.error('Error during startup:', error);
  process.exit(1);
}
