import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@srinidhi-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
