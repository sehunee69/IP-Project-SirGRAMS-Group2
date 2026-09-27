import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LiveAdvisoryBarProps {
  marqueeText?: string;
}

export function LiveAdvisoryBar({ marqueeText }: LiveAdvisoryBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Ionicons name="caret-forward" size={10} color="#FFFFFF" style={styles.playIcon} />
        <Text style={styles.badgeText}>LIVE ADVISORY</Text>
      </View>
      {marqueeText ? (
        <Text style={styles.marqueeText} numberOfLines={1} ellipsizeMode="tail">
          {marqueeText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 8,
    width: '100%',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playIcon: {
    marginTop: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  marqueeText: {
    color: '#FEE2E2',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    flex: 1,
  },
});
