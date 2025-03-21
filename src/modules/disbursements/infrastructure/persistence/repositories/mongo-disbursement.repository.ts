import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DisbursementRepository } from '@modules/disbursements/domain/repositories';
import { Disbursement } from '@modules/disbursements/domain/entities';
import { DisbursementDocument, DisbursementModel } from '../schemas';

@Injectable()
export class MongoDisbursementRepository implements DisbursementRepository {
  constructor(
    @InjectModel(DisbursementModel.name)
    private readonly disbursementModel: Model<DisbursementDocument>,
  ) {}

  async create(disbursement: Disbursement): Promise<Disbursement> {
    const created = await this.disbursementModel.create({
      id: disbursement.id,
      merchantId: disbursement.merchantId,
      totalAmount: disbursement.totalAmount.getValue(),
      fee: disbursement.fee.getValue(),
      reference: disbursement.reference.getValue(),
      startDate: disbursement.startDate,
      endDate: disbursement.endDate,
      createdAt: disbursement.createdAt,
    });

    return this.toEntity(created);
  }

  async findByMerchantAndDate(
    merchantId: string,
    date: Date,
  ): Promise<Disbursement | null> {
    const disbursement = await this.disbursementModel.findOne({
      merchantId,
      startDate: { $lte: date },
      endDate: { $gte: date },
    });

    return disbursement ? this.toEntity(disbursement) : null;
  }

  async findAll(): Promise<Disbursement[]> {
    const disbursements = await this.disbursementModel.find();
    return disbursements.map((d) => this.toEntity(d));
  }

  async findById(id: string): Promise<Disbursement | null> {
    const disbursement = await this.disbursementModel.findOne({ id });
    return disbursement ? this.toEntity(disbursement) : null;
  }

  private toEntity(document: DisbursementDocument): Disbursement {
    return new Disbursement({
      id: document.id,
      merchantId: document.merchantId,
      totalAmount: document.totalAmount,
      startDate: document.startDate,
      endDate: document.endDate,
    });
  }
}
