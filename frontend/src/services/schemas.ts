import z from 'zod';

const MIN_PASSWORD_LENGTH = 6;

// Define separate schemas for each account type
const artistSchema = z
  .object({
    type: z.literal('ARTIST'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    country: z.string().min(2, 'Country is required'),
    realName: z.string().optional(), // Fixed the .aoptional() typo
    login: z.string().min(3, 'Username must be at least 3 characters'),
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const labelSchema = z
  .object({
    type: z.literal('LABEL'),
    contactName: z.string().min(2, 'Contact name is required'),
    country: z.string().min(2, 'Country is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    login: z.string().min(3, 'Username must be at least 3 characters'),
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Create discriminated union
export const registerSchema = z.discriminatedUnion('type', [
  artistSchema,
  labelSchema,
]);
export type RegisterFormValues = z.infer<typeof registerSchema>;
