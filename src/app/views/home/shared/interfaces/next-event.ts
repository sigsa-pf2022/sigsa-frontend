
type NextEventType = 'medication' | 'appointment';
export interface NextEvent {
  date: Date;
  day: string;
  title: string;
  subtitle: string;
  type: NextEventType;
}
