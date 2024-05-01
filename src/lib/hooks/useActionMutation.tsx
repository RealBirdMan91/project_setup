import {
  type ActionResponseType,
  type ErrorType,
  type SuccessType,
} from '../types/response'
import { useState } from 'react'

type TActionMutation<T> = {
  mutationFn: (data: T) => Promise<ActionResponseType>
}

export function useActionMutation<T>({ mutationFn }: TActionMutation<T>) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Omit<ErrorType, 'type'> | null>(null)
  const [data, setData] = useState<Omit<SuccessType, 'type'> | null>(null)

  const mutate = (data: T) => {
    setIsPending(true)
    setError(null)

    mutationFn(data)
      .then((res: ActionResponseType) => {
        if (res.type === 'error') {
          return setError({
            message: res.message,
            error: res.error,
          })
        }
        if (res.type === 'success') {
          setData({
            data: res.data,
            message: res.message,
          })
        }
      })
      .catch((err: Error) => {
        setError({
          message: err.message,
          error: err,
        })
      })
      .finally(() => {
        setIsPending(false)
      })
  }

  return {
    isPending,
    error,
    data,
    mutate,
  }
}
