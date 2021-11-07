import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@ks-tickets/common';

import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create the order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'wfwefwefwe',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // Create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  // call the onMessage function with data and message
  await listener.onMessage(data, msg);

  // write assertions to make sure the order was cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes the order cancelled event', async () => {
  const { listener, data, order, msg } = await setup();

  // call the onMessage function with data and message
  await listener.onMessage(data, msg);

  // write assertions to make sure the publish function is called and gets appropriate params
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with data and message
  await listener.onMessage(data, msg);

  // write assertions to make sure the ack fucntion is called
  expect(msg.ack).toHaveBeenCalled();
});
