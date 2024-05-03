import {
  type ActionResponseType,
  type ErrorType,
  type SuccessType,
} from '../types/response'
import { useCallback, useMemo, useReducer, useRef } from 'react'
import isEqual from 'lodash/isEqual'

type TActionMutation<T> = {
  mutationFn: (data: T) => Promise<ActionResponseType>
}

type TState = {
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: Omit<ErrorType, 'type'> | null
  data: Omit<SuccessType, 'type'> | null
}

type TAction =
  | { type: 'success'; data: Omit<SuccessType, 'type'> }
  | { type: 'error'; error: Omit<ErrorType, 'type'> }
  | { type: 'pending' }

function reducer(state: TState, action: TAction) {
  switch (action.type) {
    case 'pending': {
      return {
        isPending: true,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
      }
    }
    case 'success': {
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        data: action.data,
      }
    }
    case 'error': {
      return {
        ...state,
        isPending: false,
        isError: true,
        error: action.error,
      }
    }
    default:
      return state
  }
}

export function useActionMutation<T>({ mutationFn }: TActionMutation<T>) {
  const initialState: TState = useMemo(
    () => ({
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: null,
    }),
    [],
  )
  const [state, dispatch] = useReducer(reducer, initialState)
  const returnState = useRef(initialState)

  const mutate = useCallback(
    (data: T) => {
      dispatch({ type: 'pending' })

      mutationFn(data)
        .then((res: ActionResponseType) => {
          if (res.type === 'error') {
            return dispatch({
              type: 'error',
              error: {
                message: res.message,
                error: res.error,
              },
            })
          }
          if (res.type === 'success') {
            return dispatch({
              type: 'success',
              data: {
                data: res.data,
                message: res.message,
              },
            })
          }
        })
        .catch((err: Error) => {
          dispatch({
            type: 'error',
            error: {
              message: err.message,
              error: err,
            },
          })
        })
    },
    [mutationFn],
  )

  return useMemo(() => {
    if (!isEqual(returnState.current, state)) {
      returnState.current = state
      return { ...returnState.current, mutate }
    }
    return {
      ...initialState,
      mutate,
    }
  }, [state, initialState, mutate])
}
