import * as dayjs from 'dayjs';
import { DateRange } from '../interfaces';

export class CalculateDailyDatesRangesService {
  execute(currentDate: Date = new Date()): DateRange {
    const now = dayjs(currentDate);
    const endDate = now.hour(20).minute(0).second(0).millisecond(0);
    const startDate = endDate.subtract(1, 'day');

    return {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    };
  }
}
