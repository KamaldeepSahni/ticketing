import mongoose from 'mongoose';

import { app } from './app';

const PORT = process.env.PORT || 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database successfully');
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  });
};

start();
