import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { SirgramsHeader } from '@/components/sirgrams/SirgramsHeader';
import { SirgramsBottomNav } from '@/components/sirgrams/SirgramsBottomNav';
import { LiveAdvisoryBar } from '@/components/sirgrams/LiveAdvisoryBar';
import { RadarSatelliteView } from '@/components/sirgrams/RadarSatelliteView';

type AlertSubTab = 'Typhoon' | 'Flood' | 'Quake';

export default function TyphoonAlertScreen() {
  const [activeSubTab, setActiveSubTab] = useState<AlertSubTab>('Typhoon');

  const forecastData = [
    { period: 'NOW', coords: '15.2°N\n122.5°E', winds: '175km/h', category: 'TY', isNow: true },
    { period: '+24h', coords: '17.4°N\n120.8°E', winds: '165km/h', category: 'TY', isNow: false },
    { period: '+48h', coords: '19.5°N\n118.9°E', winds: '145km/h', category: 'TY', isNow: false },
    { period: '+72h', coords: '21.0°N\n116.5°E', winds: '120km/h', category: 'STS', isNow: false },
    { period: '+96h', coords: '22.5°N\n113.8°E', winds: '90km/h', category: 'TS', isNow: false },
  ];

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Top Advisory Strip */}
      <LiveAdvisoryBar marqueeText="TCWS SIGNAL #2 RAISED OVER BATANES & BABUYAN ISLANDS" />

      {/* Main Header */}
      <SirgramsHeader />

      {/* Hazard Sub-Tabs */}
      <View style={styles.subTabsContainer}>
        {(['Typhoon', 'Flood', 'Quake'] as AlertSubTab[]).map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveSubTab(tab)}
              style={[styles.subTabButton, isActive && styles.activeSubTabButton]}>
              <View style={styles.subTabLabelRow}>
                {isActive && <View style={styles.activeDot} />}
                <Text
                  style={[
                    styles.subTabText,
                    isActive ? styles.activeSubTabText : styles.inactiveSubTabText,
                  ]}>
                  {tab}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* TCWS Signal Banner */}
        <View style={styles.tcwsBanner}>
          <View style={styles.tcwsTextCol}>
            <Text style={styles.tcwsHeading}>TCWS Signal #2 Active</Text>
            <Text style={styles.tcwsSubtext}>
              TYPHOON &apos;AGHON&apos; (ELEANOR) BULLETIN #14
            </Text>
          </View>
          <View style={styles.tcwsCircleBadge}>
            <Text style={styles.tcwsBadgeNumber}>2</Text>
          </View>
        </View>

        {/* Live Radar / Satellite View */}
        <RadarSatelliteView />

        {/* Active Cyclone System Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionLabel}>ACTIVE CYCLONE SYSTEM</Text>
            <Text style={styles.cardTimestamp}>14:30 PHT</Text>
          </View>

          <View style={styles.systemTitleBlock}>
            <Text style={styles.systemLabel}>SYSTEM</Text>
            <Text style={styles.systemNameText}>TYPHOON &quot;AGHON&quot; (ELEANOR)</Text>
          </View>

          {/* 6-Grid System Specs */}
          <View style={styles.specsGrid}>
            <View style={styles.specCell}>
              <Text style={styles.specKey}>COORDINATES</Text>
              <Text style={styles.specVal}>15.2°N, 122.5°E</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specKey}>MOVEMENT</Text>
              <Text style={styles.specVal}>NNE 15 km/h</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specKey}>MAX WINDS</Text>
              <Text style={styles.specVal}>175 km/h</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specKey}>GUSTS</Text>
              <Text style={styles.specVal}>Up to 215 km/h</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specKey}>PRESSURE</Text>
              <Text style={styles.specVal}>935 hPa</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specKey}>CATEGORY</Text>
              <Text style={styles.specVal}>Typhoon</Text>
            </View>
          </View>

          {/* 5-Day Track Forecast */}
          <View style={styles.forecastSection}>
            <Text style={styles.forecastHeaderTitle}>5-DAY TRACK FORECAST</Text>
            <View style={styles.forecastRow}>
              {forecastData.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.forecastCol,
                    item.isNow && styles.forecastColActive,
                  ]}>
                  <Text
                    style={[
                      styles.forecastPeriod,
                      item.isNow && styles.forecastPeriodActive,
                    ]}>
                    {item.period}
                  </Text>
                  <Text style={styles.forecastCoords}>{item.coords}</Text>
                  <Text
                    style={[
                      styles.forecastWinds,
                      item.isNow && styles.forecastWindsActive,
                    ]}>
                    {item.winds}
                  </Text>
                  <Text style={styles.forecastCategory}>{item.category}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* PAGASA Rainfall Advisory Section */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionLabel}>PAGASA RAINFALL ADVISORY</Text>
            <Text style={styles.cardTimestamp}>VALID UNTIL 20:00 PHT</Text>
          </View>

          {/* Red Warning */}
          <View style={[styles.rainfallBlock, styles.redWarningBlock]}>
            <View style={styles.warningStripRed} />
            <View style={styles.rainfallBlockContent}>
              <Text style={styles.warningLevelRed}>RED WARNING &gt;30 mm/hr</Text>
              <Text style={styles.warningLocations}>Cagayan, Batanes</Text>
              <Text style={styles.warningDetails}>
                Extremely hazardous. Flashfloods and landslides are likely.
              </Text>
            </View>
          </View>

          {/* Orange Warning */}
          <View style={[styles.rainfallBlock, styles.orangeWarningBlock]}>
            <View style={styles.warningStripOrange} />
            <View style={styles.rainfallBlockContent}>
              <Text style={styles.warningLevelOrange}>ORANGE WARNING 15-30 mm/hr</Text>
              <Text style={styles.warningLocations}>
                NCR, Pangasinan, Ilocos Norte, Apayao
              </Text>
              <Text style={styles.warningDetails}>
                Hazardous. Flooding likely in low-lying areas; move to higher ground.
              </Text>
            </View>
          </View>

          {/* Yellow Warning */}
          <View style={[styles.rainfallBlock, styles.yellowWarningBlock]}>
            <View style={styles.warningStripYellow} />
            <View style={styles.rainfallBlockContent}>
              <Text style={styles.warningLevelYellow}>YELLOW WARNING 7.5-15 mm/hr</Text>
              <Text style={styles.warningLocations}>
                Zambales, Bataan, Cavite, Batangas, Rizal, Laguna, Quezon
              </Text>
              <Text style={styles.warningDetails}>
                Heavy rains. Flooding possible in flood-prone areas.
              </Text>
            </View>
          </View>
        </View>

        {/* Storm Surge Warning */}
        <View style={styles.stormSurgeCard}>
          <View style={styles.surgeHeaderRow}>
            <Ionicons name="water-outline" size={18} color="#2563EB" />
            <Text style={styles.surgeTitle}>STORM SURGE WARNING</Text>
          </View>
          <Text style={styles.surgeCoastline}>
            1–2 m surge — Southern Batanes coastline
          </Text>
          <Text style={styles.surgeBody}>
            Low-lying coastal areas may experience flooding. Fisherfolk advised not to sail.
          </Text>
        </View>

        {/* Tropical Cyclone Bulletin #14 (Dark Navy Card) */}
        <View style={styles.navyBulletinCard}>
          <View style={styles.bulletinTopRow}>
            <Text style={styles.bulletinTitle}>TROPICAL CYCLONE BULLETIN #14</Text>
            <View style={styles.bulletinBadgeRow}>
              <View style={styles.bulletinActivePill}>
                <Text style={styles.bulletinActiveText}>ACTIVE</Text>
              </View>
              <View style={styles.bulletinAgencyPill}>
                <Text style={styles.bulletinAgencyText}>PAGASA DOST</Text>
              </View>
            </View>
          </View>

          <View style={styles.bulletinDivider} />

          <View style={styles.bulletinSection}>
            <Text style={styles.bulletinSectionHeading}>HEAVY RAINFALL OUTLOOK:</Text>
            <Text style={styles.bulletinSectionBody}>
              Forecast accumulated rainfall 100-200 mm in northern Luzon, southern Cagayan,
              Camarines Norte/Sur, Catanduanes.
            </Text>
          </View>

          <View style={styles.bulletinSection}>
            <Text style={styles.bulletinSectionHeading}>SEVERE WINDS:</Text>
            <Text style={styles.bulletinSectionBody}>
              Minor to moderate impacts from gale-force winds within 200 km of Signal No. 2 areas.
            </Text>
          </View>

          <View style={styles.bulletinSection}>
            <Text style={styles.bulletinSectionHeading}>COASTAL WATER CONDITIONS:</Text>
            <Text style={styles.bulletinSectionBody}>
              Gale Warning in effect for Aurora, Quezon, and Bicol Region coastal waters.
            </Text>
          </View>

          <View style={styles.bulletinFooter}>
            <Text style={styles.bulletinFooterText}>
              Data sourced from PAGASA • PHIVOLCS • NDRRMC • DPWH-BWSR FFMC. Last updated: 13:00 PHT
              - 01 Sep 2026
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <SirgramsBottomNav activeTab="alerts" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  subTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSubTabButton: {
    borderBottomWidth: 2.5,
    borderBottomColor: '#DC2626',
  },
  subTabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  subTabText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  activeSubTabText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  inactiveSubTabText: {
    fontWeight: '600',
    color: '#64748B',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  tcwsBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    backgroundColor: '#EA580C',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tcwsTextCol: {
    flex: 1,
  },
  tcwsHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  tcwsSubtext: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FED7AA',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  tcwsCircleBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  tcwsBadgeNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#EA580C',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  cardTimestamp: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  systemTitleBlock: {
    marginBottom: 12,
  },
  systemLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  systemNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specCell: {
    width: '48%',
  },
  specKey: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  forecastSection: {
    marginTop: 12,
  },
  forecastHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 6,
  },
  forecastColActive: {
    backgroundColor: '#FFF7ED',
  },
  forecastPeriod: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  forecastPeriodActive: {
    color: '#EA580C',
    fontWeight: '800',
  },
  forecastCoords: {
    fontSize: 8.5,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 4,
    lineHeight: 11,
  },
  forecastWinds: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  forecastWindsActive: {
    color: '#EA580C',
    fontWeight: '800',
  },
  forecastCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  rainfallBlock: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  redWarningBlock: {
    backgroundColor: '#FEF2F2',
  },
  orangeWarningBlock: {
    backgroundColor: '#FFF7ED',
  },
  yellowWarningBlock: {
    backgroundColor: '#FEFCE8',
  },
  warningStripRed: {
    width: 4,
    backgroundColor: '#DC2626',
  },
  warningStripOrange: {
    width: 4,
    backgroundColor: '#EA580C',
  },
  warningStripYellow: {
    width: 4,
    backgroundColor: '#CA8A04',
  },
  rainfallBlockContent: {
    flex: 1,
    padding: 10,
  },
  warningLevelRed: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.4,
  },
  warningLevelOrange: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.4,
  },
  warningLevelYellow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A16207',
    letterSpacing: 0.4,
  },
  warningLocations: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginVertical: 2,
  },
  warningDetails: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  stormSurgeCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
  },
  surgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  surgeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  surgeCoastline: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  surgeBody: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  navyBulletinCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
  },
  bulletinTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bulletinTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.4,
  },
  bulletinBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  bulletinActivePill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bulletinActiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bulletinAgencyPill: {
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bulletinAgencyText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  bulletinDivider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 10,
  },
  bulletinSection: {
    marginBottom: 10,
  },
  bulletinSectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bulletinSectionBody: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  bulletinFooter: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  bulletinFooterText: {
    fontSize: 9.5,
    color: '#64748B',
    lineHeight: 14,
  },
});
