import {z} from 'zod'

export const verifySchema = z.object({
    code: z.string().length(6, 'Validation code must be six digits')
})