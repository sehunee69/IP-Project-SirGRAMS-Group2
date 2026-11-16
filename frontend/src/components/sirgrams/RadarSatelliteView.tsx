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
  Polyline,
  Text as SvgText,
} from 'react-native-svg';
import { HazardLayer } from './PhilippineMapSvg';

interface RadarSatelliteViewProps {
  activeLayer?: HazardLayer;
}

const LAYER_TELEMETRY: Record<
  HazardLayer,
  {
    header: string;
    source: string;
    title: string;
    metrics: { label: string; value: string; color?: string }[];
  }
> = {
  typhoon: {
    header: 'LIVE WIND & SATELLITE RADAR',
    source: 'HIMAWARI-9 / ECMWF',
    title: 'TYPHOON "AGHON" (ELEANOR)',
    metrics: [
      { label: 'MAX WINDS', value: '175 km/h' },
      { label: 'POSITION', value: '15.2°N 122.5°E' },
      { label: 'MOVEMENT', value: 'NNE 15 km/h' },
    ],
  },
  rainfall: {
    header: 'DOPPLER RAIN & WIND RADAR',
    source: 'PAGASA / WINDY LAYER',
    title: 'ARCHIPELAGO MOISTURE & MONSOON FLOW',
    metrics: [
      { label: 'PEAK RAINFALL', value: '48.5 mm/h', color: '#38BDF8' },
      { label: 'WIND GUSTS', value: 'ESE 42 km/h' },
      { label: 'SURFACE TEMP', value: '29°–32°C' },
    ],
  },
  flood: {
    header: 'HYDROLOGICAL BASIN MONITOR',
    source: 'PROJECT NOAH / PAGASA',
    title: 'MARIKINA & PAMPANGA RIVER BASINS',
    metrics: [
      { label: 'WATER LEVEL', value: '18.4 m (CRITICAL)', color: '#F87171' },
      { label: '24H ACCUM.', value: '164 mm' },
      { label: 'BASIN STATUS', value: 'RED ALERT', color: '#FBBF24' },
    ],
  },
  earthquake: {
    header: 'LIVE SEISMOGRAPH TELEMETRY',
    source: 'PHIVOLCS SEISMIC NET',
    title: 'M 6.2 — 38 KM SE OF MATI, DAVAO ORIENTAL',
    metrics: [
      { label: 'MAGNITUDE', value: 'M 6.2', color: '#F87171' },
      { label: 'DEPTH', value: '24 km (Shallow)' },
      { label: 'MAX INTENSITY', value: 'PEIS VI' },
    ],
  },
};

const RADAR_WIND_STREAKS = [
  { x1: 335, y1: 18, x2: 305, y2: 14 },
  { x1: 290, y1: 32, x2: 262, y2: 27 },
  { x1: 345, y1: 52, x2: 314, y2: 48 },
  { x1: 275, y1: 65, x2: 246, y2: 60 },
  { x1: 325, y1: 88, x2: 295, y2: 83 },
  { x1: 265, y1: 102, x2: 238, y2: 96 },
  { x1: 340, y1: 122, x2: 310, y2: 114 },
  { x1: 65, y1: 28, x2: 72, y2: 10 },
  { x1: 105, y1: 42, x2: 114, y2: 22 },
  { x1: 48, y1: 78, x2: 74, y2: 68 },
  { x1: 118, y1: 95, x2: 146, y2: 88 },
  { x1: 82, y1: 126, x2: 110, y2: 118 },
];

