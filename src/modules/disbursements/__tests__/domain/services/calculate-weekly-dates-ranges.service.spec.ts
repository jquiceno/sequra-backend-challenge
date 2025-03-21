import { CalculateWeeklyDatesRangesService } from '@modules/disbursements/domain/services/calculate-weekly-dates-ranges.service';
import * as dayjs from 'dayjs';

describe('CalculateWeeklyDatesRangesService', () => {
  let service: CalculateWeeklyDatesRangesService;

  beforeEach(() => {
    service = new CalculateWeeklyDatesRangesService();
  });

  it('should calculate correct date ranges for a Thursday', () => {
    const currentDate = new Date('2024-03-14T10:30:00');
    const result = service.execute(currentDate);

    const expectedStartDate = dayjs('2024-03-04T00:00:00').toDate();
    const expectedEndDate = dayjs('2024-03-10T00:00:00').toDate();

    expect(result.startDate).toEqual(expectedStartDate);
    expect(result.endDate).toEqual(expectedEndDate);
  });

  it('should calculate correct date ranges for a Sunday', () => {
    const currentDate = new Date('2024-03-10T10:30:00');
    const result = service.execute(currentDate);

    const expectedStartDate = dayjs('2024-02-26T00:00:00').toDate();
    const expectedEndDate = dayjs('2024-03-03T00:00:00').toDate();

    expect(result.startDate).toEqual(expectedStartDate);
    expect(result.endDate).toEqual(expectedEndDate);
  });

  it('should calculate correct date ranges for a Monday', () => {
    const currentDate = new Date('2024-03-11T10:30:00');
    const result = service.execute(currentDate);

    const expectedStartDate = dayjs('2024-03-04T00:00:00').toDate();
    const expectedEndDate = dayjs('2024-03-10T00:00:00').toDate();

    expect(result.startDate).toEqual(expectedStartDate);
    expect(result.endDate).toEqual(expectedEndDate);
  });

  it('should handle any time of day correctly', () => {
    const currentDate = new Date('2024-03-14T23:59:59');
    const result = service.execute(currentDate);

    const expectedStartDate = dayjs('2024-03-04T00:00:00').toDate();
    const expectedEndDate = dayjs('2024-03-10T00:00:00').toDate();

    expect(result.startDate).toEqual(expectedStartDate);
    expect(result.endDate).toEqual(expectedEndDate);
  });

  it('should use current date when no date is provided', () => {
    const result = service.execute();
    const now = dayjs();

    const daysUntilLastSunday = now.day();
    const lastSunday = now.subtract(daysUntilLastSunday, 'day').startOf('day');
    const endDate =
      daysUntilLastSunday === 0 ? lastSunday.subtract(7, 'day') : lastSunday;
    const startDate = endDate.subtract(6, 'day');

    expect(result.startDate.getTime()).toBe(startDate.toDate().getTime());
    expect(result.endDate.getTime()).toBe(endDate.toDate().getTime());
  });
});
