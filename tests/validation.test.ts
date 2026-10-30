import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  bookingSchema,
  profileSchema,
  forgotPasswordSchema,
} from '../src/schemas';

describe('CleanHome Form Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const valid = {
        fullName: 'Budi Santoso',
        email: 'budi@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        termsAccepted: true,
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalid = {
        fullName: 'Budi Santoso',
        email: 'budi@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword456',
        termsAccepted: true,
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Konfirmasi kata sandi');
      }
    });

    it('should reject passwords under 8 characters', () => {
      const invalid = {
        fullName: 'Budi Santoso',
        email: 'budi@example.com',
        password: 'Pass1',
        confirmPassword: 'Pass1',
        termsAccepted: true,
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject passwords without numbers', () => {
      const invalid = {
        fullName: 'Budi Santoso',
        email: 'budi@example.com',
        password: 'PasswordOnly',
        confirmPassword: 'PasswordOnly',
        termsAccepted: true,
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject when terms are not accepted', () => {
      const invalid = {
        fullName: 'Budi Santoso',
        email: 'budi@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        termsAccepted: false,
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('bookingSchema', () => {
    it('should accept valid future booking date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);

      const valid = {
        serviceId: 'service-123',
        scheduledDate: tomorrow.toISOString().split('T')[0],
        scheduledTime: '09:00',
        serviceAddress: 'Jl. Kemang Raya No. 10, Jakarta Selatan',
        notes: 'Pintu gerbang hitam',
      };
      const result = bookingSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject past booking dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 3);

      const invalid = {
        serviceId: 'service-123',
        scheduledDate: yesterday.toISOString().split('T')[0],
        scheduledTime: '09:00',
        serviceAddress: 'Jl. Kemang Raya No. 10, Jakarta Selatan',
        notes: '',
      };
      const result = bookingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('masa lampau');
      }
    });

    it('should reject too short service address', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const invalid = {
        serviceId: 'service-123',
        scheduledDate: tomorrow.toISOString().split('T')[0],
        scheduledTime: '09:00',
        serviceAddress: 'Jl', // < 5 chars
        notes: '',
      };
      const result = bookingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('profileSchema', () => {
    it('should validate customer profile update', () => {
      const valid = {
        fullName: 'Ahmad Dahlan',
        phone: '+62 811-2233-4455',
        address: 'Jl. Senopati No. 8, Kebayoran Baru, Jakarta Selatan',
      };
      const result = profileSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should validate valid email and reject invalid format', () => {
      expect(forgotPasswordSchema.safeParse({ email: 'valid@cleanhome.id' }).success).toBe(true);
      expect(forgotPasswordSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
    });
  });
});
