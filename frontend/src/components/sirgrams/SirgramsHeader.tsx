import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SirgramsSidebar } from './SirGramsSidebar';

interface SirgramsHeaderProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  hasUnreadNotifications?: boolean;
  unreadCount?: number;
}

export function SirgramsHeader({
  onMenuPress,
  onNotificationPress,
  hasUnreadNotifications = true,
  unreadCount = 3,
}: SirgramsHeaderProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleOpenMenu = () => {
    setSidebarVisible(true);
    onMenuPress?.();
  };

  return (
    <>
      <View style={styles.header}>
        {/* Left Hamburger Menu Button */}
        <Pressable
          onPress={handleOpenMenu}
          hitSlop={10}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
          <Ionicons name="menu" size={24} color="#0F172A" />
        </Pressable>

        {/* Center Brand Identity */}
        <View style={styles.brandCenter}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="radar" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.brandText}>SirGRAMS</Text>
        </View>

        {/* Right Notification Bell */}
        <Pressable
          onPress={onNotificationPress}
          hitSlop={10}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
          <Ionicons name="notifications-outline" size={22} color="#0F172A" />
          {hasUnreadNotifications && <View style={styles.unreadDot} />}
        </Pressable>
      </View>

      {/* Slide-Over Sidebar Drawer */}
      <SirgramsSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        unreadCount={hasUnreadNotifications ? unreadCount : 0}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pressed: {
    opacity: 0.65,
    backgroundColor: '#F1F5F9',
  },
  brandCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  unreadDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});