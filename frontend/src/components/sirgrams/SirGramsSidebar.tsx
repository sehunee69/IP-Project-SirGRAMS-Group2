import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ScrollView,
  Animated,
  Switch,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.84, 330);

interface SirgramsSidebarProps {
  visible: boolean;
  onClose: () => void;
  unreadCount?: number;
}

interface RegionOption {
  id: string;
  name: string;
  sublabel: string;
  status: string;
  statusColor: string;
  statusBg: string;
  temp: string;
}

const MONITORED_REGIONS: RegionOption[] = [
  {
    id: 'ncr',
    name: 'Metro Manila (NCR)',
    sublabel: 'Marikina & Pasig Basins',
    status: 'AMBER THUNDERSTORM',
    statusColor: '#B45309',
    statusBg: '#FEF3C7',
    temp: '32°C',
  },
  {
    id: 'cebu',
    name: 'Cebu City (Region VII)',
    sublabel: 'Central Visayas',
    status: 'NORMAL • MONITOR',
    statusColor: '#0284C7',
    statusBg: '#E0F2FE',
    temp: '31°C',
  },
  {
    id: 'batanes',
    name: 'Batanes & Cagayan',
    sublabel: 'Region II • Northern Luzon',
    status: 'TCWS SIGNAL #2',
    statusColor: '#DC2626',
    statusBg: '#FEE2E2',
    temp: '29°C',
  },
  {
    id: 'davao',
    name: 'Davao Oriental',
    sublabel: 'Region XI • Mindanao',
    status: 'SEISMIC WATCH (M 6.2)',
    statusColor: '#DC2626',
    statusBg: '#FEE2E2',
    temp: '32°C',
  },
];

const EMERGENCY_HOTLINES = [
  { agency: 'National Emergency Hotline', number: '911', desc: 'Police, Fire & Medical' },
  { agency: 'NDRRMC Operations Center', number: '(02) 8911-5061', desc: 'Disaster Risk & Rescue' },
  { agency: 'Philippine Red Cross', number: '143', desc: '24/7 Humanitarian & Ambulance' },
  { agency: 'PAGASA Weather Bureau', number: '(02) 8284-0800', desc: 'Typhoon & Flood Advisories' },
  { agency: 'PHIVOLCS Seismic Desk', number: '(02) 8426-1468', desc: 'Earthquake & Volcano Bulletins' },
];

const INITIAL_GO_BAG = [
  { id: 'water', label: 'Drinking Water (3L / person)', checked: true },
  { id: 'meds', label: 'First Aid Kit & Maintenance Meds', checked: true },
  { id: 'light', label: 'Flashlight, Whistle & Extra Batteries', checked: true },
  { id: 'power', label: 'Fully Charged Power Bank & Cables', checked: false },
  { id: 'docs', label: 'Waterproof Pouch (IDs & Cash)', checked: false },
  { id: 'food', label: 'Ready-to-Eat Non-Perishable Food', checked: false },
];

