import { getValueFromKeyStore, saveValueToKeyStore } from './utilities'

export type ChangelogEntry = {
  version: string
  date: string
  changes: string[]
}

export const CURRENT_VERSION = '1.0.1'

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.1',
    date: '2025-01-28',
    changes: [
      'Added iCloud backup with rotating weekly slots',
      'Added appearance toggle (System, Light, Dark)',
      'Added changelog and about section in settings',
      'Improved settings layout with scroll support',
    ],
  },
]

const LAST_SEEN_CHANGELOG_VERSION_KEY = 'last_seen_changelog_version'

export function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number)
  const partsB = b.split('.').map(Number)
  const len = Math.max(partsA.length, partsB.length)

  for (let i = 0; i < len; i++) {
    const numA = partsA[i] || 0
    const numB = partsB[i] || 0
    if (numA > numB) return 1
    if (numA < numB) return -1
  }
  return 0
}

export async function shouldShowChangelog(): Promise<boolean> {
  const lastSeen = await getValueFromKeyStore(LAST_SEEN_CHANGELOG_VERSION_KEY)
  if (!lastSeen) return true
  return compareVersions(CURRENT_VERSION, lastSeen) > 0
}

export async function markChangelogSeen(): Promise<void> {
  await saveValueToKeyStore(LAST_SEEN_CHANGELOG_VERSION_KEY, CURRENT_VERSION)
}
