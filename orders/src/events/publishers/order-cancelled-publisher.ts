import { OrderCancelledEvent, Publisher, Subjects } from '@ks-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
