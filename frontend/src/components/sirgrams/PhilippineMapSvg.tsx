import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
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

export type HazardLayer = 'typhoon' | 'rainfall' | 'flood' | 'earthquake';

interface PhilippineMapProps {
  activeLayer?: HazardLayer;
  onLayerChange?: (layer: HazardLayer) => void;
  searchQuery?: string;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLayerToggle?: () => void;
  onLocationPress?: () => void;
  onLegendPress?: () => void;
}

const CITIES = [
  { name: 'TUGUEGARAO', label: 'Tuguegarao', x: 198, y: 74, labelX: 198, labelY: 85, temp: '29°', major: false },
  { name: 'MANILA', label: 'Manila', x: 176, y: 156, labelX: 158, labelY: 165, temp: '32°', major: true },
  { name: 'PUERTO PRINCESA', label: 'Puerto Princesa', x: 108, y: 268, labelX: 92, labelY: 277, temp: '29°', major: false },
  { name: 'CEBU CITY', label: 'Cebu City', x: 219, y: 256, labelX: 219, labelY: 265, temp: '31°', major: false },
  { name: 'DAVAO CITY', label: 'Davao City', x: 252, y: 332, labelX: 258, labelY: 341, temp: '32°', major: false },
  { name: 'SIASI', label: 'Siasi', x: 156, y: 361, labelX: 156, labelY: 373, temp: '30°', major: false },
];

// Flowing wind streamlines matching the trade-wind & monsoonal circulation
const WIND_STREAKS: { x1: number; y1: number; x2: number; y2: number }[] = [
  // Philippine Sea (East -> WNW flow)
  { x1: 365, y1: 35, x2: 335, y2: 28 },
  { x1: 320, y1: 52, x2: 292, y2: 44 },
  { x1: 380, y1: 78, x2: 348, y2: 72 },
  { x1: 335, y1: 95, x2: 304, y2: 89 },
  { x1: 285, y1: 88, x2: 258, y2: 80 },
  { x1: 372, y1: 122, x2: 340, y2: 118 },
  { x1: 325, y1: 135, x2: 292, y2: 131 },
  { x1: 278, y1: 128, x2: 248, y2: 123 },
  { x1: 385, y1: 165, x2: 352, y2: 162 },
  { x1: 338, y1: 176, x2: 305, y2: 173 },
  { x1: 290, y1: 170, x2: 258, y2: 166 },
  { x1: 368, y1: 208, x2: 336, y2: 204 },
  { x1: 318, y1: 218, x2: 286, y2: 214 },
  { x1: 274, y1: 212, x2: 246, y2: 207 },
  { x1: 382, y1: 252, x2: 350, y2: 246 },
  { x1: 332, y1: 262, x2: 300, y2: 256 },
  { x1: 288, y1: 256, x2: 260, y2: 250 },
  { x1: 365, y1: 298, x2: 335, y2: 288 },
  { x1: 318, y1: 308, x2: 290, y2: 298 },
  { x1: 375, y1: 345, x2: 348, y2: 332 },
  { x1: 330, y1: 355, x2: 304, y2: 342 },
  { x1: 355, y1: 388, x2: 328, y2: 374 },
  // West Philippine Sea (South -> North / NNW flow)
  { x1: 68, y1: 68, x2: 72, y2: 40 },
  { x1: 112, y1: 75, x2: 118, y2: 46 },
  { x1: 52, y1: 122, x2: 60, y2: 94 },
  { x1: 105, y1: 128, x2: 114, y2: 98 },
  { x1: 142, y1: 118, x2: 148, y2: 88 },
  { x1: 45, y1: 175, x2: 68, y2: 162 },
  { x1: 98, y1: 178, x2: 122, y2: 165 },
  { x1: 60, y1: 222, x2: 88, y2: 212 },
  { x1: 118, y1: 215, x2: 146, y2: 206 },
  // Sulu Sea & Celebes Sea (SW -> NE / Eastward flow)
  { x1: 42, y1: 265, x2: 70, y2: 256 },
  { x1: 142, y1: 268, x2: 170, y2: 260 },
  { x1: 178, y1: 286, x2: 205, y2: 278 },
  { x1: 65, y1: 318, x2: 94, y2: 310 },
  { x1: 125, y1: 322, x2: 154, y2: 314 },
  { x1: 185, y1: 315, x2: 212, y2: 308 },
  { x1: 88, y1: 365, x2: 116, y2: 358 },
  { x1: 192, y1: 365, x2: 218, y2: 356 },
  { x1: 278, y1: 382, x2: 302, y2: 368 },
];

