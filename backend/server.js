import express from 'express'; 
import cors from 'cors';
import {CrearkMiddleware} from '@clerk/express';
import userRoutes from './user.route.js';


import {ENV} from './config/env.js';
//aqui va la base de datos

const app = express();

app.use(cors());
app.use(express.json());

app.use(CrearkMiddleware());

app.get('/', (req, res) => res.send('Hello from server'));

app.use("/api/users", userRoutes);

const startServer = async() => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log(`Server is up and running on port: ${ENV.PORT}`));
    } catch (error) {
        console.error('Failed to start server', error.message);
        process.exit(1);
    }};

startServer();