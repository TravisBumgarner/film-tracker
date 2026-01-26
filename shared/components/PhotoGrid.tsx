import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  ActionSheetIOS,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from 'react-native-paper'
import {
  deletePhotoFile,
  pickImage,
  savePhotoToApp,
  takePhoto,
} from '../photoUtils'
import { BORDER_RADIUS, COLORS, SPACING } from '../theme'

type Photo = {
  id: string
  uri: string
}

type Props = {
  photos: Photo[]
  onPhotosChange: (photos: Photo[]) => void
  editable?: boolean
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PHOTO_SIZE = (SCREEN_WIDTH - SPACING.SMALL * 4 - SPACING.XSMALL * 2) / 3

const PhotoGrid: React.FC<Props> = ({
  photos,
  onPhotosChange,
  editable = true,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const handleAddPhoto = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async buttonIndex => {
          if (buttonIndex === 1) {
            await handleTakePhoto()
          } else if (buttonIndex === 2) {
            await handlePickImage()
          }
        }
      )
    } else {
      Alert.alert('Add Photo', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Library', onPress: handlePickImage },
      ])
    }
  }

  const handleTakePhoto = async () => {
    const uri = await takePhoto()
    if (uri) {
      const savedUri = await savePhotoToApp(uri)
      const newPhoto: Photo = {
        id: `photo-${Date.now()}`,
        uri: savedUri,
      }
      onPhotosChange([...photos, newPhoto])
    }
  }

  const handlePickImage = async () => {
    const uri = await pickImage()
    if (uri) {
      const savedUri = await savePhotoToApp(uri)
      const newPhoto: Photo = {
        id: `photo-${Date.now()}`,
        uri: savedUri,
      }
      onPhotosChange([...photos, newPhoto])
    }
  }

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const photo = photos.find(p => p.id === photoId)
          if (photo) {
            await deletePhotoFile(photo.uri)
            onPhotosChange(photos.filter(p => p.id !== photoId))
          }
          setSelectedPhoto(null)
        },
      },
    ])
  }

  const handlePhotoPress = (uri: string) => {
    setSelectedPhoto(uri)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Photos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {editable && (
            <Pressable style={styles.addButton} onPress={handleAddPhoto}>
              <Ionicons name="add" size={32} color={COLORS.NEUTRAL[400]} />
            </Pressable>
          )}
          {photos.map(photo => (
            <Pressable
              key={photo.id}
              onPress={() => handlePhotoPress(photo.uri)}
              onLongPress={() => editable && handleDeletePhoto(photo.id)}
            >
              <Image source={{ uri: photo.uri }} style={styles.photo} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedPhoto(null)}
        >
          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto }}
              style={styles.fullPhoto}
              resizeMode="contain"
            />
          )}
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.MEDIUM,
  },
  label: {
    color: COLORS.NEUTRAL[400],
    marginBottom: SPACING.SMALL,
  },
  grid: {
    flexDirection: 'row',
    gap: SPACING.XSMALL,
  },
  addButton: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    backgroundColor: COLORS.NEUTRAL[900],
    borderRadius: BORDER_RADIUS.MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL[700],
    borderStyle: 'dashed',
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullPhoto: {
    width: SCREEN_WIDTH - SPACING.MEDIUM * 2,
    height: SCREEN_WIDTH - SPACING.MEDIUM * 2,
  },
})

export default PhotoGrid
