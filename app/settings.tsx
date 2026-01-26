import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { router } from 'expo-router'
import * as Sharing from 'expo-sharing'
import { useContext, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import {
  deleteAllData,
  selectCameras,
  selectPhotosByRollId,
  selectRollsByCameraId,
} from '@/db/queries'
import { insertCamera, insertRoll, insertRollPhoto } from '@/db/queries/insert'
import {
  Button,
  ButtonWrapper,
  PageWrapper,
  Typography,
} from '@/shared/components'
import { context } from '@/shared/context'
import { COLORS, SPACING } from '@/shared/theme'

const APP_VERSION = '1.0.0'

export default function Settings() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { dispatch } = useContext(context)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const cameras = await selectCameras()
      const exportData: any = {
        version: 1,
        exportedAt: new Date().toISOString(),
        cameras: [],
      }

      for (const camera of cameras) {
        const rolls = await selectRollsByCameraId(camera.id)
        const rollsWithPhotos = await Promise.all(
          rolls.map(async roll => {
            const photos = await selectPhotosByRollId(roll.id)
            return { ...roll, photos }
          })
        )
        exportData.cameras.push({ ...camera, rolls: rollsWithPhotos })
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      const filename = `film-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
      const filepath = `${FileSystem.documentDirectory}${filename}`

      await FileSystem.writeAsStringAsync(filepath, jsonString)
      await Sharing.shareAsync(filepath, {
        mimeType: 'application/json',
        dialogTitle: 'Export Film Tracker Data',
      })

      dispatch({
        type: 'TOAST',
        payload: { message: 'Data exported successfully', variant: 'SUCCESS' },
      })
    } catch (_error) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to export data', variant: 'ERROR' },
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      })

      if (result.canceled || !result.assets[0]) {
        setIsImporting(false)
        return
      }

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
      const data = JSON.parse(content)

      // Validate structure
      if (!data.cameras || !Array.isArray(data.cameras)) {
        throw new Error('Invalid backup format')
      }

      Alert.alert(
        'Import Data',
        'This will replace all existing data. Are you sure?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsImporting(false),
          },
          {
            text: 'Import',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteAllData()

                for (const cameraData of data.cameras) {
                  const { rolls, ...camera } = cameraData
                  await insertCamera(camera)

                  for (const rollData of rolls || []) {
                    const { photos, ...roll } = rollData
                    await insertRoll(roll)

                    for (const photo of photos || []) {
                      await insertRollPhoto(photo)
                    }
                  }
                }

                dispatch({
                  type: 'TOAST',
                  payload: {
                    message: 'Data imported successfully',
                    variant: 'SUCCESS',
                  },
                })
              } catch (_error) {
                dispatch({
                  type: 'TOAST',
                  payload: {
                    message: 'Failed to import data',
                    variant: 'ERROR',
                  },
                })
              } finally {
                setIsImporting(false)
              }
            },
          },
        ]
      )
    } catch (_error) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to read backup file', variant: 'ERROR' },
      })
      setIsImporting(false)
    }
  }

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all cameras, rolls, and photos. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllData()
              dispatch({
                type: 'TOAST',
                payload: { message: 'All data deleted', variant: 'SUCCESS' },
              })
            } catch (_error) {
              dispatch({
                type: 'TOAST',
                payload: { message: 'Failed to delete data', variant: 'ERROR' },
              })
            }
          },
        },
      ]
    )
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <PageWrapper title="Settings">
      <View style={styles.content}>
        <View style={styles.section}>
          <Typography variant="h2">Data Management</Typography>
          <Text style={styles.sectionDescription}>
            Export your data for backup or import from a previous backup.
          </Text>
          <ButtonWrapper
            vertical={[
              <Button
                key="export"
                color="primary"
                variant="filled"
                onPress={handleExport}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>,
              <Button
                key="import"
                color="primary"
                variant="link"
                onPress={handleImport}
                disabled={isImporting}
              >
                {isImporting ? 'Importing...' : 'Import Data'}
              </Button>,
            ]}
          />
        </View>

        <View style={styles.section}>
          <Typography variant="h2">Danger Zone</Typography>
          <Text style={styles.sectionDescription}>
            Permanently delete all data from the app.
          </Text>
          <ButtonWrapper
            full={
              <Button color="warning" variant="link" onPress={handleDeleteAll}>
                Delete All Data
              </Button>
            }
          />
        </View>

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Film Tracker v{APP_VERSION}</Text>
        </View>
      </View>

      <ButtonWrapper
        full={
          <Button color="primary" variant="link" onPress={handleBack}>
            Back
          </Button>
        }
      />
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: SPACING.MEDIUM,
  },
  section: {
    marginBottom: SPACING.XLARGE,
  },
  sectionDescription: {
    color: COLORS.NEUTRAL[400],
    marginTop: SPACING.XSMALL,
    marginBottom: SPACING.MEDIUM,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: SPACING.LARGE,
  },
  versionText: {
    color: COLORS.NEUTRAL[500],
  },
})
