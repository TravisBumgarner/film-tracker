import { router } from 'expo-router'

import {
  Button,
  ButtonWrapper,
  PageWrapper,
  Typography,
} from '@/shared/components'

export default function EditRoll() {
  return (
    <PageWrapper title="Edit Roll">
      <Typography variant="body1">Edit roll screen - coming soon</Typography>
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
