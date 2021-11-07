import { Message } from 'node-nats-streaming';
import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from '@ks-tickets/common';
import { Ticket } from '../../models/ticket';

import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order has reserved
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new NotFoundError();
    }

    // Mark the ticket as not reserved by setting its orderId property to undefined
    ticket.set({ orderId: undefined });

    // Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
