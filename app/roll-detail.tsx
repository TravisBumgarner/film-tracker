import { router } from 'expo-router'

import {
  Button,
  ButtonWrapper,
  PageWrapper,
  Typography,
} from '@/shared/components'

export default function RollDetail() {
  return (
    <PageWrapper title="Roll Detail">
      <Typography variant="body1">Roll detail screen - coming soon</Typography>
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
