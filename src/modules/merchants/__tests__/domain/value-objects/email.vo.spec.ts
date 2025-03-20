import { Email } from '@modules/merchants/domain/value-objects';

describe('Email Value Object', () => {
  describe('creation', () => {
    it('should create a valid email', () => {
      const emailStr = 'test@example.com';
      const email = new Email(emailStr);

      expect(email).toBeDefined();
      expect(email.getValue()).toBe(emailStr);
    });

    it('should create a valid email with subdomain', () => {
      const emailStr = 'test@sub.example.com';
      const email = new Email(emailStr);

      expect(email.getValue()).toBe(emailStr);
    });

    it('should create a valid email with plus sign', () => {
      const emailStr = 'test+label@example.com';
      const email = new Email(emailStr);

      expect(email.getValue()).toBe(emailStr);
    });
  });

  describe('validation', () => {
    it('should throw error when email is empty', () => {
      expect(() => new Email('')).toThrow('Email is required');
    });

    it('should throw error when email is null', () => {
      expect(() => new Email(null as any)).toThrow('Email is required');
    });

    it('should throw error when email is undefined', () => {
      expect(() => new Email(undefined as any)).toThrow('Email is required');
    });

    it('should throw error when email format is invalid - no @', () => {
      expect(() => new Email('invalid.email')).toThrow('Invalid email format');
    });

    it('should throw error when email format is invalid - no domain', () => {
      expect(() => new Email('test@')).toThrow('Invalid email format');
    });

    it('should throw error when email format is invalid - no local part', () => {
      expect(() => new Email('@example.com')).toThrow('Invalid email format');
    });

    it('should throw error when email format is invalid - spaces', () => {
      expect(() => new Email('test @example.com')).toThrow(
        'Invalid email format',
      );
    });

    it('should throw error when email format is invalid - multiple @', () => {
      expect(() => new Email('test@domain@example.com')).toThrow(
        'Invalid email format',
      );
    });
  });

  describe('value comparison', () => {
    it('should return same value for same email', () => {
      const emailStr = 'test@example.com';
      const email1 = new Email(emailStr);
      const email2 = new Email(emailStr);

      expect(email1.getValue()).toBe(email2.getValue());
    });

    it('should treat email as case sensitive', () => {
      const lowerEmail = new Email('test@example.com');
      const upperEmail = new Email('TEST@example.com');

      expect(lowerEmail.getValue()).not.toBe(upperEmail.getValue());
    });
  });
});
