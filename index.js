import connect from './database/connect.js'
import express from 'express'
const app = express()
import bodyParser from 'body-parser';

connect()
import userRoutes from './routes.js/user.js';
const PORT = 4004

app.use(bodyParser.json());
app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
})

app.use('/api/users', userRoutes);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the Express API
export default app;
