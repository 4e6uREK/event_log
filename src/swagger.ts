import { Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../package.json';
import elog from './log';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Event Log REST API',
            version,
        },
    },
    apis: [
        `./src/entry/route.ts`,
        `./src/entry/model/entry.ts`,
        `./src/utilitySchemas.ts`,
    ],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app: Express, port: number) => {
    // Swagger page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get('docs.json', (_request: Request, response: Response) => {
        response.setHeader('Content-Type', 'application/json');
        response.send(swaggerSpec);
    });

    elog.logDocs(port);
};

export default swaggerDocs;
