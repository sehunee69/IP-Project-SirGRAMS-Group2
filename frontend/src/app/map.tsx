import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SirgramsHeader } from '@/components/sirgrams/SirgramsHeader';
import { SirgramsBottomNav } from '@/components/sirgrams/SirgramsBottomNav';
import { LiveAdvisoryBar } from '@/components/sirgrams/LiveAdvisoryBar';
import { PhilippineMapSvg } from '@/components/sirgrams/PhilippineMapSvg';

type HazardType = 'Typhoons' | 'Rainfall' | 'Floods' | 'Earthquakes';

export default function MapScreenTyphoon() {
  const router = useRouter();
  const [selectedHazard, setSelectedHazard] = useState<HazardType>('Typhoons');
  const [searchQuery, setSearchQuery] = useState('');
  const [showThreatCard, setShowThreatCard] = useState(true);

  const hazardPills: HazardType[] = ['Typhoons', 'Rainfall', 'Floods', 'Earthquakes'];

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Top Live Advisory Bar */}
      <LiveAdvisoryBar marqueeText="BULACAN — POTENTIAL SEVERE THUNDERSTORMS WITHIN 2 HOURS..." />

      {/* Main Header */}
      <SirgramsHeader />

      {/* Hazard Category Filter Pills */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}>
          {hazardPills.map((hazard) => {
            const isSelected = selectedHazard === hazard;
            return (
              <Pressable
                key={hazard}
                onPress={() => setSelectedHazard(hazard)}
                style={[
                  styles.filterPill,
                  isSelected ? styles.filterPillSelected : styles.filterPillUnselected,
                ]}>
                <Text
                  style={[
                    styles.filterText,
                    isSelected ? styles.filterTextSelected : styles.filterTextUnselected,
                  ]}>
                  {hazard}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            placeholder="Search region, province..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <Pressable style={styles.filterIconBtn}>
            <Ionicons name="options-outline" size={18} color="#334155" />
          </Pressable>
        </View>
      </View>

      {/* Map View Canvas Container */}
      <View style={styles.mapContainer}>
        <PhilippineMapSvg
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onLayerToggle={() => {}}
          onLocationPress={() => {}}
          onLegendPress={() => {}}
        />

        {/* Floating Bottom Threat Card */}
        {showThreatCard && (
          <Pressable
            style={({ pressed }) => [styles.floatingThreatCard, pressed && styles.cardPressed]}
            onPress={() => router.push('/alerts')}>
            {/* Header Row */}
            <View style={styles.threatHeader}>
              <View style={styles.threatBadge}>
                <View style={styles.redDot} />
                <Text style={styles.threatBadgeText}>ACTIVE THREAT</Text>
              </View>
              <Text style={styles.threatTimestamp}>14:30 PHT</Text>
              <Pressable
                hitSlop={8}
                onPress={(e) => {
                  e.stopPropagation();
                  setShowThreatCard(false);
                }}
                style={styles.closeBtn}>
                <Ionicons name="close" size={16} color="#64748B" />
              </Pressable>
            </View>

            {/* Typhoon Title & Status */}
            <Text style={styles.threatTitle}>Typhoon AGHON (ELEANOR)</Text>
            <Text style={styles.threatSubtitle}>
              Cat 3 Equivalent • Tracking NNW • TCWS Signal #2
            </Text>

            {/* 2-Column Metrics Box */}
            <View style={styles.metricsBox}>
              <View style={styles.metricCol}>
                <Text style={styles.colLabel}>MAX WINDS</Text>
                <Text style={styles.colValue}>175 km/h</Text>
              </View>
              <View style={styles.colDivider} />
              <View style={styles.metricCol}>
                <Text style={styles.colLabel}>EST. LANDFALL</Text>
                <Text style={styles.colValue}>~18 hrs</Text>
              </View>
            </View>
          </Pressable>
        )}
      </View>

      {/* Bottom Navigation */}
      <SirgramsBottomNav activeTab="map" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  filterTextUnselected: {
    color: '#334155',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterIconBtn: {
    padding: 4,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#EBF3FA',
  },
  floatingThreatCard: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.85,
  },
  threatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  threatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  threatBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.4,
  },
  threatTimestamp: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 'auto',
    marginRight: 10,
  },
  closeBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  threatTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  threatSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 10,
  },
  metricsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 8,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  colDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  colLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  colValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});
