import type React from 'react'
import { Modal, ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import { type ChangelogEntry, markChangelogSeen } from '@/shared/changelog'
import { useTheme } from '@/shared/ThemeContext'
import { BORDER_RADIUS, SPACING } from '@/shared/theme'

import Button from './Button'
import ButtonWrapper from './ButtonWrapper'

type Props = {
  visible: boolean
  onDismiss: () => void
  entries: ChangelogEntry[]
}

const ChangelogModal: React.FC<Props> = ({ visible, onDismiss, entries }) => {
  const { colors } = useTheme()

  const handleDismiss = () => {
    markChangelogSeen()
    onDismiss()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            What's New
          </Text>
          <ScrollView style={styles.scrollArea}>
            {entries.map(entry => (
              <View key={entry.version} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.version, { color: colors.primary }]}>
                    v{entry.version}
                  </Text>
                  <Text style={[styles.date, { color: colors.textSecondary }]}>
                    {entry.date}
                  </Text>
                </View>
                {entry.changes.map((change, i) => (
                  <Text
                    key={i}
                    style={[styles.change, { color: colors.textPrimary }]}
                  >
                    {'\u2022'} {change}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
          <ButtonWrapper
            full={
              <Button color="primary" variant="filled" onPress={handleDismiss}>
                Got it
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
    marginBottom: SPACING.MEDIUM,
  },
  scrollArea: {
    marginBottom: SPACING.MEDIUM,
  },
  entry: {
    marginBottom: SPACING.LARGE,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XSMALL,
  },
  version: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 13,
  },
  change: {
    fontSize: 14,
    marginTop: SPACING.XXSMALL,
    paddingLeft: SPACING.XSMALL,
  },
})

export default ChangelogModal
