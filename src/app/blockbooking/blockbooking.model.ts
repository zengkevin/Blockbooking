export interface Blockbooking {
  id?: string;
  description: string;
  startTime: any; // Moment
  duration: number;
  recurrence: string;
  dateEnd: any
}