export function RadarSatelliteView({ activeLayer = 'typhoon' }: RadarSatelliteViewProps) {
  const data = LAYER_TELEMETRY[activeLayer];

  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.liveIndicator}>
          <View style={styles.redDot} />
          <Text style={styles.liveText}>{data.header}</Text>
        </View>
        <Text style={styles.updateText}>{data.source}</Text>
      </View>

      {/* Radar / Telemetry Visualizer */}
      <View style={styles.radarContainer}>
        <Svg viewBox="0 0 360 200" style={styles.radarSvg}>
          <Defs>
            {/* Emerald Green Base */}
            <LinearGradient id="radarWindyBg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#3B9C58" />
              <Stop offset="50%" stopColor="#4CB058" />
              <Stop offset="100%" stopColor="#378E54" />
            </LinearGradient>

            {/* Teal / Cyan Moisture Field */}
            <RadialGradient id="radarTeal" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#2689A8" stopOpacity="0.88" />
              <Stop offset="60%" stopColor="#329B96" stopOpacity="0.55" />
              <Stop offset="100%" stopColor="#4CB058" stopOpacity="0" />
            </RadialGradient>

            {/* Cobalt Blue & Indigo-Violet Core */}
            <RadialGradient id="radarViolet" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#6356B0" stopOpacity="0.92" />
              <Stop offset="42%" stopColor="#4364B8" stopOpacity="0.82" />
              <Stop offset="75%" stopColor="#2986A8" stopOpacity="0.45" />
              <Stop offset="100%" stopColor="#45A456" stopOpacity="0" />
            </RadialGradient>

            <RadialGradient id="stormCore" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" />
              <Stop offset="45%" stopColor="#F97316" stopOpacity="0.65" />
              <Stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Emerald Green Atmospheric Background */}
          <Rect width="360" height="200" fill="url(#radarWindyBg)" />

          {/* Teal & Cobalt-Violet Atmospheric Cells */}
          <Circle cx="175" cy="75" r="78" fill="url(#radarTeal)" />
          <Circle cx="115" cy="52" r="55" fill="url(#radarViolet)" />
          <Circle cx="178" cy="36" r="42" fill="url(#radarViolet)" />
          <Circle cx="165" cy="95" r="44" fill="url(#radarViolet)" />
          <Circle cx="205" cy="128" r="46" fill="url(#radarViolet)" />

          {/* Flowing White Wind Streamlines */}
          <G strokeLinecap="round">
            {RADAR_WIND_STREAKS.map((s, idx) => (
              <Line
                key={idx}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke="#FFFFFF"
                strokeWidth="1.4"
                strokeOpacity="0.35"
              />
            ))}
          </G>

          {/* Translucent Philippine Archipelago Outlines Over Weather Field */}
          <G
            fill="rgba(15, 23, 42, 0.14)"
            stroke="#18222F"
            strokeWidth="1"
            strokeLinejoin="round">
            {/* Luzon */}
            <Path d="M 168 18 C 176 16, 185 16, 191 18 C 193 29, 192 43, 189 54 C 185 62, 182 68, 184 74 C 191 76, 198 78, 203 85 C 206 90, 206 96, 202 99 C 198 99, 193 92, 187 87 C 181 82, 174 82, 166 79 C 161 73, 161 62, 164 55 C 166 48, 165 34, 168 18 Z" />
            {/* Mindoro */}
            <Path d="M 162 84 C 167 84, 171 90, 170 96 C 169 101, 164 103, 161 99 C 158 94, 159 87, 162 84 Z" />
            {/* Palawan */}
            <Path d="M 144 112 C 147 114, 138 131, 129 144 C 122 154, 115 160, 111 162 C 109 160, 114 152, 121 142 C 129 130, 139 116, 144 112 Z" />
            {/* Visayas (Panay, Negros, Cebu, Samar, Leyte) */}
            <Path d="M 173 112 C 179 111, 184 116, 182 123 C 179 127, 173 126, 172 121 Z" />
            <Path d="M 186 123 C 190 123, 191 131, 189 139 C 186 142, 183 140, 184 134 Z" />
            <Path d="M 195 121 C 198 124, 198 134, 195 142 C 192 140, 193 130, 193 123 Z" />
            <Path d="M 206 104 C 212 104, 217 109, 218 117 C 215 121, 209 120, 206 115 Z" />
            <Path d="M 205 119 C 209 120, 211 128, 210 137 C 207 138, 205 131, 204 124 Z" />
            {/* Mindanao */}
            <Path d="M 215 146 C 221 152, 226 164, 228 176 L 172 176 C 176 169, 184 164, 193 163 C 201 162, 208 156, 215 146 Z" />
          </G>

          {/* City Labels with Dark Halo */}
          <G>
            {[
              { label: 'Tuguegarao 29°', x: 182, y: 34 },
              { label: 'Manila 32°', x: 162, y: 74 },
              { label: 'Cebu City 31°', x: 196, y: 132 },
              { label: 'Davao City 32°', x: 222, y: 162 },
            ].map((item) => (
              <G key={item.label}>
                <SvgText
                  x={item.x}
                  y={item.y}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="700"
                  stroke="#0F172A"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  fill="#FFFFFF">
                  {item.label}
                </SvgText>
                <SvgText
                  x={item.x}
                  y={item.y}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="700"
                  fill="#FFFFFF">
                  {item.label}
                </SvgText>
              </G>
            ))}
          </G>

          {/* Active Layer Specific Telemetry Overlay */}
          {activeLayer === 'typhoon' && (
            <G>
              <Path
                d="M 248 92 Q 224 80 202 72"
                fill="none"
                stroke="#F97316"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <Circle cx="202" cy="72" r="18" fill="url(#stormCore)" />
              <Circle cx="202" cy="72" r="5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
            </G>
          )}

          {activeLayer === 'flood' && (
            <G>
              <Path
                d="M 20 125 Q 90 120, 140 95 T 230 48 T 340 60 L 340 145 L 20 145 Z"
                fill="#0F172A"
                fillOpacity="0.45"
              />
              <Path
                d="M 20 125 Q 90 120, 140 95 T 230 48 T 340 60"
                fill="none"
                stroke="#FACC15"
                strokeWidth="2.5"
              />
              <Circle cx="230" cy="48" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            </G>
          )}

          {activeLayer === 'earthquake' && (
            <G>
              <Rect x="12" y="34" width="336" height="76" rx="8" fill="rgba(15, 23, 42, 0.65)" />
              <Polyline
                points="20,72 58,72 68,65 75,79 83,70 98,72 132,72 140,52 147,96 154,38 162,106 170,36 178,104 186,48 194,96 202,56 210,88 220,64 230,78 244,70 266,72 340,72"
                fill="none"
                stroke="#F87171"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </G>
          )}
        </Svg>

        {/* Bottom Telemetry Ribbon */}
        <View style={styles.statsOverlay}>
          <Text style={styles.systemName}>{data.title}</Text>
          <View style={styles.metricsRow}>
            {data.metrics.map((metric, idx) => (
              <React.Fragment key={metric.label}>
                {idx > 0 && <View style={styles.metricDivider} />}
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text
                    style={[
                      styles.metricValue,
                      metric.color ? { color: metric.color } : undefined,
                    ]}>
                    {metric.value}
                  </Text>
                </View>
              </React.Fragment>
            ))}
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
    backgroundColor: '#3B9C58',
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