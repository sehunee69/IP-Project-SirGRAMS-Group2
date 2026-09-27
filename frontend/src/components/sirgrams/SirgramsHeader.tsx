import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SirgramsHeaderProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  hasUnreadNotifications?: boolean;
}

export function SirgramsHeader({
  onMenuPress,
  onNotificationPress,
  hasUnreadNotifications = true,
}: SirgramsHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        hitSlop={8}
        onPress={onMenuPress}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Ionicons name="menu-outline" size={24} color="#0F172A" />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>SirGRAMS</Text>
      </View>

      <Pressable
        hitSlop={8}
        onPress={onNotificationPress}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Ionicons name="notifications-outline" size={22} color="#0F172A" />
        {hasUnreadNotifications && <View style={styles.unreadDot} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  unreadDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