export function PhilippineMapSvg({
  activeLayer: controlledLayer,
  onLayerChange,
  searchQuery = '',
  onZoomIn,
  onZoomOut,
  onLayerToggle,
  onLocationPress,
  onLegendPress,
}: PhilippineMapProps) {
  const [internalLayer, setInternalLayer] = useState<HazardLayer>('typhoon');
  const [zoom, setZoom] = useState<number>(1);
  const [showLegend, setShowLegend] = useState<boolean>(false);

  const activeLayer = controlledLayer ?? internalLayer;
  const normalizedQuery = searchQuery.trim().toUpperCase();

  const handleCycleLayer = () => {
    const order: HazardLayer[] = ['typhoon', 'rainfall', 'flood', 'earthquake'];
    const next = order[(order.indexOf(activeLayer) + 1) % order.length];
    setInternalLayer(next);
    onLayerChange?.(next);
    onLayerToggle?.();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 2.25));
    onZoomIn?.();
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
    onZoomOut?.();
  };

  const handleResetZoom = () => {
    setZoom(1);
    onLocationPress?.();
  };

  const handleToggleLegend = () => {
    setShowLegend((prev) => !prev);
    onLegendPress?.();
  };

  const isAtmosphericView = activeLayer === 'typhoon' || activeLayer === 'rainfall';
  const isSeismicGray = activeLayer === 'earthquake';

  const baseBg = isAtmosphericView
    ? '#47A854'
    : isSeismicGray
    ? '#D1D5DB'
    : '#EBF3FA';

  const cx = 195;
  const cy = 200;
  const mapTransform = `translate(${cx * (1 - zoom)}, ${cy * (1 - zoom)}) scale(${zoom})`;

  return (
    <View style={[styles.container, { backgroundColor: baseBg }]}>
      <Svg
        viewBox="0 0 400 540"
        preserveAspectRatio="xMidYMid meet"
        style={styles.svgMap}>
        <Defs>
          {/* Emerald Green Atmospheric Base Gradient */}
          <LinearGradient id="windyGreenField" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#3B9C58" />
            <Stop offset="45%" stopColor="#4CB058" />
            <Stop offset="80%" stopColor="#45A456" />
            <Stop offset="100%" stopColor="#378E54" />
          </LinearGradient>

          {/* Teal / Cyan Moisture Transition Zone */}
          <RadialGradient id="atmosTeal" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#2689A8" stopOpacity="0.88" />
            <Stop offset="55%" stopColor="#329B96" stopOpacity="0.62" />
            <Stop offset="100%" stopColor="#4CB058" stopOpacity="0" />
          </RadialGradient>

          {/* Deep Cobalt Blue & Indigo-Violet Core Zone */}
          <RadialGradient id="atmosCobaltViolet" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#6356B0" stopOpacity="0.92" />
            <Stop offset="38%" stopColor="#4364B8" stopOpacity="0.85" />
            <Stop offset="70%" stopColor="#2986A8" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#45A456" stopOpacity="0" />
          </RadialGradient>

          {/* Streamline fade gradient */}
          <LinearGradient id="windGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.06" />
          </LinearGradient>

          {/* Typhoon cone gradient */}
          <LinearGradient id="coneGrad" x1="0" y1="1" x2="0.3" y2="0">
            <Stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.28" />
            <Stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.08" />
          </LinearGradient>

          {/* Eye of storm radial gradient */}
          <RadialGradient id="eyePulse" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" />
            <Stop offset="55%" stopColor="#F97316" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </RadialGradient>

          {/* Flood inundation radial highlight */}
          <RadialGradient id="floodHigh" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#DC2626" stopOpacity="0.72" />
            <Stop offset="65%" stopColor="#F59E0B" stopOpacity="0.42" />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Base Background */}
        <Rect
          width="400"
          height="540"
          fill={isAtmosphericView ? 'url(#windyGreenField)' : baseBg}
        />

        <G transform={mapTransform}>
          {/* =========================================================
              1. ATMOSPHERIC COLOR FIELD & WIND STREAMLINES (UNDER LAND)
             ========================================================= */}
          {isAtmosphericView && (
            <G>
              {/* Broad Teal / Blue Atmospheric Corridor along Archipelago */}
              <Circle cx="182" cy="115" r="95" fill="url(#atmosTeal)" />
              <Circle cx="120" cy="110" r="85" fill="url(#atmosTeal)" />
              <Circle cx="195" cy="215" r="95" fill="url(#atmosTeal)" />
              <Circle cx="155" cy="285" r="95" fill="url(#atmosTeal)" />
              <Circle cx="235" cy="325" r="90" fill="url(#atmosTeal)" />

              {/* Cobalt Blue & Indigo-Violet Cores */}
              <Circle cx="188" cy="96" r="56" fill="url(#atmosCobaltViolet)" />
              <Circle cx="174" cy="142" r="44" fill="url(#atmosCobaltViolet)" />
              <Circle cx="76" cy="108" r="52" fill="url(#atmosCobaltViolet)" />
              <Circle cx="156" cy="204" r="46" fill="url(#atmosCobaltViolet)" />
              <Circle cx="152" cy="264" r="48" fill="url(#atmosCobaltViolet)" />
              <Circle cx="242" cy="324" r="54" fill="url(#atmosCobaltViolet)" />
              <Circle cx="195" cy="342" r="42" fill="url(#atmosCobaltViolet)" />
              <Circle cx="82" cy="365" r="56" fill="url(#atmosCobaltViolet)" />

              {/* Flowing White Wind Streamlines */}
              <G strokeLinecap="round">
                {WIND_STREAKS.map((s, idx) => (
                  <Line
                    key={idx}
                    x1={s.x1}
                    y1={s.y1}
                    x2={s.x2}
                    y2={s.y2}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeOpacity="0.34"
                  />
                ))}
              </G>
            </G>
          )}

          {/* Grid lines for Flood & Earthquake views */}
          {!isAtmosphericView && (
            <G stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3">
              <Line x1="0" y1="100" x2="400" y2="100" />
              <Line x1="0" y1="200" x2="400" y2="200" />
              <Line x1="0" y1="300" x2="400" y2="300" />
              <Line x1="0" y1="400" x2="400" y2="400" />
              <Line x1="110" y1="0" x2="110" y2="540" />
              <Line x1="220" y1="0" x2="220" y2="540" />
              <Line x1="330" y1="0" x2="330" y2="540" />
            </G>
          )}

          {/* =========================================================
              2. COMPLETE PHILIPPINE ARCHIPELAGO CARTOGRAPHY
                 (Translucent shading + crisp dark coastlines over weather)
             ========================================================= */}
          <G
            fill={isAtmosphericView ? 'rgba(15, 23, 42, 0.14)' : isSeismicGray ? '#F8FAFC' : '#F1F5F9'}
            stroke={isAtmosphericView ? '#18222F' : '#94A3B8'}
            strokeWidth={isAtmosphericView ? '1.15' : '1'}
            strokeLinejoin="round">
            {/* Batanes Islands */}
            <Circle cx="203" cy="24" r="2.3" />
            <Circle cx="202" cy="32" r="3" />
            <Circle cx="199" cy="37" r="1.8" />

            {/* Babuyan Islands */}
            <Circle cx="195" cy="50" r="2.8" />
            <Circle cx="204" cy="55" r="2.6" />
            <Circle cx="187" cy="55" r="2.2" />

            {/* Luzon Mainland */}
            <Path
              d="M 176 66
                 C 188 63, 202 63, 212 66
                 C 216 84, 215 108, 211 128
                 C 206 142, 200 152, 202 162
                 C 212 165, 224 168, 232 178
                 C 238 188, 240 198, 234 205
                 C 228 205, 222 195, 214 188
                 C 208 182, 204 176, 200 176
                 C 203 184, 206 190, 202 192
                 C 198 188, 195 180, 192 175
                 C 184 177, 175 177, 170 172
                 C 173 166, 176 164, 175 159
                 C 170 160, 166 166, 161 164
                 C 158 154, 158 140, 162 130
                 C 166 127, 172 128, 173 124
                 C 167 118, 168 96, 176 66 Z"
            />

            {/* Polillo Islands */}
            <Path d="M 206 144 Q 211 146 209 154 Q 204 152 206 144 Z" />

            {/* Catanduanes Island */}
            <Path d="M 241 172 Q 246 175 244 184 Q 238 181 241 172 Z" />

            {/* Marinduque Island */}
            <Circle cx="193" cy="184" r="3.2" />

            {/* Mindoro Island */}
            <Path
              d="M 164 178
                 C 172 178, 179 187, 178 198
                 C 176 207, 169 211, 163 205
                 C 158 196, 159 184, 164 178 Z"
            />

            {/* Romblon Island Group */}
            <Path d="M 191 198 Q 195 200 193 209 Q 189 207 191 198 Z" />
            <Circle cx="201" cy="206" r="2.6" />

            {/* Calamian Group (Busuanga / Coron) */}
            <Path d="M 141 212 Q 148 211 149 217 Q 143 219 141 212 Z" />
            <Circle cx="141" cy="221" r="2.3" />

            {/* Palawan Mainland & Balabac */}
            <Path
              d="M 136 226
                 C 141 229, 126 258, 111 282
                 C 99 300, 88 313, 81 318
                 C 77 315, 84 301, 95 283
                 C 109 261, 127 235, 136 226 Z"
            />
            <Circle cx="74" cy="324" r="2.5" />

            {/* Northeast Borneo Tip */}
            <Path
              d="M 28 385
                 C 42 365, 58 352, 74 348
                 C 86 346, 98 355, 110 364
                 C 116 368, 112 378, 102 385 Z"
            />

            {/* Visayas: Masbate */}
            <Path
              d="M 213 204
                 C 218 205, 224 214, 225 223
                 C 221 225, 217 218, 214 222
                 C 211 218, 211 209, 213 204 Z"
            />

            {/* Visayas: Panay & Guimaras */}
            <Path
              d="M 183 226
                 C 192 225, 200 232, 198 244
                 C 194 252, 184 251, 181 242
                 C 179 234, 180 228, 183 226 Z"
            />
            <Circle cx="195" cy="252" r="2.2" />

            {/* Visayas: Negros */}
            <Path
              d="M 203 245
                 C 209 245, 211 258, 208 274
                 C 205 281, 199 279, 199 268
                 C 199 257, 200 248, 203 245 Z"
            />

            {/* Visayas: Cebu */}
            <Path
              d="M 218 242
                 C 222 246, 222 264, 217 279
                 C 213 277, 215 261, 214 247
                 C 215 244, 216 242, 218 242 Z"
            />

            {/* Visayas: Bohol & Siquijor */}
            <Path
              d="M 226 266
                 C 233 265, 239 270, 237 276
                 C 232 280, 225 278, 224 272
                 C 224 268, 225 267, 226 266 Z"
            />
            <Circle cx="215" cy="285" r="2" />

            {/* Visayas: Samar */}
            <Path
              d="M 237 212
                 C 246 211, 255 220, 256 234
                 C 252 242, 243 240, 238 232
                 C 234 224, 234 216, 237 212 Z"
            />

            {/* Visayas: Leyte & Biliran */}
            <Circle cx="234" cy="233" r="2.2" />
            <Path
              d="M 235 237
                 C 241 238, 244 252, 243 268
                 C 239 270, 236 260, 234 248
                 C 233 242, 234 239, 235 237 Z"
            />

            {/* Dinagat & Siargao */}
            <Path d="M 251 272 Q 254 274 253 282 Q 249 280 251 272 Z" />
            <Circle cx="258" cy="281" r="2.6" />

            {/* Mindanao Mainland */}
            <Path
              d="M 252 286
                 C 260 296, 268 316, 272 340
                 C 272 349, 267 354, 264 352
                 C 263 344, 259 338, 254 338
                 C 251 344, 251 354, 246 364
                 C 238 366, 226 360, 218 346
                 C 211 340, 203 336, 196 334
                 C 188 338, 180 345, 174 346
                 C 173 341, 182 332, 193 324
                 C 201 318, 212 322, 222 318
                 C 231 314, 241 304, 252 286 Z"
            />

            {/* Sulu Archipelago (Basilan, Jolo, Siasi, Tawi-Tawi) */}
            <Circle cx="169" cy="352" r="3" />
            <Circle cx="156" cy="360" r="2.6" />
            <Path d="M 136 368 Q 143 366 145 370 Q 138 373 136 368 Z" />
          </G>

          {/* =========================================================
              3. LAYER-SPECIFIC HAZARD OVERLAYS
             ========================================================= */}
          {activeLayer === 'typhoon' && (
            <G>
              {/* Cone of Uncertainty */}
              <Polygon
                points="232,162 192,80 156,20 208,14 256,66"
                fill="url(#coneGrad)"
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeDasharray="4 3"
                strokeOpacity="0.65"
              />

              {/* Historical Track */}
              <Path
                d="M 294 206 Q 264 184 232 162"
                fill="none"
                stroke="#0F172A"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <Circle cx="294" cy="206" r="3" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1" />
              <Circle cx="263" cy="184" r="3" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1" />

              {/* Forecast Track */}
              <Path
                d="M 232 162 Q 212 114 198 68 Q 189 42 183 18"
                fill="none"
                stroke="#F97316"
                strokeWidth="2.5"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />
              <Circle cx="212" cy="114" r="3" fill="#F97316" stroke="#FFFFFF" strokeWidth="1" />
              <Circle cx="198" cy="68" r="3" fill="#F97316" stroke="#FFFFFF" strokeWidth="1" />
              <Circle cx="183" cy="18" r="3" fill="#F97316" stroke="#FFFFFF" strokeWidth="1" />

              {/* Typhoon Eye */}
              <Circle cx="232" cy="162" r="26" fill="url(#eyePulse)" />
              <Circle cx="232" cy="162" r="15" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 2" />
              <Circle cx="232" cy="162" r="7.5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.2" />
              <Circle cx="232" cy="162" r="2" fill="#FFFFFF" />

              {/* TCWS Signal #2 Callout Badge */}
              <G transform="translate(64, 54)">
                <Rect
                  x="0"
                  y="0"
                  width="112"
                  height="28"
                  rx="6"
                  fill="#EA580C"
                  stroke="#FFFFFF"
                  strokeWidth="1.4"
                />
                <SvgText x="8" y="12" fontSize="8.2" fontWeight="800" fill="#FFFFFF">
                  TCWS SIGNAL #2
                </SvgText>
                <SvgText x="8" y="22" fontSize="7" fontWeight="600" fill="#FED7AA">
                  BATANES • CAGAYAN
                </SvgText>
                <Polygon points="112,11 120,14 112,17" fill="#EA580C" />
              </G>
            </G>
          )}

          {activeLayer === 'rainfall' && (
            <G>
              {/* Convective Lightning Markers */}
              <G fill="#E0F2FE" opacity="0.9">
                <Polygon points="184,92 180,99 183,99 181,106 188,97 184,97" />
                <Polygon points="154,258 150,265 153,265 151,272 158,263 154,263" />
                <Polygon points="242,312 238,319 241,319 239,326 246,317 242,317" />
              </G>

              {/* Heavy Rainfall Callout Badge */}
              <G transform="translate(62, 54)">
                <Rect
                  x="0"
                  y="0"
                  width="116"
                  height="28"
                  rx="6"
                  fill="#0284C7"
                  stroke="#FFFFFF"
                  strokeWidth="1.3"
                />
                <SvgText x="8" y="12" fontSize="8.2" fontWeight="800" fill="#FFFFFF">
                  HEAVY RAINFALL
                </SvgText>
                <SvgText x="8" y="22" fontSize="7" fontWeight="600" fill="#E0F2FE">
                  LUZON • SULU SEA (48mm/h)
                </SvgText>
                <Polygon points="116,11 124,14 116,17" fill="#0284C7" />
              </G>
            </G>
          )}

          {activeLayer === 'flood' && (
            <G>
              {/* Cagayan Valley Basin */}
              <Path
                d="M 195 72 C 201 86, 202 104, 196 116 C 191 114, 190 94, 195 72 Z"
                fill="#F59E0B"
                fillOpacity="0.55"
                stroke="#D97706"
                strokeWidth="1.1"
              />
              {/* Pampanga / Metro Manila / Laguna Lake Basin */}
              <Circle cx="178" cy="156" r="22" fill="url(#floodHigh)" />
              <Path
                d="M 171 138 C 180 144, 183 156, 179 166 C 172 164, 168 152, 171 138 Z"
                fill="#DC2626"
                fillOpacity="0.6"
                stroke="#991B1B"
                strokeWidth="1.1"
              />
              {/* Bicol River Basin */}
              <Path
                d="M 218 180 C 228 184, 233 192, 230 199 C 222 197, 216 189, 218 180 Z"
                fill="#F59E0B"
                fillOpacity="0.6"
                stroke="#D97706"
                strokeWidth="1.1"
              />
              {/* Agusan & Cotabato River Basins */}
              <Circle cx="242" cy="328" r="24" fill="url(#floodHigh)" />
              <Path
                d="M 250 302 C 255 314, 255 330, 250 340 C 244 334, 244 316, 250 302 Z"
                fill="#DC2626"
                fillOpacity="0.55"
                stroke="#991B1B"
                strokeWidth="1.1"
              />
              <Circle cx="177" cy="155" r="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.4" />
              <Circle cx="196" cy="94" r="3.8" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.4" />
              <Circle cx="250" cy="322" r="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.4" />

              <G transform="translate(52, 144)">
                <Rect
                  x="0"
                  y="0"
                  width="112"
                  height="28"
                  rx="6"
                  fill="#B45309"
                  stroke="#FFFFFF"
                  strokeWidth="1.4"
                />
                <SvgText x="8" y="12" fontSize="8.2" fontWeight="800" fill="#FFFFFF">
                  CRITICAL FLOODING
                </SvgText>
                <SvgText x="8" y="22" fontSize="7" fontWeight="600" fill="#FEF3C7">
                  MARIKINA • PAMPANGA
                </SvgText>
                <Polygon points="112,11 120,14 112,17" fill="#B45309" />
              </G>
            </G>
          )}

          {activeLayer === 'earthquake' && (
            <G>
              {/* Manila Trench */}
              <Path
                d="M 160 36 C 148 70, 145 114, 147 156 C 149 170, 154 178, 161 182"
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.8"
              />
              <Polygon points="150,68 157,71 149,75" fill="#EF4444" />
              <Polygon points="146,106 153,109 146,113" fill="#EF4444" />
              <Polygon points="147,144 154,147 147,151" fill="#EF4444" />
              <Polygon points="152,172 159,171 156,178" fill="#EF4444" />

              {/* Philippine Trench */}
              <Path
                d="M 224 84 C 224 98, 218 106, 216 108 C 238 112, 252 136, 260 166 C 268 202, 276 248, 282 300 C 286 334, 290 360, 290 382"
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.8"
              />
              <Polygon points="222,94 215,96 221,101" fill="#EF4444" />
              <Polygon points="250,138 243,141 251,145" fill="#EF4444" />
              <Polygon points="260,172 253,175 261,179" fill="#EF4444" />
              <Polygon points="267,208 260,211 268,215" fill="#EF4444" />
              <Polygon points="273,246 266,249 274,253" fill="#EF4444" />
              <Polygon points="279,284 272,287 280,291" fill="#EF4444" />
              <Polygon points="284,322 277,325 285,329" fill="#EF4444" />
              <Polygon points="288,358 281,361 289,365" fill="#EF4444" />

              {/* Primary Epicenters */}
              <Circle cx="274" cy="322" r="16" fill="#F59E0B" fillOpacity="0.25" />
              <Circle cx="274" cy="322" r="8" fill="#F59E0B" stroke="#451A03" strokeWidth="1.2" />
              <Circle cx="265" cy="336" r="14" fill="#EF4444" fillOpacity="0.25" />
              <Circle cx="265" cy="336" r="6.5" fill="#F97316" stroke="#451A03" strokeWidth="1.2" />

              <G transform="translate(132, 308)">
                <Rect
                  x="0"
                  y="0"
                  width="118"
                  height="28"
                  rx="6"
                  fill="#DC2626"
                  stroke="#FFFFFF"
                  strokeWidth="1.4"
                />
                <SvgText x="8" y="12" fontSize="8.2" fontWeight="800" fill="#FFFFFF">
                  M 6.2 EARTHQUAKE
                </SvgText>
                <SvgText x="8" y="22" fontSize="7" fontWeight="600" fill="#FEE2E2">
                  DAVAO ORIENTAL • 24km
                </SvgText>
                <Polygon points="118,11 126,14 118,17" fill="#DC2626" />
              </G>
            </G>
          )}

          {/* =========================================================
              4. REGION & SEA LABELS (WITH DARK HALO)
             ========================================================= */}
          <G>
            <SvgText
              x="166"
              y="214"
              fontSize="8.5"
              fontWeight="700"
              letterSpacing="3"
              stroke={isAtmosphericView ? '#0F172A' : '#FFFFFF'}
              strokeWidth="2"
              strokeLinejoin="round"
              fill={isAtmosphericView ? '#E2E8F0' : '#64748B'}>
              PHILIPPINES
            </SvgText>
            <SvgText
              x="166"
              y="214"
              fontSize="8.5"
              fontWeight="700"
              letterSpacing="3"
              fill={isAtmosphericView ? '#E2E8F0' : '#64748B'}>
              PHILIPPINES
            </SvgText>

            <SvgText
              x="198"
              y="339"
              fontSize="7.2"
              fontWeight="700"
              letterSpacing="1.2"
              stroke={isAtmosphericView ? '#0F172A' : '#FFFFFF'}
              strokeWidth="2"
              strokeLinejoin="round"
              fill={isAtmosphericView ? '#CBD5E1' : '#64748B'}>
              MINDANAO
            </SvgText>
            <SvgText
              x="198"
              y="339"
              fontSize="7.2"
              fontWeight="700"
              letterSpacing="1.2"
              fill={isAtmosphericView ? '#CBD5E1' : '#64748B'}>
              MINDANAO
            </SvgText>
          </G>

          {/* =========================================================
              5. CITY LABELS & TEMPERATURES (WHITE WITH DARK HALO)
             ========================================================= */}
          <G>
            {CITIES.map((city) => {
              const isMatch =
                normalizedQuery.length > 0 && city.name.includes(normalizedQuery);
              const textFill = isMatch
                ? '#FACC15'
                : isAtmosphericView
                ? '#FFFFFF'
                : '#0F172A';
              const haloStroke = isAtmosphericView ? '#0F172A' : '#FFFFFF';

              return (
                <G key={city.name}>
                  {isMatch && (
                    <Circle
                      cx={city.x}
                      cy={city.y}
                      r="11"
                      fill="#FACC15"
                      fillOpacity="0.28"
                      stroke="#FACC15"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* City Name (Halo + Fill) */}
                  <SvgText
                    x={city.labelX}
                    y={city.labelY}
                    textAnchor="middle"
                    fontSize={city.major || isMatch ? '9.5' : '8.5'}
                    fontWeight="700"
                    stroke={haloStroke}
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    fill={textFill}>
                    {city.label}
                  </SvgText>
                  <SvgText
                    x={city.labelX}
                    y={city.labelY}
                    textAnchor="middle"
                    fontSize={city.major || isMatch ? '9.5' : '8.5'}
                    fontWeight="700"
                    fill={textFill}>
                    {city.label}
                  </SvgText>

                  {/* Temperature Readout Underneath (Halo + Fill) */}
                  {isAtmosphericView && (
                    <>
                      <SvgText
                        x={city.labelX}
                        y={city.labelY + 10}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        stroke="#0F172A"
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                        fill="#FFFFFF">
                        {city.temp}
                      </SvgText>
                      <SvgText
                        x={city.labelX}
                        y={city.labelY + 10}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        fill="#FFFFFF">
                        {city.temp}
                      </SvgText>
                    </>
                  )}
                </G>
              );
            })}
          </G>
        </G>
      </Svg>

      {/* Floating Map Controls on Right side */}
      <View style={styles.floatingControls}>
        <Pressable style={styles.controlButton} onPress={handleCycleLayer}>
          <MaterialCommunityIcons name="layers-outline" size={20} color="#334155" />
        </Pressable>

        <Pressable style={styles.controlButton} onPress={handleResetZoom}>
          <Ionicons name="locate-outline" size={20} color="#334155" />
        </Pressable>

        <Pressable
          style={[styles.controlButton, showLegend && styles.controlButtonActive]}
          onPress={handleToggleLegend}>
          <Ionicons name="list-outline" size={20} color={showLegend ? '#FFFFFF' : '#334155'} />
        </Pressable>

        <View style={styles.zoomGroup}>
          <Pressable style={[styles.controlButton, styles.zoomTop]} onPress={handleZoomIn}>
            <Ionicons name="add" size={18} color="#334155" />
          </Pressable>
          <View style={styles.zoomDivider} />
          <Pressable style={[styles.controlButton, styles.zoomBottom]} onPress={handleZoomOut}>
            <Ionicons name="remove" size={18} color="#334155" />
          </Pressable>
        </View>
      </View>

      {/* Dynamic Legend Overlay Card */}
      {showLegend && (
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>
            {activeLayer === 'typhoon' && 'TYPHOON & WIND FIELD'}
            {activeLayer === 'rainfall' && 'PRECIPITATION & WIND FLOW'}
            {activeLayer === 'flood' && 'FLOOD RISK LEVELS'}
            {activeLayer === 'earthquake' && 'SEISMIC & TECTONIC LEGEND'}
          </Text>

          {activeLayer === 'typhoon' && (
            <>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.legendText}>Current Typhoon Eye</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#F97316' }]} />
                <Text style={styles.legendText}>Forecast Track & Cone</Text>
              </View>
            </>
          )}

          {activeLayer === 'rainfall' && (
            <>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#4CB058' }]} />
                <Text style={styles.legendText}>Trade Winds / Light Showers</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#4364B8' }]} />
                <Text style={styles.legendText}>Moderate Rain (10–25 mm/h)</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#6356B0' }]} />
                <Text style={styles.legendText}>Heavy Rain Core (&gt;30 mm/h)</Text>
              </View>
            </>
          )}

          {activeLayer === 'flood' && (
            <>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendText}>Alert Level (Basin Swelling)</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.legendText}>Critical / Forced Evacuation</Text>
              </View>
            </>
          )}

          {activeLayer === 'earthquake' && (
            <>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendText}>Epicenter (M 5.0 – 6.5+)</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendLine, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>Subduction Trench / Fault</Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#47A854',
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
    top: 16,
    gap: 10,
    alignItems: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  controlButtonActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  zoomGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
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
  legendCard: {
    position: 'absolute',
    top: 16,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
  },
  legendTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendLine: {
    width: 12,
    height: 2.5,
    borderRadius: 1,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F8FAFC',
  },
});