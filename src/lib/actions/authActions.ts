'use server'

import { type LoginSchemaType } from '@/lib/validation/authValidation'
import { createClient } from '@/lib/supabase/serverClient'
import { cookies } from 'next/headers'
import { type ActionResponseType } from '../types/response'

export async function loginAction(
  email: LoginSchemaType['email'],
): Promise<ActionResponseType> {
  const cookieStore = cookies()
  const client = createClient(cookieStore)

  const { data, error } = await client.auth.signInWithOtp({
    email,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
    },
  })

  if (error) {
    return {
      type: 'error',
      error: error,
    }
  }

  return {
    type: 'success',
    data: data,
    message: 'OTP sent to your email',
  }
}
