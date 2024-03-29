import { PaymentCreatedEvent, Publisher, Subjects } from '@ks-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
