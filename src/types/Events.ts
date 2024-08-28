export default interface EventInterface {
  id: number;
  familyId: number;
  createdBy: number;
  createdAt: Date;
  title: string;
  details?: string;
  eventDate: Date;
}
