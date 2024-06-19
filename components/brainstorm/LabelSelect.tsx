import { SPACING } from '@/app/theme'
import { db } from '@/db/client'
import { LabelsTable, SelectLabel } from '@/db/schema'
import Label from '@/shared/components/Label'
import * as React from 'react'
import { SafeAreaView, View, ScrollView } from 'react-native'
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper'

const LabelInput = ({
  submitCallback,
  newLabelCallback,
}: {
  submitCallback: (ideaText: string) => void
  cancelCallback: () => void
  newLabelCallback: () => void
}) => {
  const [labels, setLabels] = React.useState<SelectLabel[] | null>(null)
  const theme = useTheme()

  React.useEffect(() => {
    db.select().from(LabelsTable).then(setLabels)
  }, [])

  const handleSubmit = React.useCallback(
    (button: string) => {
      submitCallback(button)
    },
    [submitCallback]
  )

  if (labels === null) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ActivityIndicator animating size="large" />
      </SafeAreaView>
    )
  }

  if (labels.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}
      >
        <Button
          style={{ margin: SPACING.lg }}
          mode="contained"
          onPress={newLabelCallback}
        >
          Add Your First Label
        </Button>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flex: 1,
        }}
      >
        <Text>Label</Text>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
          }}
          style={{
            flex: 1,
          }}
        >
          {labels.map(({ color, uuid, icon, text }, index) => (
            <View
              key={index}
              style={{
                width: '100%',
                padding: SPACING.sm,
                flex: 1,
              }}
            >
              <Label
                color={color}
                icon={icon}
                text={text}
                readonly={false}
                handlePress={() => handleSubmit(uuid)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginRight: SPACING.md,
          marginLeft: SPACING.md,
          marginBottom: SPACING.md,
        }}
      >
        <Button style={{ flex: 1 }} mode="contained" onPress={newLabelCallback}>
          Add New Label
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default LabelInput
