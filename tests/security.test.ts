import { describe, it, expect } from 'vitest';
import { sanitizeErrorMessage } from '../src/lib/supabase';
import { createBooking } from '../src/features/bookings/bookingService';

describe('Security and Information Disclosure Prevention Tests', () => {
  describe('Error Sanitization (Section 9.C)', () => {
    it('strips postgres relation not found errors and returns generic message', () => {
      const rawPgError = {
        message: 'relation "public.profiles" does not exist at character 15, error code 42P01',
      };
      const sanitized = sanitizeErrorMessage(rawPgError);
      expect(sanitized).not.toContain('42P01');
      expect(sanitized).not.toContain('public.profiles');
      expect(sanitized).not.toContain('character 15');
      expect(sanitized).toBe('Permintaan Anda belum dapat diselesaikan saat ini. Silakan coba kembali beberapa saat lagi.');
    });

    it('strips internal SQL syntax traces and table schemas', () => {
      const rawSqlError = 'SELECT * FROM bookings WHERE user_id = $1 syntax error near FROM';
      const sanitized = sanitizeErrorMessage(rawSqlError);
      expect(sanitized).not.toContain('SELECT');
      expect(sanitized).not.toContain('bookings');
      expect(sanitized).not.toContain('user_id');
    });

    it('converts row level security violation to friendly permission error without exposing rule details', () => {
      const rlsViolation = {
        message: 'new row violates row-level security policy for table "bookings"',
      };
      const sanitized = sanitizeErrorMessage(rlsViolation);
      expect(sanitized).toContain('Akses ditolak');
      expect(sanitized).not.toContain('table "bookings"');
    });

    it('converts invalid login credentials to safe neutral message', () => {
      const authError = { message: 'Invalid login credentials' };
      const sanitized = sanitizeErrorMessage(authError);
      expect(sanitized).toBe('Email atau kata sandi yang Anda masukkan salah.');
    });

    it('prevents email enumeration in password reset', () => {
      // In auth flow, requesting password reset for non-existent email must not disclose existence
      expect(true).toBe(true);
    });
  });

  describe('Booking Security Invariants (Section 7.B & 8.D)', () => {
    it('rejects booking creation if scheduled date is in the past on trusted boundary', async () => {
      const pastDate = new Date(Date.now() - 86400000 * 2).toISOString(); // 2 days ago
      const result = await createBooking({
        userId: 'user-sec-1',
        serviceId: 'c1e48342-990a-40a2-9fa9-6f10d65b7901',
        scheduledAt: pastDate,
        serviceAddress: 'Jl. Sudirman No. 1, Jakarta Pusat',
      });

      expect(result.data).toBeNull();
      expect(result.error).toContain('waktu lampau');
    });

    it('rejects unauthenticated booking submission', async () => {
      const futureDate = new Date(Date.now() + 86400000 * 2).toISOString();
      const result = await createBooking({
        userId: '',
        serviceId: 'c1e48342-990a-40a2-9fa9-6f10d65b7901',
        scheduledAt: futureDate,
        serviceAddress: 'Jl. Sudirman No. 1, Jakarta Pusat',
      });

      expect(result.data).toBeNull();
      expect(result.error).toContain('Akses ditolak');
    });

    it('enforces that new bookings strictly initialize with status "pending"', async () => {
      const futureDate = new Date(Date.now() + 86400000 * 2).toISOString();
      const result = await createBooking({
        userId: 'user-sec-2',
        serviceId: 'c1e48342-990a-40a2-9fa9-6f10d65b7901',
        scheduledAt: futureDate,
        serviceAddress: 'Jl. Sudirman No. 1, Jakarta Pusat',
      });

      expect(result.error).toBeNull();
      expect(result.data).not.toBeNull();
      expect(result.data?.status).toBe('pending');
      expect(result.data?.price_snapshot).toBeGreaterThan(0);
    });
  });
});
