import { OrderCreatedEvent, Publisher, Subjects } from '@ks-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
