import Roll from '@/components/Roll'
import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import PageWrapper from '@/shared/components/PageWrapper'
import { SPACING } from '@/shared/theme'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const { width } = Dimensions.get('window')

const Home = () => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [rollIds, setRollIds] = useState<string[]>([])
  const defaultIndex = 1 // Set your desired default index here

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0 })
      queries.select.rolls().then(rolls => setRollIds(rolls.map(roll => roll.id)))
    }, [])
  )

  useEffect(() => {
    // Scroll to the first roll
    if (rollIds.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width * defaultIndex, animated: true })
    }
  }, [rollIds, defaultIndex])

  const addRollCallback = useCallback(() => {
    router.push('add-roll')
  }, [])

  if (rollIds.length === 0) {
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
        <View style={[styles.rollWrapper, { width: width }]} key="add-roll">
          <Button variant="filled" color="secondary" onPress={addRollCallback}>
            Add roll
          </Button>
        </View>
        {rollIds.map((rollId, index) => (
          <View style={[styles.rollWrapper, { width: width }]} key={index}>
            <Roll rollId={rollId} />
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
