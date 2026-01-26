import { router } from 'expo-router'

import {
  Button,
  ButtonWrapper,
  PageWrapper,
  Typography,
} from '@/shared/components'

export default function EditCamera() {
  return (
    <PageWrapper title="Edit Camera">
      <Typography variant="body1">Edit camera screen - coming soon</Typography>
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
