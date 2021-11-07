import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@ks-tickets/common';
import { stripe } from '../../stripe';

import { app } from '../../app';
import { Order } from '../../models/order';

it('returns a 404 when paying for a order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'efwefwef',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when paying for a order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'efwefwef',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when paying for a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 20,
    status: OrderStatus.Created,
  });
  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'efwefwef',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 1000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    charge => charge.amount === price * 100
  );
  expect(stripeCharge).toBeDefined();
});
