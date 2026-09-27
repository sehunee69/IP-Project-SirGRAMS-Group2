import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, {
  Path,
  Circle,
  Line,
  Polygon,
  G,
  Rect,
  Text as SvgText,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface PhilippineMapProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLayerToggle?: () => void;
  onLocationPress?: () => void;
  onLegendPress?: () => void;
}

export function PhilippineMapSvg({
  onZoomIn,
  onZoomOut,
  onLayerToggle,
  onLocationPress,
  onLegendPress,
}: PhilippineMapProps) {
  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 400 520" style={styles.svgMap}>
        <Defs>
          {/* Ocean background gradient */}
          <LinearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#E2E8F0" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#CBD5E1" stopOpacity="0.8" />
          </LinearGradient>

          {/* Typhoon cone gradient */}
          <LinearGradient id="coneGrad" x1="0" y1="1" x2="0.3" y2="0">
            <Stop offset="0" stopColor="#06B6D4" stopOpacity="0.35" />
            <Stop offset="0.6" stopColor="#38BDF8" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#93C5FD" stopOpacity="0.08" />
          </LinearGradient>

          {/* Eye of storm radial gradient */}
          <RadialGradient id="eyePulse" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
            <Stop offset="60%" stopColor="#EF4444" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Ocean Background */}
        <Rect width="400" height="520" fill="#EBF3FA" />

        {/* Latitude/Longitude grid lines (subtle) */}
        <Line x1="0" y1="120" x2="400" y2="120" stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="3 3" />
        <Line x1="0" y1="240" x2="400" y2="240" stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="3 3" />
        <Line x1="0" y1="360" x2="400" y2="360" stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="3 3" />
        <Line x1="120" y1="0" x2="120" y2="520" stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="3 3" />
        <Line x1="240" y1="0" x2="240" y2="520" stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* Philippine Islands Cartography (Stylized vectors) */}
        <G fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1">
          {/* Batanes Islands */}
          <Circle cx="198" cy="48" r="4" fill="#CBD5E1" />
          <Circle cx="195" cy="62" r="3" fill="#CBD5E1" />

          {/* Babuyan Islands */}
          <Path d="M 188 78 Q 192 74 196 78 Q 194 84 188 78 Z" fill="#CBD5E1" />
          <Circle cx="180" cy="82" r="2.5" fill="#CBD5E1" />

          {/* Northern & Central Luzon */}
          <Path
            d="M 175 92 
               C 185 88, 205 92, 208 108 
               C 212 125, 214 150, 206 170 
               C 200 182, 195 190, 185 198 
               C 182 205, 178 215, 170 216 
               C 165 210, 158 205, 156 195 
               C 152 180, 148 165, 152 150 
               C 155 135, 160 115, 168 100 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />

          {/* Southern Luzon & Bicol Peninsula */}
          <Path
            d="M 170 216 
               C 176 220, 186 225, 198 228 
               C 210 232, 222 245, 226 260 
               C 230 272, 224 280, 218 285 
               C 212 280, 208 270, 202 265 
               C 192 258, 182 250, 174 240 
               C 166 230, 165 220, 170 216 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />

          {/* Catanduanes Island */}
          <Path d="M 232 238 Q 238 242 235 252 Q 228 248 232 238 Z" fill="#E2E8F0" />

          {/* Mindoro Island */}
          <Path
            d="M 145 228 
               C 155 226, 162 235, 160 250 
               C 158 262, 148 268, 140 262 
               C 135 252, 138 236, 145 228 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* Palawan Island */}
          <Path
            d="M 112 265 
               C 118 268, 102 305, 88 335 
               C 78 355, 68 375, 60 388 
               C 56 385, 62 368, 72 345 
               C 85 315, 104 278, 112 265 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* Visayas Islands: Panay */}
          <Path
            d="M 160 280 
               C 172 278, 180 290, 176 305 
               C 170 315, 155 312, 152 300 
               C 150 290, 154 282, 160 280 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* Visayas: Negros */}
          <Path
            d="M 178 300 
               C 184 298, 186 315, 182 335 
               C 178 342, 172 340, 172 325 
               C 172 312, 174 304, 178 300 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* Visayas: Cebu Island */}
          <Path
            d="M 190 295 
               C 195 305, 196 325, 192 342 
               C 188 340, 190 320, 186 302 
               C 186 298, 188 295, 190 295 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* Visayas: Bohol */}
          <Circle cx="204" cy="328" r="8" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />

          {/* Visayas: Samar & Leyte */}
          <Path
            d="M 220 268 
               C 228 275, 230 295, 222 312 
               C 216 324, 210 332, 208 322 
               C 212 305, 214 290, 216 278 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1"
          />

          {/* Mindanao Island */}
          <Path
            d="M 195 348 
               C 210 342, 235 345, 245 360 
               C 252 375, 248 395, 242 415 
               C 236 430, 220 440, 205 432 
               C 190 425, 180 405, 175 390 
               C 165 385, 155 382, 142 390 
               C 138 385, 145 375, 160 372 
               C 170 370, 185 365, 195 348 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />
        </G>

        {/* Typhoon Cone of Uncertainty Projection */}
        <Polygon
          points="204,228 178,110 135,50 185,42 240,95"
          fill="url(#coneGrad)"
          stroke="#0284C7"
          strokeWidth="1"
          strokeDasharray="4 3"
          strokeOpacity="0.6"
        />

        {/* Historical Track (Past - solid dark line with nodes) */}
        <Path
          d="M 255 275 Q 235 250 204 228"
          fill="none"
          stroke="#334155"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Circle cx="255" cy="275" r="3.5" fill="#475569" />
        <Circle cx="230" cy="252" r="3.5" fill="#475569" />

        {/* Forecast Track (Future - dashed orange line) */}
        <Path
          d="M 204 228 Q 185 170 162 105 Q 148 65 138 42"
          fill="none"
          stroke="#F97316"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
        {/* Forecast Waypoints */}
        <Circle cx="185" cy="170" r="3" fill="#F97316" />
        <Circle cx="162" cy="105" r="3" fill="#F97316" />
        <Circle cx="138" cy="42" r="3" fill="#F97316" />

        {/* Current Position Eye of Typhoon (Pulsating Red Rings) */}
        <Circle cx="204" cy="228" r="28" fill="url(#eyePulse)" />
        <Circle cx="204" cy="228" r="16" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 2" />
        <Circle cx="204" cy="228" r="8" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
        <Circle cx="204" cy="228" r="2" fill="#FFFFFF" />

        {/* City Marker Dots and Labels */}
        <G>
          {/* Manila */}
          <Circle cx="170" cy="202" r="3.5" fill="#0F172A" />
          <SvgText x="140" y="206" fontSize="10" fontWeight="bold" fill="#0F172A">
            MANILA
          </SvgText>

          {/* Baguio */}
          <Circle cx="176" cy="148" r="2.5" fill="#475569" />
          <SvgText x="146" y="150" fontSize="8" fontWeight="600" fill="#475569">
            Baguio
          </SvgText>

          {/* Tuguegarao */}
          <Circle cx="196" cy="120" r="2.5" fill="#475569" />
          <SvgText x="202" y="122" fontSize="8" fontWeight="600" fill="#475569">
            Tuguegarao
          </SvgText>

          {/* Angeles */}
          <Circle cx="168" cy="182" r="2.5" fill="#475569" />
          <SvgText x="140" y="184" fontSize="8" fontWeight="500" fill="#475569">
            Angeles
          </SvgText>

          {/* Legazpi */}
          <Circle cx="220" cy="256" r="2.5" fill="#475569" />
          <SvgText x="226" y="258" fontSize="8" fontWeight="600" fill="#475569">
            Legazpi
          </SvgText>

          {/* Cebu City */}
          <Circle cx="194" cy="318" r="2.5" fill="#475569" />
          <SvgText x="200" y="320" fontSize="8" fontWeight="600" fill="#475569">
            Cebu City
          </SvgText>

          {/* Davao */}
          <Circle cx="230" cy="402" r="2.5" fill="#475569" />
          <SvgText x="236" y="405" fontSize="8" fontWeight="600" fill="#475569">
            Davao
          </SvgText>
        </G>

        {/* TCWS Signal #2 Callout Badge on Map */}
        <G x="90" y="105">
          <Rect
            x="0"
            y="0"
            width="108"
            height="30"
            rx="6"
            fill="#EA580C"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <SvgText x="8" y="14" fontSize="9" fontWeight="800" fill="#FFFFFF">
            TCWS SIGNAL #2
          </SvgText>
          <SvgText x="8" y="24" fontSize="7.5" fontWeight="600" fill="#FED7AA">
            BATANES • CAGAYAN
          </SvgText>
          {/* Arrow pointing to area */}
          <Polygon points="108,12 118,15 108,18" fill="#EA580C" />
        </G>
      </Svg>

      {/* Floating Map Controls on Right side */}
      <View style={styles.floatingControls}>
        <Pressable
          style={styles.controlButton}
          onPress={onLayerToggle}>
          <MaterialCommunityIcons name="layers-outline" size={20} color="#334155" />
        </Pressable>

        <Pressable
          style={styles.controlButton}
          onPress={onLocationPress}>
          <Ionicons name="locate-outline" size={20} color="#334155" />
        </Pressable>

        <Pressable
          style={styles.controlButton}
          onPress={onLegendPress}>
          <Ionicons name="list-outline" size={20} color="#334155" />
        </Pressable>

        <View style={styles.zoomGroup}>
          <Pressable
            style={[styles.controlButton, styles.zoomTop]}
            onPress={onZoomIn}>
            <Ionicons name="add" size={18} color="#334155" />
          </Pressable>
          <View style={styles.zoomDivider} />
          <Pressable
            style={[styles.controlButton, styles.zoomBottom]}
            onPress={onZoomOut}>
            <Ionicons name="remove" size={18} color="#334155" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 480,
    backgroundColor: '#EBF3FA',
    position: 'relative',
    overflow: 'hidden',
  },
  svgMap: {
    width: '100%',
    height: '100%',
  },
  floatingControls: {
    position: 'absolute',
    right: 14,
    top: 24,
    gap: 10,
    alignItems: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  zoomGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  zoomTop: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  zoomBottom: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
});
