const express = require('express');
const app = express();
const connectDB = require('./config/dbConfig');

require('dotenv').config();

const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRoute = require('./routes/usersRoute');
const busesRoute = require('./routes/busesRoute');
const bookingsRoute = require('./routes/bookingsRoute');

app.use('/api/users', usersRoute);
app.use('/api/buses', busesRoute);
app.use('/api/bookings', bookingsRoute);
const path = require('path');

// for build.. 
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
