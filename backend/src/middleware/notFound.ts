import { Request, Response, NextFunction } from 'express';

const notFoundError = async (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({message: "such route doesn't exist", status: "Error"});
  next()
}

export default notFoundError;