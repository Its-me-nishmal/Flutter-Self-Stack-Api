import express from 'express'
import connect from './database/connect.js'
import color from "colors"
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import apiKey from './middleware/apiKey.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/prodect.js';
import { errorHandler } from './middleware/err.js'

const app = express();
connect()

app.use(bodyParser.json());
app.use('/api', apiKey);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use(errorHandler);

app.get('/',(req,res)=>{
    res.status(200).json({'sucsess':"working"})
})



const port = process.env.PORT || '8080'
app.listen(port, () => {console.log(color.green(`Connecting to port ${port}`))});

export default app;
