import { Reference } from '@modules/merchants/domain/value-objects';

describe('Reference Value Object', () => {
  describe('creation', () => {
    it('should create a valid reference from email', () => {
      const email = 'test@example.com';
      const reference = new Reference(email);

      expect(reference).toBeDefined();
      expect(reference.getValue()).toBe('test');
    });

    it('should create a valid reference from email with plus sign', () => {
      const email = 'test+label@example.com';
      const reference = new Reference(email);

      expect(reference.getValue()).toBe('test+label');
    });

    it('should create a valid reference from email with dots', () => {
      const email = 'test.name@example.com';
      const reference = new Reference(email);

      expect(reference.getValue()).toBe('test.name');
    });
  });

  describe('validation', () => {
    it('should throw error when email is empty', () => {
      expect(() => new Reference('')).toThrow(
        'Email is required to generate reference',
      );
    });

    it('should throw error when email is null', () => {
      expect(() => new Reference(null as any)).toThrow(
        'Email is required to generate reference',
      );
    });

    it('should throw error when email is undefined', () => {
      expect(() => new Reference(undefined as any)).toThrow(
        'Email is required to generate reference',
      );
    });
  });

  describe('value comparison', () => {
    it('should return same value for same email', () => {
      const email = 'test@example.com';
      const reference1 = new Reference(email);
      const reference2 = new Reference(email);

      expect(reference1.getValue()).toBe(reference2.getValue());
    });

    it('should return same value for emails with different domains', () => {
      const reference1 = new Reference('test@example.com');
      const reference2 = new Reference('test@another.com');

      expect(reference1.getValue()).toBe(reference2.getValue());
    });

    it('should treat reference as case sensitive', () => {
      const lowerReference = new Reference('test@example.com');
      const upperReference = new Reference('TEST@example.com');

      expect(lowerReference.getValue()).not.toBe(upperReference.getValue());
    });

    it('should handle complex local parts', () => {
      const reference = new Reference('test.name+label_123@example.com');
      expect(reference.getValue()).toBe('test.name+label_123');
    });
  });
});
