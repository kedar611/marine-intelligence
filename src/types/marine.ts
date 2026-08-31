export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'ml' | 'kn' | 'or';

export type AppRole = 'fisherman' | 'authority' | 'researcher' | 'data_fusion';

export type SystemScenario = 'normal' | 'cyclone_alert' | 'high_pfz_rough_sea' | 'restricted_zone_surge';

export interface OceanGridCell {
  cellId: string; // e.g. "B2", "B3", "C2"
  name: string;
  lat: number;
  lon: number;
  chlorophyll: number; // mg/m³
  sst: number; // °C
  windSpeed: number; // km/h
  windDirection: number; // degrees
  rainfall: number; // mm
  pressure: number; // hPa
  waveHeight: number; // meters
  currentSpeed: number; // m/s
  currentDirection: number; // degrees
  tide: 'HIGH' | 'LOW' | 'SLACK';
  tideHeight: number; // meters
  shippingActivity: 'LOW' | 'MEDIUM' | 'HIGH';
  restrictedZone: boolean;
  restrictedZoneName?: string;
  historicalCatch: number; // kg
  dominantSpecies: string[];
  depthMeters: number;
  distanceFromCoastKm: number;
  lastUpdated: string;
}

export interface SafetyAnalysis {
  safetyScore: number; // 0-100
  status: 'SAFE' | 'MODERATE' | 'UNSAFE';
  primaryRiskFactors: string[];
  warnings: string[];
  hourlyForecast: Array<{
    time: string;
    status: 'SAFE' | 'MODERATE' | 'UNSAFE';
    waveHeight: number;
    windSpeed: number;
    note: string;
  }>;
  maxSafeDurationHours: number;
  recommendedReturnTime: string;
}

export interface PFZAnalysis {
  suitabilityScore: number; // 0 - 100%
  category: 'HIGH' | 'MODERATE' | 'LOW';
  chlorophyllGradient: number;
  sstThermalGradient: number;
  predictedSpecies: Array<{
    name: string;
    probability: number;
    expectedCatchKg: number;
  }>;
  scientificExplanation: string;
  optimalWindow: string;
}

export interface AnomalyAnalysis {
  isAnomaly: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  anomalousFeatures: string[];
  isolationForestScore: number; // -1 to 1
  description: string;
  officialWarningPrecedence: boolean;
}

export interface RouteWaypoint {
  lat: number;
  lon: number;
  name?: string;
  hazardNote?: string;
}

export interface OptimizedRoute {
  routeId: string;
  name: string;
  waypoints: Array<[number, number]>;
  distanceKm: number;
  estimatedTimeMinutes: number;
  fuelEfficiencyIndex: number; // 1-100
  avoidsShippingLane: boolean;
  avoidsRestrictedZone: boolean;
  currentVectorBenefit: string;
  safetyScoreAlongRoute: number;
}

export interface AgentReasoningStep {
  stepNumber: number;
  agentName: string;
  action: string;
  observation: string;
  inference: string;
  status: 'completed' | 'in_progress' | 'overridden' | 'alert';
  timestamp: string;
}

export interface AgentDecisionResult {
  dispatchApproved: boolean; // GO or NO-GO
  verdictText: string;
  verdictBadge: 'SAFE_TO_GO' | 'MODERATE_CAUTION' | 'DANGER_DO_NOT_GO';
  safetyScore: number;
  pfzSuitabilityScore: number;
  bestCell: OceanGridCell;
  bestFishingWindow: string;
  recommendedRoute: OptimizedRoute;
  avoidInstructions: string[];
  marineAnomalyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  returnBefore: string;
  lastUpdated: string;
  reasoningTrace: AgentReasoningStep[];
  decisionRationale: string;
  safetyOverrideOccurred: boolean;
}

export interface AuthorityAdvisory {
  id: string;
  title: string;
  severity: 'ADVISORY' | 'WARNING' | 'EMERGENCY';
  issuedBy: string;
  targetRegion: string;
  message: string;
  affectedCells: string[];
  timestamp: string;
  active: boolean;
}

export interface CatchReport {
  id: string;
  fishermanName: string;
  boatNumber: string;
  cellId: string;
  species: string;
  catchWeightKg: number;
  seaConditionObserved: string;
  timestamp: string;
}

export interface VesselTrack {
  id: string;
  name: string;
  type: 'FISHING_BOAT' | 'CARGO_CONTAINER' | 'COAST_GUARD' | 'OIL_TANKER';
  lat: number;
  lon: number;
  heading: number;
  speedKnots: number;
  safetyStatus: 'SAFE' | 'WARNING' | 'BREACH';
}
