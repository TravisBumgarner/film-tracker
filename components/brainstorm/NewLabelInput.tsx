import * as React from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import { TextInput, Button, Text, Icon, useTheme } from 'react-native-paper'
import { SPACING } from '@/app/theme'
import Label from '@/shared/components/Label'
import { db } from '@/db/client'
import { LabelsTable, NewLabel } from '@/db/schema'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { ICONS } from '@/assets/iconlist'

const COLORS = [
  '#ff5722',
  '#3f51b5',
  '#009688',
  '#ff9800',
  '#795548',
  '#607d8b',
  '#9c27b0',
  '#e91e63',
  '#03a9f4',
  '#00bcd4',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
]

const IdeaInput = ({
  submitCallback,
  cancelCallback,
}: {
  submitCallback: (args: { labelUUID: string }) => void
  cancelCallback: () => void
}) => {
  const [labelText, setLabelText] = React.useState('Label Name')
  const [color, setColor] = React.useState(COLORS[0])
  const [icon, setIcon] = React.useState(ICONS[0])
  const theme = useTheme()

  const handleCancel = React.useCallback(() => {
    setLabelText('')
    cancelCallback()
  }, [cancelCallback])

  const handleSubmit = React.useCallback(async () => {
    const newLabel: NewLabel = {
      uuid: uuidv4(),
      text: labelText,
      createdAt: new Date().toISOString(),
      color,
      icon,
    }

    const result = await db.insert(LabelsTable).values(newLabel).returning({
      uuid: LabelsTable.uuid,
    })
    submitCallback({ labelUUID: result[0].uuid })
  }, [labelText, color, icon, submitCallback])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TextInput
        style={{ height: 80, margin: SPACING.md }}
        label="Label Text"
        value={labelText}
        onChangeText={text => setLabelText(text)}
        multiline
        selectTextOnFocus
        returnKeyType="done"
      />
      <View
        style={{
          marginRight: SPACING.md,
          marginLeft: SPACING.md,
          marginBottom: SPACING.md,
          borderBottomColor: theme.colors.backdrop,
          borderBottomWidth: 1,
        }}
      >
        <Text>Color</Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={{
                margin: SPACING.sm,
                backgroundColor: color,
                width: 50,
                height: 50,
              }}
              onPress={() => setColor(color)}
            ></TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          flex: 1,
          marginRight: SPACING.md,
          marginLeft: SPACING.md,
          marginBottom: SPACING.md,
          borderBottomColor: theme.colors.backdrop,
          borderBottomWidth: 1,
        }}
      >
        <Text>Icon</Text>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {ICONS.map(icon => (
            <TouchableOpacity
              onPress={() => setIcon(icon)}
              key={icon}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon size={32} source={icon} color={color} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginRight: SPACING.md,
          marginLeft: SPACING.md,
          marginBottom: SPACING.md,
          height: 70,
          borderBottomColor: theme.colors.backdrop,
          borderBottomWidth: 1,
        }}
      >
        <Text>Preview</Text>
        <Label
          fullWidth
          color={color}
          icon={icon}
          text={labelText}
          readonly={true}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginRight: SPACING.md,
          marginLeft: SPACING.md,
          marginBottom: SPACING.md,
        }}
      >
        <Button
          style={{ flex: 1, marginRight: SPACING.md }}
          mode="outlined"
          onPress={handleCancel}
        >
          Cancel
        </Button>
        <Button
          style={{ flex: 1, marginLeft: SPACING.md }}
          mode="contained"
          onPress={handleSubmit}
        >
          Create
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default IdeaInput
