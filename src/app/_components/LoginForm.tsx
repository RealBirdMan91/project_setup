'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  LoginSchema,
  type LoginSchemaType,
} from '@/lib/validation/authValidation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginAction } from '@/lib/actions/authActions'
import { useActionMutation } from '@/lib/hooks/useActionMutation'
import { toast } from 'sonner'

export function LoginForm() {
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
    },
  })
  const {
    error,
    isPending,
    mutate,
    data: loginData,
    isError,
    isSuccess,
  } = useActionMutation<string>({
    mutationFn: (data) => loginAction(data),
  })

  if (isPending) {
    toast('pending', {
      className: 'my-classname',
      description: 'My description',
      duration: 1000,
    })
  }

  if (isError) {
    toast('error', {
      className: 'my-classname',
      description: 'My description',
      duration: 1000,
    })
  }

  if (isSuccess) {
    toast('success', {
      className: 'my-classname',
      description: 'My description',
      duration: 1000,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ email }) => mutate(email))}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
