import { Request, Response, NextFunction } from 'express';

const notFoundError = async (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
}

export default notFoundError;