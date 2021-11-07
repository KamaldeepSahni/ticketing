import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@ks-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
