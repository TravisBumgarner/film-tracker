import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import { selectCameras, selectRollsByCameraId } from '@/db/queries'
import type { SelectCamera } from '@/db/schema'
import {
  Button,
  CameraCard,
  PageWrapper,
  Typography,
} from '@/shared/components'
import { COLORS, SPACING } from '@/shared/theme'
import type { Roll } from '@/shared/types'
import { navigateWithParams } from '@/shared/utilities'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type CameraWithRolls = SelectCamera & { rolls: Roll[] }

export default function Index() {
  const [cameras, setCameras] = useState<CameraWithRolls[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const loadCameras = useCallback(async () => {
    const cameraList = await selectCameras()
    const camerasWithRolls = await Promise.all(
      cameraList.map(async camera => {
        const rolls = await selectRollsByCameraId(camera.id)
        return { ...camera, rolls: rolls as Roll[] }
      })
    )
    setCameras(camerasWithRolls)
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadCameras()
    }, [loadCameras])
  )

  const handleAddCamera = () => {
    router.push('/add-camera')
  }

  const handleEditCamera = (cameraId: string) => {
    navigateWithParams('edit-camera', { cameraId })
  }

  const handleSettings = () => {
    router.push('/settings')
  }

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index)
      }
    },
    []
  )

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  }

  const renderAddCameraPage = () => (
    <View style={[styles.page, styles.addCameraPage]}>
      <Ionicons name="camera-outline" size={64} color={COLORS.NEUTRAL[500]} />
      <Typography variant="h2" style={styles.addCameraTitle}>
        Add a Camera
      </Typography>
      <Text style={styles.addCameraText}>
        Swipe right to see your cameras, or add a new one here
      </Text>
      <View style={styles.addCameraButton}>
        <Button color="primary" variant="filled" onPress={handleAddCamera}>
          + Add Camera
        </Button>
      </View>
    </View>
  )

  const renderCameraPage = ({ item }: { item: CameraWithRolls }) => (
    <View style={styles.page}>
      <CameraCard
        camera={item}
        rolls={item.rolls}
        onEditCamera={() => handleEditCamera(item.id)}
      />
    </View>
  )

  const data = [{ id: 'add-camera', isAddPage: true }, ...cameras]

  const renderItem = ({ item }: { item: any }) => {
    if (item.isAddPage) {
      return renderAddCameraPage()
    }
    return renderCameraPage({ item })
  }

  const renderPageIndicator = () => {
    if (data.length <= 1) return null
    return (
      <View style={styles.pageIndicator}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    )
  }

  return (
    <PageWrapper style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1" style={styles.title}>
          Film Tracker
        </Typography>
        <Pressable onPress={handleSettings} style={styles.settingsButton}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={COLORS.NEUTRAL[300]}
          />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.pager}
        initialScrollIndex={cameras.length > 0 ? 1 : 0}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH - SPACING.SMALL * 2,
          offset: (SCREEN_WIDTH - SPACING.SMALL * 2) * index,
          index,
        })}
      />

      {renderPageIndicator()}
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.SMALL,
    paddingBottom: SPACING.SMALL,
  },
  title: {
    flex: 1,
    textAlign: 'left',
    backgroundColor: 'transparent',
  },
  settingsButton: {
    padding: SPACING.XSMALL,
  },
  pager: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH - SPACING.SMALL * 2,
    paddingHorizontal: SPACING.SMALL,
  },
  addCameraPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCameraTitle: {
    marginTop: SPACING.MEDIUM,
    marginBottom: SPACING.XSMALL,
  },
  addCameraText: {
    color: COLORS.NEUTRAL[400],
    textAlign: 'center',
    marginBottom: SPACING.LARGE,
    paddingHorizontal: SPACING.XLARGE,
  },
  addCameraButton: {
    width: '80%',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.MEDIUM,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.PRIMARY[300],
  },
  dotInactive: {
    backgroundColor: COLORS.NEUTRAL[600],
  },
})
