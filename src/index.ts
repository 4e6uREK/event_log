import mongoose from 'mongoose';
import app from './app';
import elog from './log';

import swaggerDocs from './swagger';

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 5858;
const host = process.env.HOST ?? '0.0.0.0';

mongoose.connect(
    process.env.DATABASE_URL ??
        'mongodb://root:root@localhost:27017/event_log?authSource=admin',
);

app.listen(port, host, async () => {
    elog.logStartup('Event Log', host, port);
    swaggerDocs(app, port);
});
