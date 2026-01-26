import { createContext, type Dispatch, useReducer } from 'react'

export interface State {
  toast: {
    message: string
    variant: 'SUCCESS' | 'ERROR' | 'WARNING'
  } | null
}

const EMPTY_STATE: State = {
  toast: null,
}

interface Toast {
  type: 'TOAST'
  payload: State['toast']
}

export type Action = Toast

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOAST': {
      return { ...state, toast: action.payload }
    }
    default:
      throw new Error('Unexpected action')
  }
}

const context = createContext({
  state: EMPTY_STATE,
  dispatch: () => {},
} as {
  state: State
  dispatch: Dispatch<Action>
})

const ResultsContext = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE)

  const { Provider } = context

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export default ResultsContext
export { context }
