import { Request, Response, NextFunction } from 'express';
import elog from '../log';

const logAccess = async (
    request: Request,
    _response: Response,
    next: NextFunction,
) => {
    elog.logAccess(request);
    next();
};

export default logAccess;
