import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { router } from 'expo-router'
import * as Sharing from 'expo-sharing'
import { useContext, useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Switch, Text } from 'react-native-paper'
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
import {
  backupToICloud,
  getICloudBackupEnabled,
  getICloudBackupInfo,
  isIOS,
  restoreFromICloud,
  setICloudBackupEnabled,
} from '@/shared/icloud'
import { COLORS, SPACING } from '@/shared/theme'

const APP_VERSION = '1.0.0'

export default function Settings() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [iCloudEnabled, setICloudEnabled] = useState(false)
  const [iCloudBackupDate, setICloudBackupDate] = useState<string | null>(null)
  const [isBackingUpToICloud, setIsBackingUpToICloud] = useState(false)
  const [isRestoringFromICloud, setIsRestoringFromICloud] = useState(false)
  const { dispatch } = useContext(context)

  useEffect(() => {
    if (isIOS) {
      getICloudBackupEnabled().then(setICloudEnabled)
      getICloudBackupInfo().then(info => {
        if (info.exists && info.backupDate) {
          setICloudBackupDate(info.backupDate)
        }
      })
    }
  }, [])

  const handleICloudToggle = async (enabled: boolean) => {
    setICloudEnabled(enabled)
    await setICloudBackupEnabled(enabled)

    if (enabled) {
      setIsBackingUpToICloud(true)
      const result = await backupToICloud()
      setIsBackingUpToICloud(false)
      if (result.success) {
        setICloudBackupDate(new Date().toISOString())
        dispatch({
          type: 'TOAST',
          payload: { message: 'iCloud backup enabled', variant: 'SUCCESS' },
        })
      } else {
        setICloudEnabled(false)
        await setICloudBackupEnabled(false)
        dispatch({
          type: 'TOAST',
          payload: {
            message: result.error || 'Failed to enable iCloud backup',
            variant: 'ERROR',
          },
        })
      }
    }
  }

  const handleICloudBackup = async () => {
    setIsBackingUpToICloud(true)
    try {
      const result = await backupToICloud()
      if (result.success) {
        setICloudBackupDate(new Date().toISOString())
        dispatch({
          type: 'TOAST',
          payload: {
            message: 'Backup to iCloud successful',
            variant: 'SUCCESS',
          },
        })
      } else {
        dispatch({
          type: 'TOAST',
          payload: {
            message: result.error || 'Backup failed',
            variant: 'ERROR',
          },
        })
      }
    } finally {
      setIsBackingUpToICloud(false)
    }
  }

  const handleRestoreFromICloud = () => {
    Alert.alert(
      'Restore from iCloud',
      'This will replace all existing data with data from your iCloud backup. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setIsRestoringFromICloud(true)
            try {
              const result = await restoreFromICloud()
              if (result.success) {
                dispatch({
                  type: 'TOAST',
                  payload: {
                    message: `Restored ${result.restoredCameras} cameras, ${result.restoredRolls} rolls, ${result.restoredPhotos} photos`,
                    variant: 'SUCCESS',
                  },
                })
              } else {
                dispatch({
                  type: 'TOAST',
                  payload: {
                    message: result.error || 'Failed to restore from iCloud',
                    variant: 'ERROR',
                  },
                })
              }
            } finally {
              setIsRestoringFromICloud(false)
            }
          },
        },
      ]
    )
  }

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
        {isIOS && (
          <View style={styles.section}>
            <Typography variant="h2">iCloud Backup</Typography>
            <Text style={styles.sectionDescription}>
              Automatically backup your data to iCloud daily.
            </Text>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Auto-backup daily</Text>
              <Switch
                value={iCloudEnabled}
                onValueChange={handleICloudToggle}
                disabled={isBackingUpToICloud || isRestoringFromICloud}
                color={COLORS.PRIMARY[300]}
              />
            </View>
            {iCloudBackupDate && (
              <Text style={styles.lastBackupText}>
                Last backup: {new Date(iCloudBackupDate).toLocaleString()}
              </Text>
            )}
            <ButtonWrapper
              vertical={[
                <Button
                  key="backup"
                  color="primary"
                  variant="filled"
                  onPress={handleICloudBackup}
                  disabled={isBackingUpToICloud || isRestoringFromICloud}
                >
                  {isBackingUpToICloud ? 'Backing up...' : 'Backup to iCloud'}
                </Button>,
                <Button
                  key="restore"
                  color="primary"
                  variant="filled"
                  onPress={handleRestoreFromICloud}
                  disabled={isBackingUpToICloud || isRestoringFromICloud}
                >
                  {isRestoringFromICloud
                    ? 'Restoring...'
                    : 'Restore from iCloud'}
                </Button>,
              ]}
            />
          </View>
        )}

        <View style={styles.section}>
          <Typography variant="h2">Manual Backup</Typography>
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  toggleLabel: {
    color: COLORS.NEUTRAL[200],
    fontSize: 16,
  },
  lastBackupText: {
    color: COLORS.NEUTRAL[400],
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
