export default interface EventInterface {
  id: number;
  familyId: number;
  createdBy: number;
  createdAt: Date;
  title: string;
  details?: string;
  eventDate: Date;
}

export interface CalendarEventsData {
  prev: Record<number, Record<number, EventInterface>>;
  current: Record<number, Record<number, EventInterface>>;
  next: Record<number, Record<number, EventInterface>>;
}
