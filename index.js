import express from 'express'
import connect from './database/connect.js'
import color from "colors"
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import apiKey from './middleware/apiKey.js';
import userRoutes from './routes/user.js';
import attendencesRoutes from './routes/attendences.js';
import feedbackRoutes from './routes/feedback.js';
import { errorHandler } from './middleware/err.js';
import taskRoutes from './routes/dashboard.js';
import figlet from 'figlet';
import lolcatjs from 'lolcatjs';
import routes from './routes/routes.js';
import cors from 'cors';
import lg from 'lz-git';
import todoRoutes from './routes/todoRoutes.js'
import aboutRoutes from './routes/about.js'
import notificationRoutes from './routes/notification.js';
lg('test ')
console.log("updated")

lolcatjs.options.seed = Math.random(); 


const app = express();
connect()
app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiKey);
app.use('/', routes)
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes)
app.use('/api/feedback', feedbackRoutes);
app.use('/api',attendencesRoutes)
app.use('/api/about',aboutRoutes)
app.use('/api/todo',todoRoutes)
app.use('/api/notification', notificationRoutes);
app.use(errorHandler);




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
