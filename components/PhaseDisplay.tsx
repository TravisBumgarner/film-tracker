import queries from '@/db/queries'
import { SelectRoll } from '@/db/schema'
import Button from '@/shared/components/Button'
import Typography from '@/shared/components/Typography'
import { COLORS } from '@/shared/theme'
import { orderToPhaseLookup, phaseOrderLookup } from '@/shared/utilities'
import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-paper'

const StatusDisplay = ({ roll, onPhaseChange }: { roll: SelectRoll; onPhaseChange: () => void }) => {
  const handlePhaseChange = useCallback(
    async (direction: 'next' | 'previous') => {
      const nextPhase = direction === 'next' ? phaseOrderLookup[roll.phase] + 1 : phaseOrderLookup[roll.phase] - 1

      const rollUpdate: Partial<SelectRoll> = {
        phase: orderToPhaseLookup[nextPhase],
      }

      await queries.update.roll(roll.id, rollUpdate)
      onPhaseChange()
    },
    [roll.id, roll.phase, onPhaseChange]
  )

  return (
    <View style={styles.container}>
      <View style={styles.phaseContainer}>
        <Button variant="link" color="secondary" onPress={() => handlePhaseChange('previous')}>
          <Icon source="chevron-left" size={24} color={COLORS.NEUTRAL[400]} />
        </Button>
        <Typography variant="body1">{roll.phase}</Typography>
        <Button variant="link" color="secondary" onPress={() => handlePhaseChange('next')}>
          <Icon source="chevron-right" size={24} color={COLORS.NEUTRAL[400]} />
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  phaseContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

export default StatusDisplay