export function SirgramsSidebar({
  visible,
  onClose,
  unreadCount = 3,
}: SirgramsSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [selectedRegion, setSelectedRegion] = useState<RegionOption>(MONITORED_REGIONS[0]);
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);
  const [hotlinesOpen, setHotlinesOpen] = useState(false);
  const [goBagOpen, setGoBagOpen] = useState(false);
  const [goBagItems, setGoBagItems] = useState(INITIAL_GO_BAG);

  // Notification & Telemetry Preferences
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [thunderstormAlerts, setThunderstormAlerts] = useState(true);
  const [seismicAlerts, setSeismicAlerts] = useState(true);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(-DRAWER_WIDTH);
      fadeAnim.setValue(0);
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const navigateTo = (
    route: '/' | '/map' | '/alerts' | '/notifications',
    hazard?: 'Typhoons' | 'Rainfall' | 'Floods' | 'Earthquakes'
  ) => {
    handleClose();
    setTimeout(() => {
      if (route === '/map' && hazard) {
        router.push({ pathname: '/map', params: { hazard } });
      } else {
        router.push(route);
      }
    }, 120);
  };

  const handleCallNumber = (rawNumber: string) => {
    const sanitized = rawNumber.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${sanitized}`).catch(() => {});
  };

  const toggleGoBagItem = (id: string) => {
    setGoBagItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = goBagItems.filter((item) => item.checked).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}>
      <View style={styles.overlayRoot}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Drawer Panel */}
        <Animated.View
          style={[
            styles.drawerContainer,
            { width: DRAWER_WIDTH, transform: [{ translateX: slideAnim }] },
          ]}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Brand Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.brandRow}>
                <View style={styles.brandIconBox}>
                  <MaterialCommunityIcons name="radar" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.brandTitle}>SirGRAMS</Text>
                  <Text style={styles.brandSubtitle}>PH Hazard & Risk Monitor</Text>
                </View>
              </View>
              <Pressable onPress={handleClose} hitSlop={10} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#475569" />
              </Pressable>
            </View>

            {/* Live Telemetry Feed Status Strip */}
            <View style={styles.telemetryStrip}>
              <View style={styles.liveDot} />
              <Text style={styles.telemetryText}>
                PAGASA • PHIVOLCS • NDRRMC SYNCED
              </Text>
            </View>

            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              {/* 1. Monitored Area Selector */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>MONITORED LOCATION</Text>
                <Pressable
                  style={styles.regionCard}
                  onPress={() => setRegionPickerOpen((prev) => !prev)}>
                  <View style={styles.regionTopRow}>
                    <View style={styles.regionTitleGroup}>
                      <Ionicons name="location" size={16} color="#2563EB" />
                      <Text style={styles.regionName}>{selectedRegion.name}</Text>
                    </View>
                    <Ionicons
                      name={regionPickerOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#64748B"
                    />
                  </View>
                  <Text style={styles.regionSublabel}>{selectedRegion.sublabel}</Text>
                  <View style={styles.regionFooterRow}>
                    <View
                      style={[
                        styles.regionStatusBadge,
                        { backgroundColor: selectedRegion.statusBg },
                      ]}>
                      <Text
                        style={[
                          styles.regionStatusText,
                          { color: selectedRegion.statusColor },
                        ]}>
                        {selectedRegion.status}
                      </Text>
                    </View>
                    <Text style={styles.regionTempText}>{selectedRegion.temp}</Text>
                  </View>
                </Pressable>

                {regionPickerOpen && (
                  <View style={styles.regionDropdown}>
                    {MONITORED_REGIONS.map((reg) => {
                      const active = reg.id === selectedRegion.id;
                      return (
                        <Pressable
                          key={reg.id}
                          onPress={() => {
                            setSelectedRegion(reg);
                            setRegionPickerOpen(false);
                          }}
                          style={[
                            styles.regionOptionRow,
                            active && styles.regionOptionRowActive,
                          ]}>
                          <View>
                            <Text
                              style={[
                                styles.regionOptionName,
                                active && { color: '#2563EB', fontWeight: '700' },
                              ]}>
                              {reg.name}
                            </Text>
                            <Text style={styles.regionOptionSub}>{reg.status}</Text>
                          </View>
                          {active && (
                            <Ionicons name="checkmark" size={16} color="#2563EB" />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* 2. Primary Navigation */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>NAVIGATION</Text>

                <Pressable
                  style={[styles.navItem, pathname === '/' && styles.navItemActive]}
                  onPress={() => navigateTo('/')}>
                  <Ionicons
                    name="grid-outline"
                    size={19}
                    color={pathname === '/' ? '#2563EB' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.navItemText,
                      pathname === '/' && styles.navItemTextActive,
                    ]}>
                    Overview Dashboard
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.navItem, pathname === '/map' && styles.navItemActive]}
                  onPress={() => navigateTo('/map')}>
                  <Ionicons
                    name="map-outline"
                    size={19}
                    color={pathname === '/map' ? '#2563EB' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.navItemText,
                      pathname === '/map' && styles.navItemTextActive,
                    ]}>
                    Live Hazard & Wind Map
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.navItem, pathname === '/alerts' && styles.navItemActive]}
                  onPress={() => navigateTo('/alerts')}>
                  <Ionicons
                    name="warning-outline"
                    size={19}
                    color={pathname === '/alerts' ? '#2563EB' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.navItemText,
                      pathname === '/alerts' && styles.navItemTextActive,
                    ]}>
                    Active Bulletins
                  </Text>
                  <View style={styles.countBadgeRed}>
                    <Text style={styles.countBadgeText}>6</Text>
                  </View>
                </Pressable>

                <Pressable
                  style={[
                    styles.navItem,
                    pathname === '/notifications' && styles.navItemActive,
                  ]}
                  onPress={() => navigateTo('/notifications')}>
                  <Ionicons
                    name="notifications-outline"
                    size={19}
                    color={pathname === '/notifications' ? '#2563EB' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.navItemText,
                      pathname === '/notifications' && styles.navItemTextActive,
                    ]}>
                    Notifications
                  </Text>
                  {unreadCount > 0 && (
                    <View style={styles.countBadgeBlue}>
                      <Text style={styles.countBadgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </Pressable>
              </View>

              {/* 3. Quick Hazard Radar Layers */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>RADAR LAYERS (QUICK JUMP)</Text>
                <View style={styles.hazardGrid}>
                  <Pressable
                    style={styles.hazardChip}
                    onPress={() => navigateTo('/map', 'Typhoons')}>
                    <MaterialCommunityIcons
                      name="weather-hurricane"
                      size={16}
                      color="#EA580C"
                    />
                    <Text style={styles.hazardChipText}>Typhoons</Text>
                  </Pressable>

                  <Pressable
                    style={styles.hazardChip}
                    onPress={() => navigateTo('/map', 'Rainfall')}>
                    <Ionicons name="rainy-outline" size={16} color="#0284C7" />
                    <Text style={styles.hazardChipText}>Rainfall</Text>
                  </Pressable>

                  <Pressable
                    style={styles.hazardChip}
                    onPress={() => navigateTo('/map', 'Floods')}>
                    <Ionicons name="water-outline" size={16} color="#D97706" />
                    <Text style={styles.hazardChipText}>Floods</Text>
                  </Pressable>

                  <Pressable
                    style={styles.hazardChip}
                    onPress={() => navigateTo('/map', 'Earthquakes')}>
                    <Ionicons name="pulse-outline" size={16} color="#DC2626" />
                    <Text style={styles.hazardChipText}>Earthquakes</Text>
                  </Pressable>
                </View>
              </View>

              {/* 4. Emergency & Preparedness Tools */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>EMERGENCY & PREPAREDNESS</Text>

                {/* Expandable PH Hotlines */}
                <Pressable
                  style={styles.accordionHeader}
                  onPress={() => setHotlinesOpen((prev) => !prev)}>
                  <View style={styles.accordionLeft}>
                    <View style={[styles.toolIconBox, { backgroundColor: '#FEE2E2' }]}>
                      <Ionicons name="call" size={15} color="#DC2626" />
                    </View>
                    <Text style={styles.accordionTitle}>PH Emergency Hotlines</Text>
                  </View>
                  <Ionicons
                    name={hotlinesOpen ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#64748B"
                  />
                </Pressable>

                {hotlinesOpen && (
                  <View style={styles.accordionBody}>
                    {EMERGENCY_HOTLINES.map((item) => (
                      <Pressable
                        key={item.agency}
                        style={styles.hotlineRow}
                        onPress={() => handleCallNumber(item.number)}>
                        <View style={styles.hotlineInfo}>
                          <Text style={styles.hotlineAgency}>{item.agency}</Text>
                          <Text style={styles.hotlineDesc}>{item.desc}</Text>
                        </View>
                        <View style={styles.callPill}>
                          <Feather name="phone-call" size={11} color="#FFFFFF" />
                          <Text style={styles.callPillText}>{item.number}</Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}

                {/* Expandable Emergency Go-Bag Checklist */}
                <Pressable
                  style={styles.accordionHeader}
                  onPress={() => setGoBagOpen((prev) => !prev)}>
                  <View style={styles.accordionLeft}>
                    <View style={[styles.toolIconBox, { backgroundColor: '#DCFCE7' }]}>
                      <Ionicons name="medkit" size={15} color="#16A34A" />
                    </View>
                    <Text style={styles.accordionTitle}>Go-Bag Checklist</Text>
                  </View>
                  <View style={styles.accordionRight}>
                    <Text style={styles.progressTag}>
                      {checkedCount}/{goBagItems.length}
                    </Text>
                    <Ionicons
                      name={goBagOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#64748B"
                    />
                  </View>
                </Pressable>

                {goBagOpen && (
                  <View style={styles.accordionBody}>
                    {goBagItems.map((item) => (
                      <Pressable
                        key={item.id}
                        style={styles.checkRow}
                        onPress={() => toggleGoBagItem(item.id)}>
                        <Ionicons
                          name={item.checked ? 'checkbox' : 'square-outline'}
                          size={18}
                          color={item.checked ? '#16A34A' : '#94A3B8'}
                        />
                        <Text
                          style={[
                            styles.checkLabel,
                            item.checked && styles.checkLabelDone,
                          ]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* 5. Alert Preferences */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>ALERT PREFERENCES</Text>

                <View style={styles.toggleRow}>
                  <View style={styles.toggleTextCol}>
                    <Text style={styles.toggleTitle}>Critical Evacuation Alerts</Text>
                    <Text style={styles.toggleSub}>TCWS #2+ & Red Flood Warnings</Text>
                  </View>
                  <Switch
                    value={criticalAlerts}
                    onValueChange={setCriticalAlerts}
                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                    thumbColor={criticalAlerts ? '#2563EB' : '#F8FAFC'}
                  />
                </View>

                <View style={styles.toggleRow}>
                  <View style={styles.toggleTextCol}>
                    <Text style={styles.toggleTitle}>Thunderstorm Advisories</Text>
                    <Text style={styles.toggleSub}>PAGASA Yellow / Orange / Red</Text>
                  </View>
                  <Switch
                    value={thunderstormAlerts}
                    onValueChange={setThunderstormAlerts}
                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                    thumbColor={thunderstormAlerts ? '#2563EB' : '#F8FAFC'}
                  />
                </View>

                <View style={styles.toggleRow}>
                  <View style={styles.toggleTextCol}>
                    <Text style={styles.toggleTitle}>Seismic Bulletins (M 5.0+)</Text>
                    <Text style={styles.toggleSub}>PHIVOLCS Earthquake Feed</Text>
                  </View>
                  <Switch
                    value={seismicAlerts}
                    onValueChange={setSeismicAlerts}
                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                    thumbColor={seismicAlerts ? '#2563EB' : '#F8FAFC'}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.drawerFooter}>
              <Text style={styles.footerVersion}>SirGRAMS v1.0 • Build 2026.11</Text>
              <Text style={styles.footerDisclaimer}>
                Data synced with PAGASA & PHIVOLCS
              </Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  drawerContainer: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 16,
  },
  safeArea: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  telemetryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
  },
  telemetryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.4,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 18,
  },
  sectionBlock: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  regionCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 11,
  },
  regionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  regionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  regionName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  regionSublabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginLeft: 22,
  },
  regionFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginLeft: 22,
  },
  regionStatusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  regionStatusText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  regionTempText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  regionDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  regionOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  regionOptionRowActive: {
    backgroundColor: '#EFF6FF',
  },
  regionOptionName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  regionOptionSub: {
    fontSize: 10,
    color: '#64748B',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  navItemActive: {
    backgroundColor: '#EFF6FF',
  },
  navItemText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  navItemTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  countBadgeRed: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  countBadgeBlue: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  hazardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hazardChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  hazardChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  accordionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  progressTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  accordionBody: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    padding: 10,
    gap: 9,
  },
  hotlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  hotlineInfo: {
    flex: 1,
  },
  hotlineAgency: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  hotlineDesc: {
    fontSize: 10,
    color: '#64748B',
  },
  callPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  callPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkLabel: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  checkLabelDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  toggleTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  toggleSub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  drawerFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  footerVersion: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  footerDisclaimer: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
});