import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Merchant } from '../../domain/entities';
import { MerchantRepository } from '../../domain/repositories';
import { MerchantDocument } from '../persistence/schemas';
import { DisbursementFrequency } from '../../domain/enums';

@Injectable()
export class MongoMerchantRepository implements MerchantRepository {
  constructor(
    @InjectModel(MerchantDocument.name)
    private readonly merchantModel: Model<MerchantDocument>,
  ) {}

  async create(merchant: Merchant): Promise<Merchant> {
    const createdMerchant = await this.merchantModel.create({
      id: merchant.id,
      reference: merchant.getReference(),
      email: merchant.getEmail(),
      disbursementFrequency: merchant.disbursementFrequency,
      minimumMonthlyFee: merchant.minimumMonthlyFee,
      liveOn: merchant.liveOn,
    });

    return this.toEntity(createdMerchant);
  }

  async findById(id: string): Promise<Merchant | null> {
    const merchant = await this.merchantModel.findOne({ id });
    return merchant ? this.toEntity(merchant) : null;
  }

  async findByEmail(email: string): Promise<Merchant | null> {
    const merchant = await this.merchantModel.findOne({ email });
    return merchant ? this.toEntity(merchant) : null;
  }

  async findAll(): Promise<Merchant[]> {
    const merchants = await this.merchantModel.find(
      {},
      {},
      { sort: { liveOn: -1 } },
    );
    return merchants.map((merchant) => this.toEntity(merchant));
  }

  async findByDisbursementFrequency(
    frequency: DisbursementFrequency,
  ): Promise<Merchant[]> {
    const merchants = await this.merchantModel.find({
      disbursementFrequency: frequency,
    });
    return merchants.map((merchant) => this.toEntity(merchant));
  }

  private toEntity(document: MerchantDocument): Merchant {
    return new Merchant({
      id: document.id,
      email: document.email,
      liveOn: document.liveOn,
      disbursementFrequency: document.disbursementFrequency,
      minimumMonthlyFee: document.minimumMonthlyFee,
    });
  }
}
