import { v4 as uuidv4 } from 'uuid';

export class Merchant {
  readonly id: string;
  readonly reference: string;
  readonly email: string;
  readonly liveOn: Date;
  readonly disbursementFrequency: 'DAILY' | 'WEEKLY';
  readonly minimumMonthlyFee: number;

  constructor(props: {
    reference: string;
    email: string;
    liveOn: Date;
    disbursementFrequency: 'DAILY' | 'WEEKLY';
    minimumMonthlyFee: number;
  }) {
    if (!props.reference) {
      throw new Error('Reference is required');
    }

    if (!props.email) {
      throw new Error('Email is required');
    }

    if (!props.disbursementFrequency) {
      throw new Error('Disbursement frequency is required');
    }

    if (props.minimumMonthlyFee === undefined) {
      throw new Error('Minimum monthly fee is required');
    }

    if (!['DAILY', 'WEEKLY'].includes(props.disbursementFrequency)) {
      throw new Error('Invalid disbursement frequency');
    }

    this.id = uuidv4();
    this.reference = props.reference;
    this.email = props.email;
    this.liveOn = props.liveOn;
    this.disbursementFrequency = props.disbursementFrequency;
    this.minimumMonthlyFee = props.minimumMonthlyFee;
  }
}
