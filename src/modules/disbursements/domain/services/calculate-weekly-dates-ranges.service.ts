import * as dayjs from 'dayjs';
import { DateRange } from '../interfaces';

export class CalculateWeeklyDatesRangesService {
  execute(currentDate: Date = new Date()): DateRange {
    const now = dayjs(currentDate);
    const daysUntilLastSunday = now.day();

    const lastSunday = now.subtract(daysUntilLastSunday, 'day').startOf('day');
    const endDate =
      daysUntilLastSunday === 0 ? lastSunday.subtract(7, 'day') : lastSunday;

    const startDate = endDate.subtract(6, 'day');

    return {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    };
  }
}
