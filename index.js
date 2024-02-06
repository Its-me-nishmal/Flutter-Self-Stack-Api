import express from 'express'
import connect from './database/connect.js'
import color from "colors"
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import apiKey from './middleware/apiKey.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/prodect.js';
import feedbackRoutes from './routes/feedback.js';
import { errorHandler } from './middleware/err.js';
import taskRoutes from './routes/dashboard.js';
import figlet from 'figlet';
import lolcatjs from 'lolcatjs';
import path  from 'path'

lolcatjs.options.seed = Math.random(); 


const app = express();
connect()

app.use(bodyParser.json());
app.use('/api', apiKey);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes)
app.use('/api/products', productRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use(errorHandler);

app.get('/',(req,res)=>{
  const indexPath = new URL('docs/index.html', import.meta.url).pathname;
    res.sendfile(indexPath)
})



const port = process.env.PORT || '8080'
figlet("Running", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(lolcatjs.fromString(data));
  });
app.listen(port, () => {console.log(color.green(`Connecting to port ${port}`))});

export default app;
