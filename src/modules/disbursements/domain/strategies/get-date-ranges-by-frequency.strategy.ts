import { DisbursementFrequency } from '@modules/merchants/domain/enums';
import { DateRange } from '../interfaces';
import {
  CalculateDailyDatesRangesService,
  CalculateWeeklyDatesRangesService,
} from '../services';

type SupportedFrequency = Extract<
  DisbursementFrequency,
  DisbursementFrequency.DAILY | DisbursementFrequency.WEEKLY
>;

export class GetDateRangesByFrequencyStrategy {
  private readonly frequencyHandlers: Record<
    SupportedFrequency,
    (currentDate?: Date) => DateRange
  >;

  constructor(
    private readonly dailyService: CalculateDailyDatesRangesService,
    private readonly weeklyService: CalculateWeeklyDatesRangesService,
  ) {
    this.frequencyHandlers = {
      [DisbursementFrequency.DAILY]: (currentDate?: Date) =>
        this.dailyService.execute(currentDate),
      [DisbursementFrequency.WEEKLY]: (currentDate?: Date) =>
        this.weeklyService.execute(currentDate),
    };
  }

  execute(frequency: DisbursementFrequency, currentDate?: Date): DateRange {
    const handler = this.frequencyHandlers[frequency as SupportedFrequency];

    if (!handler) {
      throw new Error(`Unsupported disbursement frequency: ${frequency}`);
    }

    return handler(currentDate);
  }
}
