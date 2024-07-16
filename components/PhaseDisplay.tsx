import { SelectRoll } from '@/db/schema'
import Typography from '@/shared/components/Typography'
import { COLORS } from '@/shared/theme'
import { Phase } from '@/shared/types'
import { phaseDisplayNameLookup, phaseOrderLookup } from '@/shared/utilities'
import { StyleSheet, View } from 'react-native'

const IndividualPhase = ({ phase, currentPhase, date }: { phase: Phase; currentPhase: Phase; date: string | null }) => {
  console.log(phase, currentPhase)
  if (phaseOrderLookup[phase] > phaseOrderLookup[currentPhase]) {
    return <Typography variant="body1">{phaseDisplayNameLookup[phase]}</Typography>
  }

  if (phaseOrderLookup[phase] < phaseOrderLookup[currentPhase] + 1) {
    return (
      <>
        <Typography style={{ color: COLORS.NEUTRAL[800] }} variant="body1">
          {phaseDisplayNameLookup[phase]}
        </Typography>
        <Typography style={{ color: COLORS.NEUTRAL[800] }} variant="body2">
          {date?.split('T')[0]}
        </Typography>
      </>
    )
  }
}

const statusDisplay = ({ roll }: { roll: SelectRoll }) => {
  return (
    <View style={styles.container}>
      <View style={StyleSheet.flatten([styles.base, styles.exposing])}>
        <IndividualPhase phase={Phase.Exposing} currentPhase={roll.phase} date={roll.insertedIntoCameraAt} />
      </View>
      <View style={StyleSheet.flatten([styles.base, styles.exposed])}>
        <IndividualPhase phase={Phase.Exposed} currentPhase={roll.phase} date={roll.removedFromCameraAt} />
      </View>
      <View style={StyleSheet.flatten([styles.base, styles.developed])}>
        <IndividualPhase phase={Phase.Developed} currentPhase={roll.phase} date={roll.developedAt} />
      </View>
      <View style={StyleSheet.flatten([styles.base, styles.archived])}>
        <IndividualPhase phase={Phase.Archived} currentPhase={roll.phase} date={roll.archivedAt} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  archived: {
    backgroundColor: COLORS.NEUTRAL[100],
  },
  base: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    padding: 4,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  developed: {
    backgroundColor: COLORS.SUCCESS[100],
  },
  exposed: {
    backgroundColor: COLORS.WARNING[100],
  },
  exposing: {
    backgroundColor: COLORS.ERROR[100],
  },
})

export default statusDisplay
