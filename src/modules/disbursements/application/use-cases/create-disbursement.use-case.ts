import { DisbursementRepository } from '../../domain/repositories';
import { Disbursement } from '../../domain/entities';
import { CreateDisbursementDto } from '../dtos';

export class CreateDisbursementUseCase {
  constructor(
    private readonly disbursementRepository: DisbursementRepository,
  ) {}

  async execute(disbursement: CreateDisbursementDto): Promise<string> {
    const newDisbursement = new Disbursement(disbursement);

    await this.disbursementRepository.create(newDisbursement);

    return newDisbursement.id;
  }
}
