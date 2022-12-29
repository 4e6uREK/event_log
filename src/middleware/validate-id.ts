import { isMongoId } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import elog from '../log';

export default async function validateId(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    if (request.params.id == undefined || !isMongoId(request.params.id)) {
        elog.logInvalidInput(request);
        return response.status(403).send();
    }

    next();
}
