import { TabBarIcon } from '@/shared/components/TabBarIcon'
import { COLORS } from '@/shared/theme'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.dark.opaque,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rolls',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'bulb-sharp' : 'bulb-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'bug' : 'bug-outline'} color={color} />,
        }}
      />
    </Tabs>
  )
}
