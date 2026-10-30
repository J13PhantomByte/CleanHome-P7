import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Nama lengkap minimal 2 karakter')
      .max(100, 'Nama lengkap maksimal 100 karakter'),
    email: z
      .string()
      .trim()
      .email('Format email tidak valid')
      .max(255, 'Email terlalu panjang'),
    password: z
      .string()
      .min(8, 'Kata sandi minimal 8 karakter')
      .regex(/[A-Za-z]/, 'Kata sandi harus mengandung minimal 1 huruf')
      .regex(/[0-9]/, 'Kata sandi harus mengandung minimal 1 angka'),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, {
      message: 'Anda harus menyetujui Syarat dan Ketentuan',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Format email tidak valid'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Kata sandi minimal 8 karakter')
      .regex(/[A-Za-z]/, 'Kata sandi harus mengandung minimal 1 huruf')
      .regex(/[0-9]/, 'Kata sandi harus mengandung minimal 1 angka'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Pilih layanan kebersihan'),
  scheduledDate: z
    .string()
    .min(1, 'Pilih tanggal reservasi')
    .refine(
      (val) => {
        const selected = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      },
      { message: 'Tanggal reservasi tidak boleh di masa lampau' }
    ),
  scheduledTime: z.string().min(1, 'Pilih jam kedatangan tim'),
  serviceAddress: z
    .string()
    .trim()
    .min(5, 'Alamat layanan minimal 5 karakter')
    .max(255, 'Alamat layanan maksimal 255 karakter'),
  notes: z
    .string()
    .trim()
    .max(500, 'Catatan tambahan maksimal 500 karakter')
    .optional()
    .or(z.literal('')),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  phone: z
    .string()
    .trim()
    .max(30, 'Nomor telepon maksimal 30 karakter')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(255, 'Alamat maksimal 255 karakter')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
