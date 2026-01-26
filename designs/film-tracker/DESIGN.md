# Film Tracker - Design Document

## Overview

Film Tracker is a mobile app for analog photographers to track their film rolls across multiple cameras. The app provides a camera-centric view where users swipe horizontally between cameras, manage rolls with status tracking, and add notes/photos to document the development process.

## Technology Stack

Based on the `ideas-down-quickly` reference project:

- **Framework**: React Native 0.76.x with Expo 52.x
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript 5.x
- **Database**: SQLite via expo-sqlite with Drizzle ORM
- **UI Framework**: React Native Paper (Material Design 3)
- **Linting/Formatting**: Biome
- **Build System**: EAS Build
- **Gestures**: react-native-gesture-handler
- **State Management**: React Context API + local component state

## User Experience

### Navigation Model

The app uses a **horizontal paging model** for cameras:

```
[+ Add Camera] <-> [Camera 1] <-> [Camera 2] <-> [Camera 3] ...
     ^                  ^              ^              ^
  Leftmost         Active cameras (swipe left/right)
```

- Swiping **left** from the first camera reveals the "Add Camera" screen
- Swiping **right** moves to the next camera
- Each camera screen displays its rolls organized by status

### Roll Status Flow

Rolls progress through these statuses:

```
IN_CAMERA → EXPOSING → EXPOSED → DEVELOPED → ARCHIVED
```

| Status | Description |
|--------|-------------|
| `IN_CAMERA` | Roll is loaded but not yet being used |
| `EXPOSING` | Currently shooting on this roll |
| `EXPOSED` | Roll is finished, ready for development |
| `DEVELOPED` | Roll has been developed, negatives available |
| `ARCHIVED` | Roll is stored/catalogued |

### Screen Layouts

#### Camera Screen (Per Camera)

```
┌──────────────────────────────────┐
│  [Camera Name]           [Edit]  │
│  Camera details/notes            │
├──────────────────────────────────┤
│  ┌─ EXPOSING ─────────────────┐  │
│  │ • Portra 400 - Roll #3     │  │
│  │   [12 exposures] [notes]   │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌─ IN CAMERA ────────────────┐  │
│  │ • HP5+ - Roll #4           │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌─ EXPOSED ──────────────────┐  │
│  │ • Ektar 100 - Roll #1      │  │
│  │ • Tri-X 400 - Roll #2      │  │
│  └────────────────────────────┘  │
│                                  │
│  [+ Add Roll]                    │
└──────────────────────────────────┘
```

#### Add/Edit Camera Screen (Modal)

```
┌──────────────────────────────────┐
│  Add Camera                      │
├──────────────────────────────────┤
│  Name: [________________]        │
│  Notes: [_______________]        │
│         [_______________]        │
│                                  │
│  [Cancel]           [Save]       │
└──────────────────────────────────┘
```

#### Add/Edit Roll Screen (Modal)

```
┌──────────────────────────────────┐
│  Add Roll                        │
├──────────────────────────────────┤
│  Film Stock: [______________]    │
│  Status: [EXPOSING ▼]            │
│  Frame Count: [36]               │
│  Notes: [_______________]        │
│         [_______________]        │
│                                  │
│  Photos:                         │
│  [+] [img1] [img2] [img3]        │
│                                  │
│  [Cancel]           [Save]       │
└──────────────────────────────────┘
```

#### Roll Detail Screen (Modal)

```
┌──────────────────────────────────┐
│  Portra 400 - Roll #3     [Edit] │
├──────────────────────────────────┤
│  Camera: Leica M6                │
│  Status: EXPOSING                │
│  Frames: 24/36                   │
│  Started: Jan 15, 2026           │
│                                  │
│  Notes:                          │
│  Street photography session...   │
│                                  │
│  Photos:                         │
│  [img1] [img2] [img3]            │
│                                  │
│  [Change Status: EXPOSED →]      │
└──────────────────────────────────┘
```

## Database Schema

### Tables

#### CamerasTable

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | UUID |
| name | TEXT | Camera name (e.g., "Leica M6") |
| notes | TEXT | Optional camera notes |
| createdAt | TEXT | ISO date string |
| updatedAt | TEXT | ISO date string, nullable |
| sortOrder | INTEGER | Position in camera list |

#### RollsTable

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | UUID |
| cameraId | TEXT (FK) | Reference to camera |
| filmStock | TEXT | Film name (e.g., "Portra 400") |
| status | TEXT | IN_CAMERA, EXPOSING, EXPOSED, DEVELOPED, ARCHIVED |
| frameCount | INTEGER | Total frames (12, 24, 36, etc.) |
| framesShot | INTEGER | Frames used (optional tracking) |
| notes | TEXT | Roll notes, nullable |
| createdAt | TEXT | ISO date string |
| updatedAt | TEXT | ISO date string, nullable |
| startedAt | TEXT | When roll started being used, nullable |
| developedAt | TEXT | When roll was developed, nullable |

