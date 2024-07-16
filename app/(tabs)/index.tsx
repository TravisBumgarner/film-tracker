import Roll from '@/components/Roll'
import queries from '@/db/queries'
import { SelectRoll } from '@/db/schema'
import Button from '@/shared/components/Button'
import PageWrapper from '@/shared/components/PageWrapper'
import { SPACING } from '@/shared/theme'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const { width } = Dimensions.get('window')

const Home = () => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [rolls, setRolls] = useState<SelectRoll[]>([])

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0 })
      queries.select.rolls().then(setRolls)
    }, [])
  )

  const onRollChange = useCallback(() => {
    queries.select.rolls().then(setRolls)
  }, [])

  const addRollCallback = useCallback(() => {
    router.push('add-roll')
  }, [])

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
      <ScrollView
        ref={scrollViewRef}
        snapToInterval={width} // Snap to the screen width
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        decelerationRate="fast" // Adjust scrolling speed
      >
        {rolls.map((roll, index) => (
          <View style={[styles.rollWrapper, { width: width }]} key={index}>
            <Roll roll={roll} onRollChange={onRollChange} />
          </View>
        ))}
      </ScrollView>
      <View style={{ marginBottom: SPACING.MEDIUM, marginHorizontal: SPACING.MEDIUM }}>
        <Button variant="link" color="secondary" onPress={addRollCallback}>
          Add roll
        </Button>
      </View>
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
