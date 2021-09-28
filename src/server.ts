import express, { Request, Response, NextFunction } from 'express';
import { TitleValidator } from './validator';
import AppError from './errors/AppError';

const app = express();

app.get('/ping', (req, res) => res.json({ message: "pong" }));

app.get('/boleto/:payload', (req, res) => {
  const { payload } = req.params;
  const numbersRegex = /^\d+$/;

  if (!numbersRegex.test(payload)) {
    throw new AppError('Linha digitável deve possuir apenas números!');
  }

  const payloadValidator = new TitleValidator(payload);

  const expirationDate = payloadValidator.getExpirationDate();
  const amount = payloadValidator.getAmountValue();
  const barCode = payloadValidator.generateBarCode();

  const boletoObj = {
    barCode,
    amount,
    expirationDate,
  };

  return res.json(boletoObj);
})

const SERVER_ERROR = 500;

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    console.log(`${req.method} ${req.url} ${err.statusCode}, error: ${err.message}`);
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.log(`${req.method} ${req.url} ${SERVER_ERROR}, error: ${err.toString()}`);
  return res.status(SERVER_ERROR).json({ message: 'Internal Server Error' });
})

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}` ));
