import { v4 as uuidv4 } from 'uuid';
import { DisbursementFrequency } from '../enums';
import { Email } from '../value-objects';
import { Reference } from '../value-objects/reference.vo';

export class Merchant {
  readonly id: string;
  readonly reference: Reference;
  readonly email: Email;
  readonly liveOn: Date;
  readonly disbursementFrequency: DisbursementFrequency;
  readonly minimumMonthlyFee: number;

  constructor(props: {
    id?: string;
    email: string;
    liveOn: Date;
    disbursementFrequency: DisbursementFrequency;
    minimumMonthlyFee: number;
  }) {
    if (props.minimumMonthlyFee === undefined) {
      throw new Error('Minimum monthly fee is required');
    }

    if (!['DAILY', 'WEEKLY'].includes(props.disbursementFrequency)) {
      throw new Error('Invalid disbursement frequency');
    }

    this.id = props.id || uuidv4();
    this.email = new Email(props.email);
    this.reference = new Reference(props.email);
    this.liveOn = props.liveOn;
    this.disbursementFrequency = props.disbursementFrequency;
    this.minimumMonthlyFee = props.minimumMonthlyFee;
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getReference(): string {
    return this.reference.getValue();
  }
}
