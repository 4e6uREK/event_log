import express, { Request, Response } from 'express';
import validateId from '../middleware/validate-id';
import Entry from './model/entry';
import { MongooseError } from 'mongoose';
import elog from '../log';

const entry = express.Router();
const day = 86_400_000; // Day in milliseconds

entry.use(express.json());

/**
 * @openapi
 * /entry/:id:
 *  get:
 *      tags:
 *      - Entry
 *      summary: Fetches entry
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID of MongoDB object
 *            required: true
 *      description: Fetches entry specified by id. And creates TTL on entry inside database
 *      responses:
 *          200:
 *              description: Entry found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetEntryResponse'
 *          404:
 *              description: Entry not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotFound'
 */
entry.get(
    '/:id',
    [validateId],
    async (request: Request, response: Response) => {
        // eslint-disable-next-line sonar/no-invalid-await
        const entry = await Entry.findOneAndUpdate(
            { _id: request.params.id },
            {
                expireAt: new Date(
                    new Date().getTime() +
                        (process.env.EVENT_LOG_DELAY
                            ? Number.parseInt(process.env.EVENT_LOG_DELAY)
                            : day),
                ),
            },
            {
                projection: {
                    _id: 1,
                    data: 1,
                },
            },
        );
        if (!entry) {
            return response.status(404).send({ message: 'entry not found' });
        }

        return response.send(entry);
    },
);

/**
 * @openapi
 * /entry:
 *  post:
 *      tags:
 *      - Entry
 *      summary: Creates entry
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateEntryRequest'
 *      responses:
 *          201:
 *              description: Entry created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateEntryResponse'
 *          400:
 *              description: Client side error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ClientSideError'
 */
entry.post('/', async (request: Request, response: Response) => {
    const entry = new Entry({
        data: request.body.data,
    });

    try {
        const newEntry = await entry.save();
        return response.status(201).json(newEntry);
    } catch (err) {
        elog.logInvalidInput(request);
        return response
            .status(400)
            .json({ message: (err as MongooseError).message });
    }
});

export default entry;
