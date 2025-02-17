import Roll from '@/components/Roll'
import queries from '@/db/queries'
import { SelectRoll } from '@/db/schema'
import Button from '@/shared/components/Button'
import Dropdown from '@/shared/components/Dropdown'
import PageWrapper from '@/shared/components/PageWrapper'
import Typography from '@/shared/components/Typography'
import { SPACING } from '@/shared/theme'
import { Phase } from '@/shared/types'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const { width } = Dimensions.get('window')

const Home = () => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [rolls, setRolls] = useState<SelectRoll[]>([])
  const [filteredRollIds, setFilteredRollIds] = useState<string[]>([])
  const [selectedPhase, setSelectedPhase] = useState<Phase | ''>('')
  const defaultIndex = 1 // Set your desired default index here

  const fetchRolls = useCallback(() => {
    queries.select.rolls().then(rolls => setRolls(rolls))
  }, [])

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0 })
      fetchRolls()
    }, [fetchRolls])
  )

  useEffect(() => {
    // Scroll to the first roll
    if (filteredRollIds.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width * defaultIndex, animated: true })
    }
  }, [filteredRollIds, defaultIndex, selectedPhase])

  const addRollCallback = useCallback(() => {
    router.push('add-roll')
  }, [])

  useEffect(() => {
    if (selectedPhase === '') {
      setFilteredRollIds(rolls.map(roll => roll.id))
    } else {
      setFilteredRollIds(rolls.filter(roll => roll.phase === selectedPhase).map(roll => roll.id))
    }
  }, [selectedPhase, rolls])

  const clearFilters = useCallback(() => {
    setSelectedPhase('')
    setFilteredRollIds(rolls.map(roll => roll.id))
  }, [rolls])

  const handlePhaseChange = useCallback(
    (phase: string) => {
      setSelectedPhase(phase as Phase)
      setFilteredRollIds(rolls.filter(roll => roll.phase === phase).map(roll => roll.id))
    },
    [rolls]
  )

  if (filteredRollIds.length === 0) {
    return (
      <PageWrapper
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Typography variant="h1">No rolls yet</Typography>
        <Button variant="filled" color="primary" onPress={clearFilters}>
          Clear Filters
        </Button>
      </PageWrapper>
    )
  }

  if (rolls.length === 0) {
    return (
      <PageWrapper
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Button variant="filled" color="primary" onPress={addRollCallback}>
          Add Your First Roll
        </Button>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper ignoreMargin>
      <Dropdown
        data={[{ label: 'All', value: '' }, ...Object.values(Phase).map(phase => ({ label: phase, value: phase }))]}
        onChangeCallback={handlePhaseChange}
        value={selectedPhase}
        dropdownPosition="bottom"
      />
      <ScrollView
        ref={scrollViewRef}
        snapToInterval={width} // Snap to the screen width
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        decelerationRate="fast" // Adjust scrolling speed
      >
        <View style={[styles.rollWrapper, { width: width }]} key="add-roll">
          <Button variant="filled" color="secondary" onPress={addRollCallback}>
            Add roll
          </Button>
        </View>
        {filteredRollIds.map((rollId, index) => (
          <View style={[styles.rollWrapper, { width: width }]} key={index}>
            <Roll rollId={rollId} refetchCallback={fetchRolls} />
          </View>
        ))}
      </ScrollView>
      <View style={{ marginBottom: SPACING.MEDIUM, marginHorizontal: SPACING.MEDIUM }}></View>
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  rollWrapper: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
})

export default Home
