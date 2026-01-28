import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import * as Sharing from 'expo-sharing'
import { useContext, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Switch, Text } from 'react-native-paper'
import {
  deleteAllData,
  selectCameras,
  selectPhotosByRollId,
  selectRollsByCameraId,
} from '@/db/queries'
import { insertCamera, insertRoll, insertRollPhoto } from '@/db/queries/insert'
import { CHANGELOG, CURRENT_VERSION } from '@/shared/changelog'
import {
  Button,
  ButtonWrapper,
  ChangelogModal,
  ICloudRestoreModal,
  PageWrapper,
  Typography,
} from '@/shared/components'
import { context } from '@/shared/context'
import {
  backupToICloud,
  getAvailableICloudBackups,
  getICloudBackupEnabled,
  getICloudBackupInfo,
  type ICloudBackupEntry,
  isIOS,
  restoreFromICloud,
  setICloudBackupEnabled,
} from '@/shared/icloud'
import { type ThemeMode, useTheme } from '@/shared/ThemeContext'
import { SPACING } from '@/shared/theme'

export default function Settings() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [iCloudEnabled, setICloudEnabled] = useState(false)
  const [iCloudBackupDate, setICloudBackupDate] = useState<string | null>(null)
  const [hasData, setHasData] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [restoreEntries, setRestoreEntries] = useState<ICloudBackupEntry[]>([])
  const [loadingBackups, setLoadingBackups] = useState(false)
  const { dispatch } = useContext(context)
  const { colors, mode, setMode } = useTheme()

  useEffect(() => {
    selectCameras().then(cameras => {
      setHasData(cameras.length > 0)
    })

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
      setIsProcessing(true)
      const result = await backupToICloud()
      setIsProcessing(false)
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
    setIsProcessing(true)
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
      setIsProcessing(false)
    }
  }

  const handleOpenRestoreModal = async () => {
    setShowRestoreModal(true)
    setLoadingBackups(true)
    try {
      const entries = await getAvailableICloudBackups()
      setRestoreEntries(entries)
    } finally {
      setLoadingBackups(false)
    }
  }

  const handleRestoreFromICloud = (filename: string) => {
    setShowRestoreModal(false)
    Alert.alert(
      'Restore from iCloud',
      'This will replace all existing data with data from this backup. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true)
            try {
              const result = await restoreFromICloud(filename)
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
              setIsProcessing(false)
            }
          },
        },
      ]
    )
  }

  const handleExport = async () => {
    setIsProcessing(true)
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
      setIsProcessing(false)
    }
  }

  const handleImport = async () => {
    setIsProcessing(true)
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      })

      if (result.canceled || !result.assets[0]) {
        setIsProcessing(false)
        return
      }

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
      const data = JSON.parse(content)

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
            onPress: () => setIsProcessing(false),
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
                setIsProcessing(false)
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
      setIsProcessing(false)
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
              setHasData(false)
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

  const handleFeedback = () => {
    Linking.openURL('https://travisbumgarner.dev/marketing/film-tracker')
  }

  const themeModes: { label: string; value: ThemeMode }[] = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ]

  return (
    <PageWrapper title="Settings">
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Typography variant="h2">Appearance</Typography>
          <Text
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
            Choose your preferred theme.
          </Text>
          <View style={styles.themeRow}>
            {themeModes.map(({ label, value }) => (
              <View key={value} style={styles.themeButtonWrapper}>
                <Button
                  color={mode === value ? 'primary' : 'neutral'}
                  variant="outlined"
                  onPress={() => setMode(value)}
                >
                  {label}
                </Button>
              </View>
            ))}
          </View>
        </View>

        {isIOS && (
          <View style={styles.section}>
            <Typography variant="h2">iCloud Backup</Typography>
            <Text
              style={[
                styles.sectionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Automatically backup your data to iCloud weekly.
            </Text>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>
                Auto-backup weekly
              </Text>
              <Switch
                value={iCloudEnabled}
                onValueChange={handleICloudToggle}
                disabled={isProcessing}
                color={colors.switchActive}
              />
            </View>
            {iCloudBackupDate && (
              <Text
                style={[styles.lastBackupText, { color: colors.textSecondary }]}
              >
                Last backup: {new Date(iCloudBackupDate).toLocaleString()}
              </Text>
            )}
            <ButtonWrapper
              left={
                <Button
                  color="primary"
                  variant="outlined"
                  onPress={handleICloudBackup}
                  disabled={isProcessing || !hasData}
                >
                  {isProcessing ? 'Processing...' : 'Backup'}
                </Button>
              }
              right={
                <Button
                  color="primary"
                  variant="outlined"
                  onPress={handleOpenRestoreModal}
                  disabled={isProcessing}
                >
                  Restore
                </Button>
              }
            />
          </View>
        )}

        <View style={styles.section}>
          <Typography variant="h2">Manual Backup</Typography>
          <Text
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
            Export your data for backup or import from a previous backup.
          </Text>
          <ButtonWrapper
            left={
              <Button
                color="primary"
                variant="outlined"
                onPress={handleExport}
                disabled={isProcessing || !hasData}
              >
                {isProcessing ? 'Processing...' : 'Export Data'}
              </Button>
            }
            right={
              <Button
                color="primary"
                variant="link"
                onPress={handleImport}
                disabled={isProcessing}
              >
                Import Data
              </Button>
            }
          />
        </View>

        <View style={styles.section}>
          <Typography variant="h2">Danger Zone</Typography>
          <Text
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
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

        <View style={styles.section}>
          <Typography variant="h2">About</Typography>
          <ButtonWrapper
            left={
              <Button
                color="neutral"
                variant="link"
                onPress={() => setShowChangelog(true)}
              >
                Changelog
              </Button>
            }
            right={
              <Button color="neutral" variant="link" onPress={handleFeedback}>
                Feedback
              </Button>
            }
          />
        </View>

        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Film Tracker v{CURRENT_VERSION}
          </Text>
        </View>
      </ScrollView>

      <ButtonWrapper
        full={
          <Button color="primary" variant="filled" onPress={handleBack}>
            Back
          </Button>
        }
      />

      <ChangelogModal
        visible={showChangelog}
        onDismiss={() => setShowChangelog(false)}
        entries={CHANGELOG}
      />

      <ICloudRestoreModal
        visible={showRestoreModal}
        onDismiss={() => setShowRestoreModal(false)}
        onRestore={handleRestoreFromICloud}
        entries={restoreEntries}
        loading={loadingBackups}
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
    fontSize: 16,
  },
  lastBackupText: {
    marginBottom: SPACING.MEDIUM,
  },
  themeRow: {
    flexDirection: 'row',
    gap: SPACING.XSMALL,
  },
  themeButtonWrapper: {
    flex: 1,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: SPACING.LARGE,
  },
  versionText: {
    fontSize: 13,
  },
})
