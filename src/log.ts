import logger from 'pino';
import dayjs from 'dayjs';
import { Request } from 'express';

export const pino = logger({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format('HH:mm:ss.SSS')}"`,
});

class Log {
    public logStartup(name: string, host: string, port: number) {
        pino.info(`-----[Starting ${name} Service]-----`);
        pino.info(`Server listening on port http://${host}:${port}`);
    }

    public logAccess(request: Request) {
        pino.info(`[${request.method}] ${request.originalUrl} access`);
    }

    public logInvalidInput(request: Request) {
        pino.info(`[${request.method}] ${request.originalUrl} invalid input`);
    }

    public logDocs(port: number) {
        pino.info(`Docs available at http://localhost:${port}/docs`);
    }
}

const elog = new Log();

export default elog;
