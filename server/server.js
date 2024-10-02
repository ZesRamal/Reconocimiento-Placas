import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routers/routes.js';

const app = express()
const port = 3000

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', router);

app.get('/', (req, res) => res.send('Hello!'))
app.listen(port, () => console.log(`Server running on ${port}!`))
