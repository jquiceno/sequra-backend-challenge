import { Command, CommandRunner, Option } from 'nest-commander';
import { ProcessDisbursementUseCase } from '@modules/disbursements/application/use-cases';
import { DisbursementFrequency } from '@modules/merchants/domain/enums';

interface ProcessDisbursementCommandOptions {
  frequency: DisbursementFrequency;
}

@Command({
  name: 'process-disbursement',
  description: 'Process disbursements for merchants based on frequency',
})
export class ProcessDisbursementCommand extends CommandRunner {
  constructor(
    private readonly processDisbursementUseCase: ProcessDisbursementUseCase,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options: ProcessDisbursementCommandOptions,
  ): Promise<void> {
    try {
      const disbursements = await this.processDisbursementUseCase.execute(
        options.frequency,
      );

      console.log(
        `Processed ${disbursements.length} disbursements successfully.`,
      );
    } catch (error) {
      console.error('Error processing disbursements:', error.message);
      process.exit(1);
    }
  }

  @Option({
    flags: '-f, --frequency [frequency]',
    description: 'Disbursement frequency (DAILY or WEEKLY)',
    required: true,
    choices: Object.values(DisbursementFrequency),
  })
  parseFrequency(frequency: string): DisbursementFrequency {
    if (
      !Object.values(DisbursementFrequency).includes(
        frequency as DisbursementFrequency,
      )
    ) {
      throw new Error(
        `Invalid frequency. Must be one of: ${Object.values(
          DisbursementFrequency,
        ).join(', ')}`,
      );
    }
    return frequency as DisbursementFrequency;
  }
}
