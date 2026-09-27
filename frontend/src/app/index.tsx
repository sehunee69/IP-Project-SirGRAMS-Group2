import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SirgramsHeader } from '@/components/sirgrams/SirgramsHeader';
import { SirgramsBottomNav } from '@/components/sirgrams/SirgramsBottomNav';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Top Header */}
      <SirgramsHeader />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Title Block */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Overview</Text>
          <Text style={styles.pageSubtitle}>
            Real-time risk assessment for the Philippine Archipelago.
          </Text>
        </View>

        {/* Elevated Warning Banner */}
        <View style={styles.warningCard}>
          <View style={styles.warningTopRow}>
            <View style={styles.warningIconBadge}>
              <Ionicons name="warning" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Level 2: Elevated Warning</Text>
              <Text style={styles.warningDescription}>
                Multiple active hazard zones detected. Monitor local advisories.
              </Text>
            </View>
          </View>
          <Text style={styles.warningTimestamp}>UPDATED: 10:45 AM PHT</Text>
        </View>

        {/* Hazard Summary Metric Cards (3 Cards) */}
        <View style={styles.metricsStack}>
          {/* Card 1: Earthquakes */}
          <Pressable
            style={({ pressed }) => [styles.metricCard, pressed && styles.cardPressed]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="pulse" size={18} color="#0F172A" />
                <Text style={styles.cardCategoryTitle}>Earthquakes</Text>
              </View>
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>24H</Text>
              </View>
            </View>

            <View style={styles.valueRow}>
              <Text style={styles.majorValue}>5.2</Text>
              <Text style={styles.unitText}>Mw</Text>
            </View>

            <Text style={styles.metricSublabel}>Latest significant event</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.locationText}>LOC: Mindanao</Text>
              <Feather name="arrow-right" size={16} color="#64748B" />
            </View>
          </Pressable>

          {/* Card 2: Typhoons */}
          <Pressable
            style={({ pressed }) => [styles.metricCard, pressed && styles.cardPressed]}
            onPress={() => router.push('/alerts')}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <MaterialCommunityIcons name="weather-hurricane" size={20} color="#0F172A" />
                <Text style={styles.cardCategoryTitle}>Typhoons</Text>
              </View>
              <View style={[styles.timeBadge, styles.activeBadge]}>
                <Text style={[styles.timeBadgeText, styles.activeBadgeText]}>ACTIVE</Text>
              </View>
            </View>

            <View style={styles.valueRow}>
              <Text style={styles.majorValue}>02</Text>
              <Text style={styles.unitText}>Signals</Text>
            </View>

            <Text style={styles.metricSublabel}>TCWS Raised (Batanes)</Text>

            <View style={styles.cardFooter}>
              <View style={styles.trendRow}>
                <Feather name="trending-up" size={14} color="#0284C7" />
                <Text style={styles.trendText}>Intensifying</Text>
              </View>
              <Feather name="arrow-right" size={16} color="#64748B" />
            </View>
          </Pressable>

          {/* Card 3: Flooding */}
          <Pressable
            style={({ pressed }) => [styles.metricCard, pressed && styles.cardPressed]}
            onPress={() => router.push('/map')}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="water" size={18} color="#0F172A" />
                <Text style={styles.cardCategoryTitle}>Flooding</Text>
              </View>
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>SUSCEPT</Text>
              </View>
            </View>

            <View style={styles.valueRow}>
              <Text style={styles.majorValueText}>HIGH</Text>
            </View>

            <Text style={styles.metricSublabel}>Pampanga River Basin</Text>

            <View style={styles.cardFooter}>
              <View style={styles.saturationRow}>
                <View style={styles.saturationRing} />
                <Text style={styles.saturationText}>85% Saturation</Text>
              </View>
              <Feather name="arrow-right" size={16} color="#64748B" />
            </View>
          </Pressable>
        </View>

        {/* PAGASA Rainfall Advisory Scale */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PAGASA RAINFALL ADVISORY SCALE</Text>
        </View>

        <View style={styles.rainfallScaleRow}>
          {/* Yellow Card */}
          <View style={[styles.scaleCard, styles.yellowScale]}>
            <Text style={[styles.scaleName, { color: '#854D0E' }]}>YELLOW</Text>
            <Text style={styles.scaleRange}>7.5–15 mm/hr</Text>
            <Text style={styles.scaleDesc}>Potentially hazardous</Text>
          </View>

          {/* Orange Card */}
          <View style={[styles.scaleCard, styles.orangeScale]}>
            <Text style={[styles.scaleName, { color: '#9A3412' }]}>ORANGE</Text>
            <Text style={styles.scaleRange}>15–30 mm/hr</Text>
            <Text style={styles.scaleDesc}>Hazardous</Text>
          </View>

          {/* Red Card */}
          <View style={[styles.scaleCard, styles.redScale]}>
            <Text style={[styles.scaleName, { color: '#991B1B' }]}>RED</Text>
            <Text style={styles.scaleRange}>&gt;30 mm/hr</Text>
            <Text style={styles.scaleDesc}>Extremely hazardous</Text>
          </View>
        </View>

        {/* Thunderstorm Advisory Card */}
        <View style={styles.thunderstormCard}>
          <View style={styles.thunderstormTopRow}>
            <View style={styles.thunderstormIconContainer}>
              <Ionicons name="flash" size={18} color="#D97706" />
            </View>
            <Text style={styles.thunderstormHeading}>THUNDERSTORM ADVISORY — AMBER</Text>
          </View>
          <Text style={styles.thunderstormText}>
            Potential severe thunderstorms within 2 hours over Metro Manila, Bulacan, and Rizal. Move
            indoors and avoid elevated areas.
          </Text>
        </View>

        {/* Active Alerts List */}
        <View style={styles.alertsSectionHeader}>
          <Text style={styles.alertsTitle}>Active Alerts</Text>
          <Pressable onPress={() => router.push('/alerts')}>
            <Text style={styles.viewAllText}>VIEW ALL (6)</Text>
          </Pressable>
        </View>

        <View style={styles.alertsList}>
          {/* Alert 1: Flash Flood Warning */}
          <Pressable
            style={({ pressed }) => [styles.alertRowCard, pressed && styles.cardPressed]}
            onPress={() => router.push('/alerts')}>
            <View style={styles.alertTopBar}>
              <View style={styles.alertLeftHeader}>
                <View style={[styles.alertIconBadge, { backgroundColor: '#DC2626' }]}>
                  <Ionicons name="warning" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.alertItemTitle}>Flash Flood Warning</Text>
              </View>
              <Text style={styles.alertTime}>10:15 AM</Text>
            </View>
            <Text style={styles.alertBody}>
              Issued for low-lying areas in Metro Manila. Expect rapidly rising water levels.
            </Text>
            <View style={styles.tagsRow}>
              <View style={[styles.pillBadge, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.pillBadgeText, { color: '#DC2626' }]}>CRITICAL</Text>
              </View>
              <View style={[styles.pillBadge, { backgroundColor: '#F1F5F9' }]}>
                <Text style={[styles.pillBadgeText, { color: '#475569' }]}>NCR</Text>
              </View>
            </View>
          </Pressable>

          {/* Alert 2: Coastal Advisory */}
          <Pressable
            style={({ pressed }) => [styles.alertRowCard, pressed && styles.cardPressed]}>
            <View style={styles.alertTopBar}>
              <View style={styles.alertLeftHeader}>
                <View style={[styles.alertIconBadge, { backgroundColor: '#EA580C' }]}>
                  <Ionicons name="water" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.alertItemTitle}>Coastal Advisory</Text>
              </View>
              <Text style={styles.alertTime}>08:30 AM</Text>
            </View>
            <Text style={styles.alertBody}>
              High waves expected along eastern seaboard due to prevailing monsoon.
            </Text>
            <View style={styles.tagsRow}>
              <View style={[styles.pillBadge, { backgroundColor: '#FFEDD5' }]}>
                <Text style={[styles.pillBadgeText, { color: '#EA580C' }]}>MODERATE</Text>
              </View>
              <View style={[styles.pillBadge, { backgroundColor: '#F1F5F9' }]}>
                <Text style={[styles.pillBadgeText, { color: '#475569' }]}>REGION V</Text>
              </View>
            </View>
          </Pressable>

          {/* Alert 3: Volcanic Ash Fall */}
          <Pressable
            style={({ pressed }) => [styles.alertRowCard, pressed && styles.cardPressed]}>
            <View style={styles.alertTopBar}>
              <View style={styles.alertLeftHeader}>
                <View style={[styles.alertIconBadge, { backgroundColor: '#D97706' }]}>
                  <Ionicons name="flame" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.alertItemTitle}>Volcanic Ash Fall</Text>
              </View>
              <Text style={styles.alertTime}>YESTERDAY</Text>
            </View>
            <Text style={styles.alertBody}>
              Minor ash venting recorded. Aviation advisory remains in effect.
            </Text>
            <View style={styles.tagsRow}>
              <View style={[styles.pillBadge, { backgroundColor: '#FEF9C3' }]}>
                <Text style={[styles.pillBadgeText, { color: '#A16207' }]}>WATCH</Text>
              </View>
              <View style={[styles.pillBadge, { backgroundColor: '#F1F5F9' }]}>
                <Text style={[styles.pillBadgeText, { color: '#475569' }]}>ALBAY</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <SirgramsBottomNav activeTab="dashboard" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  titleSection: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  warningTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  warningIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 3,
  },
  warningDescription: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  warningTimestamp: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  metricsStack: {
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardCategoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  activeBadge: {
    backgroundColor: '#EFF6FF',
  },
  activeBadgeText: {
    color: '#2563EB',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: 2,
  },
  majorValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1,
  },
  majorValueText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  metricSublabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  saturationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saturationRing: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  saturationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  rainfallScaleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  scaleCard: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
  },
  yellowScale: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FEF08A',
  },
  orangeScale: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  redScale: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  scaleName: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  scaleRange: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  scaleDesc: {
    fontSize: 9,
    color: '#64748B',
    lineHeight: 12,
  },
  thunderstormCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  thunderstormTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  thunderstormIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thunderstormHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.3,
  },
  thunderstormText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
  },
  alertsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.4,
  },
  alertsList: {
    gap: 10,
  },
  alertRowCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
  },
  alertTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  alertLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  alertTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  alertBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
