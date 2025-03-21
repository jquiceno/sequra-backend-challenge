import { CalculateDailyDatesRangesService } from '@modules/disbursements/domain/services/calculate-daily-dates-ranges.service';
import * as dayjs from 'dayjs';

describe('CalculateDailyDatesRangesService', () => {
  let service: CalculateDailyDatesRangesService;

  beforeEach(() => {
    service = new CalculateDailyDatesRangesService();
  });

  it('should calculate correct date ranges for a given date', () => {
    const currentDate = new Date('2024-03-15T10:30:00');
    const result = service.execute(currentDate);

    const expectedStartDate = dayjs('2024-03-14T20:00:00').toDate();
    const expectedEndDate = dayjs('2024-03-15T20:00:00').toDate();

    expect(result.startDate).toEqual(expectedStartDate);
    expect(result.endDate).toEqual(expectedEndDate);
  });

  it('should handle dates after 8 PM correctly', () => {
    const currentDate = new Date('2024-03-15T21:00:00');
    const result = service.execute(currentDate);

    const expectedStartDate = dayjs('2024-03-14T20:00:00').toDate();
    const expectedEndDate = dayjs('2024-03-15T20:00:00').toDate();

    expect(result.startDate).toEqual(expectedStartDate);
    expect(result.endDate).toEqual(expectedEndDate);
  });

  it('should use current date when no date is provided', () => {
    const result = service.execute();

    const now = dayjs();
    const expectedEndDate = now.hour(20).minute(0).second(0).millisecond(0);
    const expectedStartDate = expectedEndDate.subtract(1, 'day');

    expect(result.startDate.getTime()).toBe(
      expectedStartDate.toDate().getTime(),
    );
    expect(result.endDate.getTime()).toBe(expectedEndDate.toDate().getTime());
  });
});
