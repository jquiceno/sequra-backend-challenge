import { DisbursementRepository } from '@modules/disbursements/domain/repositories';

export class GetAllDisbursementsUseCase {
  constructor(
    private readonly disbursementRepository: DisbursementRepository,
  ) {}

  execute() {
    return this.disbursementRepository.findAll();
  }
}
