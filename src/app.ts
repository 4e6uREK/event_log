import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import 'dotenv/config';
import logAccess from './middleware/log-access';

import entry from './entry/route';

const app = express();

const corsOptions = {
    origin: process.env.WEBSITE_URL ?? 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
};

app.disable('x-powered-by');

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(logAccess);

app.use('/entry', entry);

export default app;
