import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Merchant } from '../../domain/entities';
import { MerchantRepository } from '../../domain/repositories';
import { MerchantDocument } from '../persistence/schemas';

@Injectable()
export class MongoMerchantRepository implements MerchantRepository {
  constructor(
    @InjectModel(MerchantDocument.name)
    private readonly merchantModel: Model<MerchantDocument>,
  ) {}

  async create(merchant: Merchant): Promise<Merchant> {
    const createdMerchant = await this.merchantModel.create({
      reference: merchant.reference,
      email: merchant.email,
      liveOn: merchant.liveOn,
      disbursementFrequency: merchant.disbursementFrequency,
      minimumMonthlyFee: merchant.minimumMonthlyFee,
    });

    return this.toEntity(createdMerchant);
  }

  async findById(id: string): Promise<Merchant | null> {
    const merchant = await this.merchantModel.findById(id);
    return merchant ? this.toEntity(merchant) : null;
  }

  async findByEmail(email: string): Promise<Merchant | null> {
    const merchant = await this.merchantModel.findOne({ email });
    return merchant ? this.toEntity(merchant) : null;
  }

  async findAll(): Promise<Merchant[]> {
    const merchants = await this.merchantModel.find();
    return merchants.map((merchant) => this.toEntity(merchant));
  }

  private toEntity(document: MerchantDocument): Merchant {
    return new Merchant({
      reference: document.reference,
      email: document.email,
      liveOn: document.liveOn,
      disbursementFrequency: document.disbursementFrequency,
      minimumMonthlyFee: document.minimumMonthlyFee,
    });
  }
}
