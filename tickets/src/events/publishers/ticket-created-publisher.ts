import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@srinidhi-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
