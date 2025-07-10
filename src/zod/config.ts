import { z } from 'zod';

export const dateSchema = z
  .string()
  .min(1, 'Date is required')
  .regex(
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    'Invalid date format. Use dd/mm/yyyy'
  )
  .refine((dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day); // Convert to Date object

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    return inputDate <= today; // Reject future dates
  }, 'Date cannot be in the future');
