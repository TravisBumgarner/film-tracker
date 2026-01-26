import { router } from 'expo-router'

import {
  Button,
  ButtonWrapper,
  PageWrapper,
  Typography,
} from '@/shared/components'

export default function AddCamera() {
  return (
    <PageWrapper title="Add Camera">
      <Typography variant="body1">Add camera screen - coming soon</Typography>
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
