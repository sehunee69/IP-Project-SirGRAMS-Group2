import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';

import { SirgramsHeader } from '@/components/sirgrams/SirgramsHeader';
import { SirgramsBottomNav } from '@/components/sirgrams/SirgramsBottomNav';
import { LiveAdvisoryBar } from '@/components/sirgrams/LiveAdvisoryBar';
import {
  PhilippineMapSvg,
  HazardLayer,
} from '@/components/sirgrams/PhilippineMapSvg';

type HazardType = 'Typhoons' | 'Rainfall' | 'Floods' | 'Earthquakes';

const HAZARD_PILLS: HazardType[] = ['Typhoons', 'Rainfall', 'Floods', 'Earthquakes'];

const HAZARD_TO_LAYER: Record<HazardType, HazardLayer> = {
  Typhoons: 'typhoon',
  Rainfall: 'rainfall',
  Floods: 'flood',
  Earthquakes: 'earthquake',
};

const LAYER_TO_HAZARD: Record<HazardLayer, HazardType> = {
  typhoon: 'Typhoons',
  rainfall: 'Rainfall',
  flood: 'Floods',
  earthquake: 'Earthquakes',
};

const THREAT_DATA: Record<
  HazardType,
  {
    marquee: string;
    badge: string;
    badgeBg: string;
    badgeColor: string;
    timestamp: string;
    title: string;
    subtitle: string;
    col1Label: string;
    col1Value: string;
    col2Label: string;
    col2Value: string;
  }
> = {
  Typhoons: {
    marquee: 'TCWS SIGNAL #2 RAISED OVER BATANES & CAGAYAN — TYPHOON AGHON TRACKING NNW...',
    badge: 'ACTIVE THREAT',
    badgeBg: '#FEE2E2',
    badgeColor: '#DC2626',
    timestamp: '14:30 PHT',
    title: 'Typhoon AGHON (ELEANOR)',
    subtitle: 'Cat 3 Equivalent • Tracking NNW • TCWS Signal #2',
    col1Label: 'MAX WINDS',
    col1Value: '175 km/h',
    col2Label: 'EST. LANDFALL',
    col2Value: '~18 hrs',
  },
  Rainfall: {
    marquee: 'BULACAN & NCR — POTENTIAL SEVERE THUNDERSTORMS WITHIN 2 HOURS...',
    badge: 'HEAVY RAINFALL',
    badgeBg: '#E0F2FE',
    badgeColor: '#0284C7',
    timestamp: '14:15 PHT',
    title: 'Southwest Monsoon & Squall Line',
    subtitle: 'Orange Rainfall Warning • Bicol, Eastern Visayas & NCR',
    col1Label: 'PEAK RAINFALL',
    col1Value: '48.5 mm/h',
    col2Label: 'WIND GUSTS',
    col2Value: 'ENE 42 km/h',
  },
  Floods: {
    marquee: 'CRITICAL WATER LEVEL ALERT — PAMPANGA & MARIKINA RIVER BASINS AT 85% SATURATION...',
    badge: 'FLOOD WARNING',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    timestamp: '14:00 PHT',
    title: 'Pampanga & Marikina River Basins',
    subtitle: 'High Susceptibility • Low-lying NCR & Central Luzon',
    col1Label: 'WATER LEVEL',
    col1Value: '18.4 m',
    col2Label: 'SOIL SATURATION',
    col2Value: '85% HIGH',
  },
  Earthquakes: {
    marquee: 'PHIVOLCS SEISMIC BULLETIN — M 6.2 TECTONIC EARTHQUAKE OFF DAVAO ORIENTAL...',
    badge: 'SEISMIC ALERT',
    badgeBg: '#FEE2E2',
    badgeColor: '#DC2626',
    timestamp: '13:48 PHT',
    title: 'M 6.2 — Mati, Davao Oriental',
    subtitle: 'Philippine Trench • Depth: 24 km • Aftershocks Expected',
    col1Label: 'MAGNITUDE',
    col1Value: '6.2 Mw',
    col2Label: 'MAX INTENSITY',
    col2Value: 'PEIS VI',
  },
};

export default function MapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ hazard?: string }>();
  const [selectedHazard, setSelectedHazard] = useState<HazardType>('Typhoons');
  const [searchQuery, setSearchQuery] = useState('');
  const [showThreatCard, setShowThreatCard] = useState(true);

  useEffect(() => {
    if (params.hazard && HAZARD_PILLS.includes(params.hazard as HazardType)) {
      setSelectedHazard(params.hazard as HazardType);
      setShowThreatCard(true);
    }
  }, [params.hazard]);

  const handleSelectHazard = (hazard: HazardType) => {
    setSelectedHazard(hazard);
    setShowThreatCard(true);
  };

  const activeThreat = THREAT_DATA[selectedHazard];

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Top Live Advisory Bar */}
      <LiveAdvisoryBar marqueeText={activeThreat.marquee} />

      {/* Main Header */}
      <SirgramsHeader onNotificationPress={() => router.push('/notifications')} />

      {/* Hazard Category Filter Pills */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}>
          {HAZARD_PILLS.map((hazard) => {
            const isSelected = selectedHazard === hazard;
            return (
              <Pressable
                key={hazard}
                onPress={() => handleSelectHazard(hazard)}
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
            placeholder="Search region, province (e.g., Cebu, Davao)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 ? (
            <Pressable style={styles.filterIconBtn} onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </Pressable>
          ) : (
            <Pressable
              style={styles.filterIconBtn}
              onPress={() => setShowThreatCard((prev) => !prev)}>
              <Ionicons name="options-outline" size={18} color="#334155" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Map View Canvas Container */}
      <View style={styles.mapContainer}>
        <PhilippineMapSvg
          activeLayer={HAZARD_TO_LAYER[selectedHazard]}
          onLayerChange={(layer) => handleSelectHazard(LAYER_TO_HAZARD[layer])}
          searchQuery={searchQuery}
        />

        {/* Floating Bottom Threat Card */}
        {showThreatCard && (
          <Pressable
            style={({ pressed }) => [styles.floatingThreatCard, pressed && styles.cardPressed]}
            onPress={() => router.push('/alerts')}>
            {/* Header Row */}
            <View style={styles.threatHeader}>
              <View style={[styles.threatBadge, { backgroundColor: activeThreat.badgeBg }]}>
                <View style={[styles.redDot, { backgroundColor: activeThreat.badgeColor }]} />
                <Text style={[styles.threatBadgeText, { color: activeThreat.badgeColor }]}>
                  {activeThreat.badge}
                </Text>
              </View>
              <Text style={styles.threatTimestamp}>{activeThreat.timestamp}</Text>
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

            {/* Dynamic Hazard Title & Status */}
            <Text style={styles.threatTitle}>{activeThreat.title}</Text>
            <Text style={styles.threatSubtitle}>{activeThreat.subtitle}</Text>

            {/* 2-Column Metrics Box */}
            <View style={styles.metricsBox}>
              <View style={styles.metricCol}>
                <Text style={styles.colLabel}>{activeThreat.col1Label}</Text>
                <Text style={styles.colValue}>{activeThreat.col1Value}</Text>
              </View>
              <View style={styles.colDivider} />
              <View style={styles.metricCol}>
                <Text style={styles.colLabel}>{activeThreat.col2Label}</Text>
                <Text style={styles.colValue}>{activeThreat.col2Value}</Text>
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