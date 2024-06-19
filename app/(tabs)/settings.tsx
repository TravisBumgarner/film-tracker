import { SafeAreaView, View } from 'react-native'
import { db } from '@/db/client'
import { NotesTable, RollsTable, CamerasTable } from '@/db/schema'
import { Button, Text, TextInput, ToggleButton, useTheme } from 'react-native-paper'
import { useCallback, useContext, useState } from 'react'
import { context } from '@/shared/context'

const Settings = () => {
  const { state, dispatch } = useContext(context)
  const theme = useTheme()

  const [deleteText, setDeleteText] = useState('')
  const [showRestartText, setShowRestartText] = useState(false)

  const handleWipeDatabase = useCallback(() => {
    db.delete(NotesTable).run()
    db.delete(CamerasTable).run()
    db.delete(RollsTable).run()
    setShowRestartText(true)
  }, [])

  const updateTheme = useCallback(
    (colorTheme: 'light' | 'dark') => {
      dispatch({
        type: 'EDIT_USER_SETTING',
        payload: {
          colorTheme,
        },
      })
    },
    [dispatch]
  )

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View>
        <Text style={{ margin: 10 }}>Theme</Text>
        <View style={{ width: '100%', height: 60, flexDirection: 'row' }}>
          <ToggleButton.Group onValueChange={updateTheme} value={state.settings.colorTheme}>
            <ToggleButton style={{ flex: 1 }} icon="weather-sunny" value="light" />
            <ToggleButton style={{ flex: 1 }} icon="moon-waxing-crescent" value="dark" />
          </ToggleButton.Group>
        </View>
      </View>
      <View style={{ margin: 10 }}>
        <Text>Wipe Database</Text>
        <TextInput label="Type 'Delete' to wipe database" value={deleteText} onChangeText={text => setDeleteText(text)} />
        <Button disabled={deleteText !== 'Delete'} buttonColor="red" mode="contained" onPress={handleWipeDatabase} style={{ marginTop: 10 }}>
          Wipe Database and Migrations
        </Button>
        {showRestartText && <Text style={{ marginTop: 10 }}>Database and migrations wiped. Please restart the app.</Text>}
      </View>
    </SafeAreaView>
  )
}

export default Settings
