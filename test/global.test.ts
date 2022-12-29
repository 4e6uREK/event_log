import app from '../src/app';
import child_process from 'child_process';
import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    afterAll,
    beforeAll,
} from 'vitest';
import { Server } from 'http';

import * as entryTest from './entry';
import mongoose from 'mongoose';

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 5858;

// eslint-disable-next-line sonar/slow-regex
const dbUriRegex = /([a-zA-Z_])+\?/;

let server: Server;

beforeAll(async () => {
    if (!process.env.SKIP_RESTORATION) {
        // eslint-disable-next-line sonar/os-command
        child_process.execSync(
            `mongorestore "${
                process.env.DATABASE_URL
                    ? process.env.DATABASE_URL.replace(dbUriRegex, '?')
                    : 'mongodb://root:root@localhost:27017/?authSource=admin'
            }" dump`,
        );
    }
    await mongoose.connect(
        process.env.DATABASE_URL ??
            'mongodb://root:root@localhost:27017/event_log?authSource=admin',
    );
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    server = app.listen(port);
});

afterEach(async () => {
    server.close();
});

describe('entry coverage tests', async () => {
    let entry: any;

    // [Partial] GET /entry/:id
    it('fetch entry (invalid input)', async () => {
        const response = await entryTest.fetchEntry();

        expect(response.status).toEqual(403);
    });

    it('fetch entry (not exists)', async () => {
        const response = await entryTest.fetchEntry('000000000000000000000000');

        expect(response.status).toEqual(404);
    });

    // POST /entry
    it('create entry (invalid input)', async () => {
        const response = await entryTest.createInvalidEntry();

        expect(response.status).toEqual(400);
    });

    it('create entry (valid input)', async () => {
        const response = await entryTest.createEntry();

        entry = response.body;
        expect(response.status).toEqual(201);
    });

    // [Continued] GET /entry/:id
    it('fetch entry (created)', async () => {
        const response = await entryTest.fetchEntry(entry._id);

        expect(response.status).toEqual(200);
    });

    // NOTE: Delayed delete of entry (~1 min)
    it('delayed delete', async () => {
        let response = await entryTest.createEntry();

        expect(response.status).toEqual(201);
        entry = response.body;

        // Activate entry deletion index
        response = await entryTest.fetchEntry(entry._id);
        expect(response.status).toEqual(200);

        // Wait for 2 mininutes. At this rate entry must be deleted
        // NOTE: we give additional 1 minute for mongodb scheduler activation
        await new Promise((resolve) => setTimeout(resolve, 120_000));
        response = await entryTest.fetchEntry(entry._id);
        expect(response.status).toEqual(404);
    }, 121_000);
});
