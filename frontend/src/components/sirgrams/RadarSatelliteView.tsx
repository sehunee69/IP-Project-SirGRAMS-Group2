import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  G,
  Line,
} from 'react-native-svg';

export function RadarSatelliteView() {
  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.liveIndicator}>
          <View style={styles.redDot} />
          <Text style={styles.liveText}>LIVE RADAR / SATELLITE</Text>
        </View>
        <Text style={styles.updateText}>HIMAWARI-9 IR</Text>
      </View>

      {/* Radar SVG Visualizer */}
      <View style={styles.radarContainer}>
        <Svg viewBox="0 0 360 200" style={styles.radarSvg}>
          <Defs>
            {/* Deep ocean background */}
            <LinearGradient id="radarBg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#0B132B" />
              <Stop offset="1" stopColor="#1C2541" />
            </LinearGradient>

            {/* Core reflectivity heat gradient */}
            <RadialGradient id="coreHeat" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#DC2626" stopOpacity="0.95" />
              <Stop offset="30%" stopColor="#EA580C" stopOpacity="0.85" />
              <Stop offset="55%" stopColor="#FACC15" stopOpacity="0.7" />
              <Stop offset="80%" stopColor="#22C55E" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </RadialGradient>

            {/* Cloud spiral glow */}
            <RadialGradient id="cloudGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <Stop offset="60%" stopColor="#E2E8F0" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Background */}
          <Rect width="360" height="200" fill="url(#radarBg)" />

          {/* Radar range rings */}
          <Circle cx="180" cy="95" r="30" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <Circle cx="180" cy="95" r="60" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <Circle cx="180" cy="95" r="90" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

          {/* Coordinate crosshairs */}
          <Line x1="180" y1="5" x2="180" y2="185" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />
          <Line x1="10" y1="95" x2="350" y2="95" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />

          {/* Typhoon spiral arms (Atmospheric convection bands) */}
          <G opacity="0.85">
            {/* Outer cloud band 1 */}
            <Path
              d="M 180 95 
                 C 230 65, 270 95, 280 140 
                 C 285 160, 260 180, 230 175
                 C 195 170, 160 145, 180 95 Z"
              fill="url(#cloudGlow)"
            />

            {/* Outer cloud band 2 */}
            <Path
              d="M 180 95 
                 C 130 125, 90 95, 80 50 
                 C 75 30, 100 10, 130 15
                 C 165 20, 200 45, 180 95 Z"
              fill="url(#cloudGlow)"
            />

            {/* Inner intense rainband swirl */}
            <Path
              d="M 180 95 
                 C 215 80, 235 105, 230 130 
                 C 225 150, 195 155, 175 140 
                 C 155 125, 160 105, 180 95 Z"
              fill="url(#coreHeat)"
            />

            {/* Heavy precipitation core */}
            <Circle cx="180" cy="95" r="28" fill="url(#coreHeat)" />

            {/* Eye of the typhoon */}
            <Circle cx="180" cy="95" r="6" fill="#0B132B" stroke="#F8FAFC" strokeWidth="1.5" />
          </G>

          {/* Coastline indication (Eastern Luzon nearby) */}
          <Path
            d="M 30 15 Q 45 60 50 110 Q 55 160 70 190"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </Svg>

        {/* Overlay Typhoon Stats Ribbon at Bottom of Image */}
        <View style={styles.statsOverlay}>
          <Text style={styles.systemName}>TYPHOON &quot;AGHON&quot; (ELEANOR)</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>MAX WINDS</Text>
              <Text style={styles.metricValue}>175 km/h</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>POSITION</Text>
              <Text style={styles.metricValue}>15.2°N 122.5°E</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>MOVEMENT</Text>
              <Text style={styles.metricValue}>NNE 15 km/h</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  updateText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  radarContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#0B132B',
  },
  radarSvg: {
    width: '100%',
    height: '100%',
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  systemName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    marginTop: 1,
  },
});
