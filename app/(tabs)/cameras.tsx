import Camera from '@/components/Camera'
import queries from '@/db/queries'
import { SelectCamera } from '@/db/schema'
import Button from '@/shared/components/Button'
import PageWrapper from '@/shared/components/PageWrapper'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const { width } = Dimensions.get('window')

const Home = () => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [cameras, setCameras] = useState<SelectCamera[]>([])

  const fetchCameras = useCallback(() => {
    queries.select.cameras().then(cameras => setCameras(cameras))
  }, [])

  const addCamera = useCallback(() => {
    router.push('add-camera')
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchCameras()
    }, [fetchCameras])
  )

  if (cameras.length === 0) {
    return (
      <PageWrapper
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Button variant="filled" color="primary" onPress={addCamera}>
          Add Your First Camera
        </Button>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ScrollView
        ref={scrollViewRef}
        snapToInterval={width} // Snap to the screen width
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        decelerationRate="fast" // Adjust scrolling speed
      >
        <View style={[styles.cameraWrapper, { width: width }]} key="add-roll">
          <Button variant="filled" color="secondary" onPress={addCamera}>
            Add Camera
          </Button>
          {cameras.map((camera, index) => (
            <View style={[styles.cameraWrapper, { width: width }]} key={index}>
              <Camera camera={camera} onDeleteCallback={fetchCameras} />
            </View>
          ))}
        </View>
      </ScrollView>
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  cameraWrapper: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
})

export default Home
