import { GetDateRangesByFrequencyStrategy } from '@modules/disbursements/domain/strategies/get-date-ranges-by-frequency.strategy';
import {
  CalculateDailyDatesRangesService,
  CalculateWeeklyDatesRangesService,
} from '@modules/disbursements/domain/services';
import { DisbursementFrequency } from '@modules/merchants/domain/enums';
import { DateRange } from '@modules/disbursements/domain/interfaces';

describe('GetDateRangesByFrequencyStrategy', () => {
  let strategy: GetDateRangesByFrequencyStrategy;
  let mockDailyService: jest.Mocked<CalculateDailyDatesRangesService>;
  let mockWeeklyService: jest.Mocked<CalculateWeeklyDatesRangesService>;

  beforeEach(() => {
    mockDailyService = {
      execute: jest.fn(),
    };

    mockWeeklyService = {
      execute: jest.fn(),
    };

    strategy = new GetDateRangesByFrequencyStrategy(
      mockDailyService,
      mockWeeklyService,
    );
  });

  it('should use daily service for daily frequency', () => {
    const currentDate = new Date();
    const expectedRange: DateRange = {
      startDate: new Date(),
      endDate: new Date(),
    };

    mockDailyService.execute.mockReturnValue(expectedRange);

    const result = strategy.execute(DisbursementFrequency.DAILY, currentDate);

    expect(result).toBe(expectedRange);
    expect(mockDailyService.execute).toHaveBeenCalledWith(currentDate);
    expect(mockWeeklyService.execute).not.toHaveBeenCalled();
  });

  it('should use weekly service for weekly frequency', () => {
    const currentDate = new Date();
    const expectedRange: DateRange = {
      startDate: new Date(),
      endDate: new Date(),
    };

    mockWeeklyService.execute.mockReturnValue(expectedRange);

    const result = strategy.execute(DisbursementFrequency.WEEKLY, currentDate);

    expect(result).toBe(expectedRange);
    expect(mockWeeklyService.execute).toHaveBeenCalledWith(currentDate);
    expect(mockDailyService.execute).not.toHaveBeenCalled();
  });

  it('should throw error for unsupported frequency', () => {
    const invalidFrequency = 'MONTHLY' as DisbursementFrequency;

    expect(() => strategy.execute(invalidFrequency)).toThrow(
      'Unsupported disbursement frequency: MONTHLY',
    );

    expect(mockDailyService.execute).not.toHaveBeenCalled();
    expect(mockWeeklyService.execute).not.toHaveBeenCalled();
  });

  it('should handle undefined current date', () => {
    const expectedRange: DateRange = {
      startDate: new Date(),
      endDate: new Date(),
    };

    mockDailyService.execute.mockReturnValue(expectedRange);

    const result = strategy.execute(DisbursementFrequency.DAILY);

    expect(result).toBe(expectedRange);
    expect(mockDailyService.execute).toHaveBeenCalledWith(undefined);
    expect(mockWeeklyService.execute).not.toHaveBeenCalled();
  });
});
