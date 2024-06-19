import {
  createContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
} from 'react'
import { Text } from 'react-native-paper'

import { getValueFromKeyStore, saveValueToKeyStore } from './utilities'

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'true'

export interface State {
  settings: {
    colorTheme: 'dark' | 'light'
  }
}

const EMPTY_STATE: State = {
  settings: {
    colorTheme: 'light',
  },
}

const initialSetup = () => {
  Object.keys(EMPTY_STATE.settings).forEach(key => {
    saveValueToKeyStore(
      key as keyof (typeof EMPTY_STATE)['settings'],
      EMPTY_STATE.settings[key as keyof (typeof EMPTY_STATE)['settings']]
    )
  })

  saveValueToKeyStore(HAS_DONE_WARM_START, TRUE)
}

type SettingsKey = keyof typeof EMPTY_STATE.settings

const getKeysFromStorage = async () => {
  const keys = Object.keys(EMPTY_STATE.settings) as SettingsKey[]
  const result = await keys.reduce(
    async (prevPromise, key) => {
      const acc = await prevPromise
      acc[key] = (await getValueFromKeyStore(key)) || EMPTY_STATE.settings[key]
      return acc
    },
    Promise.resolve({} as Record<SettingsKey, string>)
  )
  // I tried. Maybe one day I'll be better with types.
  return result as unknown as State['settings']
}

interface HydrateUserSettings {
  type: 'HYDRATE_USER_SETTINGS'
  payload: State['settings']
}

interface EditUserSettings {
  type: 'EDIT_USER_SETTING'
  payload: State['settings']
}

export type Action = EditUserSettings | HydrateUserSettings

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'HYDRATE_USER_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } }
    }
    case 'EDIT_USER_SETTING': {
      Object.entries(action.payload).forEach(([key, value]) => {
        saveValueToKeyStore(key as SettingsKey, value)
      })
      return { ...state, settings: { ...state.settings, ...action.payload } }
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

const ResultsContext = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      if ((await getValueFromKeyStore(HAS_DONE_WARM_START)) !== TRUE) {
        initialSetup()
      } else {
        const payload = await getKeysFromStorage()
        dispatch({ type: 'HYDRATE_USER_SETTINGS', payload })
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    void fetchData()
  }, [])

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  const { Provider } = context

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export default ResultsContext
export { context }
