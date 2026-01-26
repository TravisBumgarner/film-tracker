import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import {
  Button,
  ButtonWrapper,
  PageWrapper,
  Typography,
} from '@/shared/components'
import { COLORS, SPACING } from '@/shared/theme'

export default function Index() {
  return (
    <PageWrapper title="Film Tracker">
      <View style={styles.content}>
        <Typography variant="body1" style={styles.welcomeText}>
          Track your analog film rolls across all your cameras.
        </Typography>
        <Typography variant="caption" style={styles.instructions}>
          Swipe between cameras, track roll status from loading to development.
        </Typography>
      </View>
      <ButtonWrapper
        full={
          <Button
            color="primary"
            variant="filled"
            onPress={() => router.push('/add-camera')}
          >
            Add Your First Camera
          </Button>
        }
      />
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LARGE,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: SPACING.MEDIUM,
    color: COLORS.NEUTRAL[200],
  },
  instructions: {
    textAlign: 'center',
  },
})