#### RollPhotosTable

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | UUID |
| rollId | TEXT (FK) | Reference to roll |
| uri | TEXT | Local file URI |
| createdAt | TEXT | ISO date string |
| sortOrder | INTEGER | Photo display order |

## File Structure

```
film-tracker/
├── app/
│   ├── _layout.tsx              # Root layout with providers
│   ├── index.tsx                # Camera pager (main screen)
│   ├── add-camera.tsx           # Add camera modal
│   ├── edit-camera.tsx          # Edit camera modal
│   ├── add-roll.tsx             # Add roll modal
│   ├── edit-roll.tsx            # Edit roll modal
│   ├── roll-detail.tsx          # Roll detail view modal
│   ├── settings.tsx             # App settings
│   └── +not-found.tsx           # 404 page
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── ButtonWrapper.tsx
│   │   ├── TextInput.tsx
│   │   ├── Typography.tsx
│   │   ├── PageWrapper.tsx
│   │   ├── Toast.tsx
│   │   ├── CameraCard.tsx       # Camera display in pager
│   │   ├── RollCard.tsx         # Roll item in camera view
│   │   ├── RollStatusBadge.tsx  # Status indicator
│   │   ├── PhotoGrid.tsx        # Photo display/picker
│   │   └── StatusPicker.tsx     # Status selection dropdown
│   ├── context.tsx              # Global state (toast, etc.)
│   ├── theme.tsx                # Design tokens
│   ├── types.ts                 # TypeScript types
│   └── utilities.ts             # Helper functions
├── db/
│   ├── schema.ts                # Drizzle schema
│   ├── client.ts                # Database client
│   ├── migrations/              # Generated migrations
│   └── queries/
│       ├── index.ts
│       ├── select.ts
│       ├── insert.ts
│       ├── update.ts
│       └── delete.ts
├── assets/
│   ├── images/
│   └── fonts/
├── package.json
├── app.config.js
├── tsconfig.json
├── drizzle.config.ts
├── eas.json
├── biome.json
└── babel.config.js
```

## Component Details

### CameraPager (index.tsx)

The main screen uses a horizontal `FlatList` or `PagerView` for camera navigation:

- `pagingEnabled` for snap-to-camera behavior
- First "page" (index -1 conceptually) is the Add Camera UI
- Uses `onViewableItemsChanged` to track current camera
- Lazy loading of camera content

### RollCard

Displays a roll with:
- Film stock name
- Status badge (color-coded)
- Frame count
- Preview of notes (truncated)
- Tap to open detail view
- Swipe actions for quick status change or delete

### StatusPicker

Dropdown/modal for selecting roll status:
- Shows all 5 statuses
- Current status highlighted
- Updates roll on selection

### PhotoGrid

Grid display for roll photos:
- Uses expo-image-picker for adding photos
- Stored locally via expo-file-system
- Tap to view full size
- Long press to delete

## State Management

### Context (Global)

```typescript
interface AppState {
  toast: { message: string; variant: 'SUCCESS' | 'ERROR' | 'WARNING' } | null
  currentCameraIndex: number  // Track which camera is visible
}
```

### Local State

Each screen manages its own loading/data state using `useState` and `useFocusEffect` for data refresh.

## Roll Status Colors

Using theme colors:

| Status | Color |
|--------|-------|
| IN_CAMERA | NEUTRAL.400 (gray) |
| EXPOSING | PRIMARY.300 (cyan) |
| EXPOSED | WARNING.300 (orange) |
| DEVELOPED | SUCCESS.300 (green) |
| ARCHIVED | SECONDARY.300 (purple) |

## Configuration Files

### biome.json

Copy from ideas-down-quickly with same linting rules.

### drizzle.config.ts

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config
```

### eas.json

Same structure as ideas-down-quickly with profiles:
- dev (internal testing)
- internal (team testing)
- testflight (beta)
- production (app store)

Bundle ID: `com.sillysideprojects.filmtracker`

### app.config.js

Expo config with:
- App name: "Film Tracker"
- Plugins: expo-router, expo-font, expo-sqlite, expo-image-picker
- Portrait orientation
- Dark theme splash screen

## Dependencies

### From ideas-down-quickly (copy versions)

- expo, expo-router, expo-sqlite
- react, react-native
- react-native-paper, react-native-vector-icons
- drizzle-orm, drizzle-kit
- react-native-gesture-handler
- uuid
- use-async-effect
- typescript, biome

### Additional for film-tracker

- expo-image-picker (photo capture/selection)
- expo-file-system (photo storage)
- react-native-pager-view (optional, for camera swiping)

## Implementation Phases

### Phase 1: Project Foundation
- Initialize Expo project
- Configure TypeScript, Biome, Drizzle
- Set up theme and shared components
- Create database schema and migrations

### Phase 2: Camera Management
- Camera pager navigation
- Add/Edit camera screens
- Camera persistence

### Phase 3: Roll Management
- Roll listing per camera
- Add/Edit roll screens
- Status management
- Roll detail view

### Phase 4: Photos & Polish
- Photo picker integration
- Photo storage and display
- Settings screen
- Final polish and testing
