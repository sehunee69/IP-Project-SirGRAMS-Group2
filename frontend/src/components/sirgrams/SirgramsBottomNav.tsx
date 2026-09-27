import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export type SirgramsTab = 'map' | 'dashboard' | 'alerts' | 'data';

interface SirgramsBottomNavProps {
  activeTab: SirgramsTab;
}

export function SirgramsBottomNav({ activeTab }: SirgramsBottomNavProps) {
  const router = useRouter();

  const handleTabPress = (tab: SirgramsTab) => {
    if (tab === activeTab) return;
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'map') {
      router.push('/map');
    } else if (tab === 'alerts') {
      router.push('/alerts');
    } else if (tab === 'data') {
      // In Figma there's a Data Center view, if user taps it on prototype we can route or notify
      router.push('/');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.tabItem}
        onPress={() => handleTabPress('map')}>
        <Ionicons
          name={activeTab === 'map' ? 'map' : 'map-outline'}
          size={22}
          color={activeTab === 'map' ? '#0F172A' : '#94A3B8'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'map' ? styles.activeLabel : styles.inactiveLabel,
          ]}>
          Map
        </Text>
      </Pressable>

      <Pressable
        style={styles.tabItem}
        onPress={() => handleTabPress('dashboard')}>
        <MaterialCommunityIcons
          name={activeTab === 'dashboard' ? 'view-dashboard' : 'view-dashboard-outline'}
          size={22}
          color={activeTab === 'dashboard' ? '#0F172A' : '#94A3B8'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'dashboard' ? styles.activeLabel : styles.inactiveLabel,
          ]}>
          Dashboard
        </Text>
      </Pressable>

      <Pressable
        style={styles.tabItem}
        onPress={() => handleTabPress('alerts')}>
        <View style={styles.iconWithBadge}>
          <Ionicons
            name={activeTab === 'alerts' ? 'warning' : 'warning-outline'}
            size={22}
            color={activeTab === 'alerts' ? '#0F172A' : '#94A3B8'}
          />
          <View style={styles.alertDot} />
        </View>
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'alerts' ? styles.activeLabel : styles.inactiveLabel,
          ]}>
          Alerts
        </Text>
      </Pressable>

      <Pressable
        style={styles.tabItem}
        onPress={() => handleTabPress('data')}>
        <Ionicons
          name={activeTab === 'data' ? 'server' : 'server-outline'}
          size={22}
          color={activeTab === 'data' ? '#0F172A' : '#94A3B8'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'data' ? styles.activeLabel : styles.inactiveLabel,
          ]}>
          Data
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 76 : 60,
    paddingBottom: Platform.OS === 'ios' ? 16 : 4,
    paddingTop: 6,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconWithBadge: {
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    top: -1,
    right: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  activeLabel: {
    fontWeight: '700',
    color: '#0F172A',
  },
  inactiveLabel: {
    fontWeight: '500',
    color: '#94A3B8',
  },
});
