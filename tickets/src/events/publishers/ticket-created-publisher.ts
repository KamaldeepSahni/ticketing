import { Publisher, Subjects, TicketCreatedEvent } from '@ks-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
