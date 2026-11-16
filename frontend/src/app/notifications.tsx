import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type SeverityLevel = 'CRITICAL' | 'WARNING' | 'ADVISORY';
type FilterTab = 'all' | 'unread' | 'critical';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  region: string;
  severity: SeverityLevel;
  isRead: boolean;
  iconType: 'ion' | 'mci';
  iconName: string;
  iconBg: string;
  targetRoute: '/map' | '/alerts';
  hazardParam?: 'Typhoons' | 'Rainfall' | 'Floods' | 'Earthquakes';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Flash Flood Warning — Critical Level',
    message:
      'Marikina & Pampanga River Basins reached 18.4 m (85% soil saturation). Prepare for immediate evacuation in low-lying areas.',
    timestamp: '10 mins ago',
    region: 'NCR • CENTRAL LUZON',
    severity: 'CRITICAL',
    isRead: false,
    iconType: 'ion',
    iconName: 'water',
    iconBg: '#DC2626',
    targetRoute: '/map',
    hazardParam: 'Floods',
  },
  {
    id: 'notif-2',
    title: 'TCWS Signal #2 Raised: Typhoon AGHON',
    message:
      'Typhoon AGHON (ELEANOR) intensified with max winds of 175 km/h. Signal #2 is active over Batanes and Cagayan.',
    timestamp: '28 mins ago',
    region: 'REGION II',
    severity: 'CRITICAL',
    isRead: false,
    iconType: 'mci',
    iconName: 'weather-hurricane',
    iconBg: '#EA580C',
    targetRoute: '/map',
    hazardParam: 'Typhoons',
  },
  {
    id: 'notif-3',
    title: 'M 6.2 Tectonic Earthquake Detected',
    message:
      'PHIVOLCS recorded a Magnitude 6.2 earthquake 38 km SE of Mati, Davao Oriental (Depth: 24 km). Aftershocks are expected.',
    timestamp: '52 mins ago',
    region: 'DAVAO ORIENTAL',
    severity: 'CRITICAL',
    isRead: false,
    iconType: 'ion',
    iconName: 'pulse',
    iconBg: '#B91C1C',
    targetRoute: '/map',
    hazardParam: 'Earthquakes',
  },
  {
    id: 'notif-4',
    title: 'Thunderstorm Advisory — Amber',
    message:
      'Heavy rainfall (48.5 mm/h) with frequent lightning expected over Metro Manila, Bulacan, and Rizal within 2 hours.',
    timestamp: '2 hrs ago',
    region: 'NCR • REGION III • IV-A',
    severity: 'WARNING',
    isRead: true,
    iconType: 'ion',
    iconName: 'flash',
    iconBg: '#D97706',
    targetRoute: '/map',
    hazardParam: 'Rainfall',
  },
  {
    id: 'notif-5',
    title: 'Gale & Coastal Surge Advisory',
    message:
      'Rough sea conditions expected along the eastern seaboard due to prevailing monsoon winds. Small sea craft advised not to venture out.',
    timestamp: '4 hrs ago',
    region: 'REGION V',
    severity: 'ADVISORY',
    isRead: true,
    iconType: 'ion',
    iconName: 'warning',
    iconBg: '#0284C7',
    targetRoute: '/alerts',
  },
];

const SEVERITY_STYLES: Record<
  SeverityLevel,
  { bg: string; text: string }
> = {
  CRITICAL: { bg: '#FEE2E2', text: '#DC2626' },
  WARNING: { bg: '#FEF3C7', text: '#B45309' },
  ADVISORY: { bg: '#E0F2FE', text: '#0284C7' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'unread') return !item.isRead;
    if (activeFilter === 'critical') return item.severity === 'CRITICAL';
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDismissOne = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNotificationPress = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );

    if (item.targetRoute === '/map' && item.hazardParam) {
      router.push({
        pathname: '/map',
        params: { hazard: item.hazardParam },
      });
    } else {
      router.push('/alerts');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <Pressable onPress={handleMarkAllRead} hitSlop={8}>
            <Text style={styles.markReadText}>Mark read</Text>
          </Pressable>
        ) : notifications.length > 0 ? (
          <Pressable onPress={handleClearAll} hitSlop={8}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        ) : (
          <View style={{ width: 56 }} />
        )}
      </View>

      {/* Filter Pills */}
      {notifications.length > 0 && (
        <View style={styles.filterRow}>
          {(
            [
              { key: 'all', label: `All (${notifications.length})` },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'critical', label: 'Critical' },
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                style={[
                  styles.filterPill,
                  isSelected ? styles.filterPillActive : styles.filterPillInactive,
                ]}>
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected
                      ? styles.filterPillTextActive
                      : styles.filterPillTextInactive,
                  ]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Notification Feed or Empty State */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="notifications-off-outline" size={36} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'all'
              ? 'You are all caught up on regional hazard advisories.'
              : `No ${activeFilter} alerts at the moment.`}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {filteredNotifications.map((item) => {
            const badgeStyle = SEVERITY_STYLES[item.severity];
            return (
              <Pressable
                key={item.id}
                onPress={() => handleNotificationPress(item)}
                style={({ pressed }) => [
                  styles.notifCard,
                  !item.isRead && styles.notifCardUnread,
                  pressed && styles.cardPressed,
                ]}>
                {/* Unread Indicator Dot */}
                {!item.isRead && <View style={styles.unreadDot} />}

                <View style={styles.cardRow}>
                  {/* Category Icon */}
                  <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                    {item.iconType === 'mci' ? (
                      <MaterialCommunityIcons
                        name={item.iconName as any}
                        size={18}
                        color="#FFFFFF"
                      />
                    ) : (
                      <Ionicons
                        name={item.iconName as any}
                        size={18}
                        color="#FFFFFF"
                      />
                    )}
                  </View>

                  {/* Body Content */}
                  <View style={styles.cardBody}>
                    <View style={styles.titleRow}>
                      <Text style={styles.notifTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Pressable
                        hitSlop={8}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDismissOne(item.id);
                        }}>
                        <Ionicons name="close" size={16} color="#94A3B8" />
                      </Pressable>
                    </View>

                    <Text style={styles.notifMessage}>{item.message}</Text>

                    <View style={styles.metaFooter}>
                      <View style={styles.tagsGroup}>
                        <View
                          style={[
                            styles.severityPill,
                            { backgroundColor: badgeStyle.bg },
                          ]}>
                          <Text
                            style={[
                              styles.severityText,
                              { color: badgeStyle.text },
                            ]}>
                            {item.severity}
                          </Text>
                        </View>
                        <View style={styles.regionPill}>
                          <Text style={styles.regionText}>{item.region}</Text>
                        </View>
                      </View>

                      <Text style={styles.timestampText}>{item.timestamp}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  unreadCountBadge: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterPillTextInactive: {
    color: '#475569',
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 28,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
  },
  notifCardUnread: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  cardPressed: {
    opacity: 0.75,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    left: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardBody: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  notifMessage: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  metaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  severityPill: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  regionPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  regionText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  timestampText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});