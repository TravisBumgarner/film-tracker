import queries from '@/db/queries'
import { CameraRunType, NoteRunType, RollRunType } from '@/db/schema'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import Typography from '@/shared/components/Typography'
import { context } from '@/shared/context'
import { SPACING } from '@/shared/theme'
import * as Sentry from '@sentry/react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as React from 'react'
import { View } from 'react-native'

const Settings = () => {
  const { dispatch } = React.useContext(context)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [deleteText, setDeleteText] = React.useState('')

  const handleWipeDatabase = React.useCallback(() => {
    queries.delete.everything()
    dispatch({
      type: 'TOAST',
      payload: { message: 'Database wiped', variant: 'SUCCESS' },
    })
  }, [dispatch])

  const handleBackup = async () => {
    setIsProcessing(true)
    try {
      const rolls = await queries.select.rolls()
      const notes = await queries.select.notes()
      const cameras = await queries.select.cameras()
      const dbContent = JSON.stringify({ rolls, notes, cameras })
      const backupPath = `${FileSystem.documentDirectory}backup_${new Date().toISOString()}.json`
      await FileSystem.writeAsStringAsync(backupPath, dbContent)
      await Sharing.shareAsync(backupPath)
      dispatch({
        type: 'TOAST',
        payload: {
          message: `Backup created`,
          variant: 'SUCCESS',
        },
      })
    } catch (error) {
      Sentry.captureException(error)
      dispatch({
        type: 'TOAST',
        payload: { message: 'Something went wrong', variant: 'ERROR' },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRestore = async () => {
    setIsProcessing(true)
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      })

      if (!result.assets) {
        dispatch({
          type: 'TOAST',
          payload: { message: 'Restore Cancelled', variant: 'WARNING' },
        })
        return
      }

      if (result.assets.length !== 1) {
        dispatch({
          type: 'TOAST',
          payload: {
            message: 'Select only one file to restore',
            variant: 'WARNING',
          },
        })
        return
      }

      const dbContent = await FileSystem.readAsStringAsync(result.assets[0].uri)
      const { cameras: rawCameras, rolls: rawRolls, notes: rawNotes } = JSON.parse(dbContent)

      if (!Array.isArray(rawCameras) || !Array.isArray(rawRolls) || !Array.isArray(rawNotes)) {
        dispatch({
          type: 'TOAST',
          payload: { message: 'Invalid backup file', variant: 'ERROR' },
        })
        return
      }

      try {
        const cameras = rawCameras.map(camera => CameraRunType.check(camera))
        const rolls = rawRolls.map(roll => RollRunType.check(roll))
        const notes = rawNotes.map(note => NoteRunType.check(note))

        await queries.delete.everything()

        await queries.insert.everything({ cameras, rolls, notes })
      } catch (error) {
        Sentry.captureException(error)
        dispatch({
          type: 'TOAST',
          payload: { message: 'Restore failed', variant: 'ERROR' },
        })
        return
      }

      dispatch({
        type: 'TOAST',
        payload: { message: 'Restore SUCCESSful', variant: 'SUCCESS' },
      })
    } catch (error) {
      Sentry.captureException(error)
      dispatch({
        type: 'TOAST',
        payload: { message: 'Restore failed', variant: 'ERROR' },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PageWrapper>
      <View
        style={{
          flex: 1,
        }}
      >
        <Typography variant="h1" style={{ marginBottom: SPACING.MEDIUM }}>
          Settings
        </Typography>

        <View>
          <Typography variant="h2">Database</Typography>
          <ButtonWrapper
            left={
              <Button variant="primary" onPress={handleBackup} disabled={isProcessing}>
                Backup Database
              </Button>
            }
            right={
              <Button variant="primary" onPress={handleRestore} disabled={isProcessing}>
                Restore Database
              </Button>
            }
          />
        </View>

        <View style={{ marginTop: SPACING.MEDIUM }}>
          <TextInput
            autoFocus={false} // eslint-disable-line
            label="Type 'Delete' to wipe database"
            value={deleteText}
            onChangeText={text => setDeleteText(text)}
          />
          <Button disabled={deleteText !== 'Delete'} onPress={handleWipeDatabase} variant="warning">
            Wipe Database and Migrations
          </Button>
        </View>
      </View>
    </PageWrapper>
  )
}

export default Settings
