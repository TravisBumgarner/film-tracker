import { router } from 'expo-router'

import {
  Button,
  ButtonWrapper,
  PageWrapper,
  Typography,
} from '@/shared/components'

export default function Settings() {
  return (
    <PageWrapper title="Settings">
      <Typography variant="body1">Settings screen - coming soon</Typography>
      <ButtonWrapper
        full={
          <Button color="primary" variant="link" onPress={() => router.back()}>
            Go Back
          </Button>
        }
      />
    </PageWrapper>
  )
}
