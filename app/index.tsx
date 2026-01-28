import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from 'react-native-paper'

import { selectCameras, selectRollsByCameraId } from '@/db/queries'
import type { SelectCamera } from '@/db/schema'
import {
  Button,
  CameraCard,
  PageWrapper,
  Typography,
} from '@/shared/components'
import { useTheme } from '@/shared/ThemeContext'
import { ROLL_STATUS_COLORS, SPACING } from '@/shared/theme'
import {
  ROLL_STATUS_LABELS,
  type Roll,
  RollStatus,
  type RollStatusType,
} from '@/shared/types'
import { navigateWithParams } from '@/shared/utilities'

const STATUS_ORDER: RollStatusType[] = [
  RollStatus.EXPOSING,
  RollStatus.EXPOSED,
  RollStatus.DEVELOPED,
  RollStatus.ARCHIVED,
  RollStatus.ABANDONED,
]

const FILTER_STORAGE_KEY = 'film-tracker-status-filters'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type CameraWithRolls = SelectCamera & { rolls: Roll[] }

export default function Index() {
  const { colors } = useTheme()
  const [cameras, setCameras] = useState<CameraWithRolls[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<Set<RollStatusType>>(
    new Set(STATUS_ORDER)
  )

  // Load saved filters on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const saved = await AsyncStorage.getItem(FILTER_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as RollStatusType[]
          setSelectedStatuses(new Set(parsed))
        }
      } catch {}
    }
    loadFilters()
  }, [])

  // Save filters when they change
  useEffect(() => {
    const saveFilters = async () => {
      try {
        await AsyncStorage.setItem(
          FILTER_STORAGE_KEY,
          JSON.stringify([...selectedStatuses])
        )
      } catch {}
    }
    saveFilters()
  }, [selectedStatuses])

  const toggleStatus = (status: RollStatusType) => {
    setSelectedStatuses(prev => {
      const next = new Set(prev)
      if (next.has(status)) {
        if (next.size > 1) {
          next.delete(status)
        }
      } else {
        next.add(status)
      }
      return next
    })
  }

  const loadCameras = useCallback(async () => {
    const cameraList = await selectCameras()
    const camerasWithRolls = await Promise.all(
      cameraList.map(async camera => {
        const rolls = await selectRollsByCameraId(camera.id)
        return { ...camera, rolls: rolls as Roll[] }
      })
    )
    // Sort cameras by last used (most recent roll activity)
    camerasWithRolls.sort((a, b) => {
      const getLastActivity = (rolls: Roll[]) => {
        if (rolls.length === 0) return 0
        return Math.max(
          ...rolls.map(r => new Date(r.updatedAt || r.createdAt).getTime())
        )
      }
      return getLastActivity(b.rolls) - getLastActivity(a.rolls)
    })
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
      <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
      <Typography variant="h2" style={styles.addCameraTitle}>
        Add a Camera
      </Typography>
      <Text style={[styles.addCameraText, { color: colors.textSecondary }]}>
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
        selectedStatuses={selectedStatuses}
        onRefresh={loadCameras}
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
              index === currentIndex
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.textDisabled },
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
          {currentIndex === 0 || cameras.length === 0
            ? 'Film Tracker'
            : cameras[currentIndex - 1]?.name || 'Film Tracker'}
        </Typography>
        <Pressable
          onPress={() => setFilterModalVisible(true)}
          style={styles.headerButton}
        >
          <Ionicons
            name="filter-outline"
            size={24}
            color={
              selectedStatuses.size < STATUS_ORDER.length
                ? colors.primary
                : colors.textPrimary
            }
          />
        </Pressable>
        <Pressable onPress={handleSettings} style={styles.headerButton}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Filter by Status
            </Text>
            {STATUS_ORDER.map(status => {
              const isSelected = selectedStatuses.has(status)
              return (
                <Pressable
                  key={status}
                  style={styles.filterOption}
                  onPress={() => toggleStatus(status)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: colors.textSecondary },
                      isSelected && {
                        backgroundColor: ROLL_STATUS_COLORS[status],
                      },
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.surface}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.filterOptionText,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {ROLL_STATUS_LABELS[status]}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </Pressable>
      </Modal>

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
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
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
  headerButton: {
    padding: SPACING.XSMALL,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    padding: SPACING.MEDIUM,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SMALL,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    marginRight: SPACING.SMALL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOptionText: {
    fontSize: 16,
  },
  pager: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
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
})
