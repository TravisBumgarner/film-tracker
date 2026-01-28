import type React from 'react'
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Text } from 'react-native-paper'

import type { ICloudBackupEntry } from '@/shared/icloud'
import { useTheme } from '@/shared/ThemeContext'
import { BORDER_RADIUS, SPACING } from '@/shared/theme'

import Button from './Button'
import ButtonWrapper from './ButtonWrapper'

type Props = {
  visible: boolean
  onDismiss: () => void
  onRestore: (filename: string) => void
  entries: ICloudBackupEntry[]
  loading: boolean
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const ICloudRestoreModal: React.FC<Props> = ({
  visible,
  onDismiss,
  onRestore,
  entries,
  loading,
}) => {
  const { colors } = useTheme()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Restore from iCloud
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select a backup to restore. This will replace all existing data.
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                Loading backups...
              </Text>
            </View>
          ) : entries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No iCloud backups found.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollArea}>
              {entries.map(entry => (
                <TouchableOpacity
                  key={entry.filename}
                  style={[
                    styles.entryRow,
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => onRestore(entry.filename)}
                >
                  <View style={styles.entryInfo}>
                    <Text
                      style={[styles.entryDate, { color: colors.textPrimary }]}
                    >
                      {new Date(entry.backupDate).toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        styles.entryCounts,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {entry.cameraCount} cameras, {entry.rollCount} rolls,{' '}
                      {entry.photoCount} photos
                    </Text>
                    <Text
                      style={[
                        styles.entrySize,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {formatBytes(entry.sizeBytes)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <ButtonWrapper
            full={
              <Button color="neutral" variant="link" onPress={onDismiss}>
                Cancel
              </Button>
            }
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  container: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.LARGE,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: SPACING.XSMALL,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: SPACING.MEDIUM,
  },
  scrollArea: {
    marginBottom: SPACING.MEDIUM,
  },
  entryRow: {
    paddingVertical: SPACING.SMALL,
    borderBottomWidth: 1,
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: 15,
    fontWeight: '600',
  },
  entryCounts: {
    fontSize: 13,
    marginTop: SPACING.XXSMALL,
  },
  entrySize: {
    fontSize: 12,
    marginTop: SPACING.XXSMALL,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.XLARGE,
  },
  loadingText: {
    marginTop: SPACING.SMALL,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.XLARGE,
  },
  emptyText: {
    fontSize: 14,
  },
})

export default ICloudRestoreModal
