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
  prev: {
    // this key is the calendar day
    [key: number]: {
      // each day can have multiple events, so this key is the event id
      [key:number]: EventInterface;
    };
  };
  current: {
    // this key is the calendar day
    [key: number]: {
      // each day can have multiple events, so this key is the event id
      [key:number]: EventInterface;
    };
  };
  next: {
    // this key is the calendar day
    [key: number]: {
      // each day can have multiple events, so this key is the event id
      [key:number]: EventInterface;
    };
  };
}
