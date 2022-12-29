import supertest from 'supertest';
import app from '../src/app';

export async function fetchEntry(id?: string): Promise<supertest.Test> {
    return supertest(app).get(`/entry/${id}`);
}

export async function createInvalidEntry(): Promise<supertest.Test> {
    const entry = {
        dat: 'test',
    };

    return supertest(app).post('/entry').send(entry);
}

export async function createEntry(): Promise<supertest.Test> {
    const entry = {
        data: 'Test',
    };

    return supertest(app).post('/entry').send(entry);
}
