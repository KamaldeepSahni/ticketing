import { Publisher, Subjects, TicketUpdatedEvent } from '@ks-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
