import { OceanGridCell, AgentDecisionResult, AgentReasoningStep, SystemScenario } from '../types/marine';
import { SafetyModelService, PFZModelService, AnomalyModelService, RouteOptimizationService } from './aiModelsService';
import { HARBOR_START_LOCATION } from '../data/mockOceanGrid';

export class AgenticMarineCore {
  /**
   * Main Agentic AI Orchestration pipeline:
   * Observe -> Reason -> Decide -> Recommend
   */
  public static executeAgenticPipeline(
    selectedCell: OceanGridCell,
    allCells: OceanGridCell[],
    scenario: SystemScenario = 'normal'
  ): AgentDecisionResult {
    const trace: AgentReasoningStep[] = [];
    let stepCount = 1;

    // STEP 1: OBSERVE - Ingest & Fuse Data
    trace.push({
      stepNumber: stepCount++,
      agentName: 'Data Fusion Agent',
      action: 'INGEST_AND_ALIGN',
      observation: `Received multi-source telemetry for Sector (Lat ${selectedCell.lat}, Lon ${selectedCell.lon}). Chlorophyll: ${selectedCell.chlorophyll} mg/m³, SST: ${selectedCell.sst}°C, Wind: ${selectedCell.windSpeed} km/h, Wave: ${selectedCell.waveHeight}m, Tide: ${selectedCell.tideHeight}m (${selectedCell.tide}).`,
      inference: `Data fusion completed across 6 heterogeneous sources. Standardized 0.1° grid snapshot generated for Cell ${selectedCell.cellId}.`,
      status: 'completed',
      timestamp: '06:00:02 IST',
    });

    // STEP 2: SAFETY AGENT EVALUATION
    const safetyAnalysis = SafetyModelService.evaluateSafety(selectedCell);
    trace.push({
      stepNumber: stepCount++,
      agentName: 'Marine Safety Agent',
      action: 'EVALUATE_SURFACE_SAFETY',
      observation: `Wave height is ${selectedCell.waveHeight}m, Wind is ${selectedCell.windSpeed} km/h (${selectedCell.windDirection}° SW), Pressure is ${selectedCell.pressure} hPa, Restricted status: ${selectedCell.restrictedZone ? 'RESTRICTED' : 'CLEAR'}.`,
      inference: `Safety Score evaluated at ${safetyAnalysis.safetyScore}/100 -> Status: ${safetyAnalysis.status}. ${safetyAnalysis.warnings[0] || 'Conditions within small-craft safety envelope.'}`,
      status: safetyAnalysis.status === 'UNSAFE' ? 'alert' : 'completed',
      timestamp: '06:00:04 IST',
    });

    // STEP 3: PFZ BIOMASS AGENT EVALUATION
    const pfzAnalysis = PFZModelService.evaluatePFZ(selectedCell);
    trace.push({
      stepNumber: stepCount++,
      agentName: 'PFZ Bio-Thermal Agent',
      action: 'ANALYZE_FISHING_SUITABILITY',
      observation: `Chlorophyll-a productivity level: ${selectedCell.chlorophyll} mg/m³, Sea Surface Temp: ${selectedCell.sst}°C, Current velocity: ${selectedCell.currentSpeed} m/s, Historical catch benchmark: ${selectedCell.historicalCatch} kg.`,
      inference: `PFZ Suitability Score: ${pfzAnalysis.suitabilityScore}%. Feeding grounds indicator favorable. Target species: ${pfzAnalysis.predictedSpecies[0].name}. Optimal feeding window: ${pfzAnalysis.optimalWindow}.`,
      status: 'completed',
      timestamp: '06:00:06 IST',
    });

    // STEP 4: ANOMALY DETECTION AGENT
    const anomalyAnalysis = AnomalyModelService.detectAnomalies(selectedCell);
    trace.push({
      stepNumber: stepCount++,
      agentName: 'Marine Anomaly Agent',
      action: 'ISOLATION_FOREST_ANOMALY_SCAN',
      observation: `Isolation forest anomaly index: ${anomalyAnalysis.isolationForestScore.toFixed(2)}. Risk Category: ${anomalyAnalysis.riskLevel}. Barometric gradient stability: ${selectedCell.pressure >= 1006 ? 'NOMINAL' : 'SUB-NOMINAL'}.`,
      inference: anomalyAnalysis.isAnomaly
        ? `ANOMALY DETECTED: ${anomalyAnalysis.anomalousFeatures.join(', ')}. Official maritime warning priority invoked.`
        : 'Zero meteorological or oceanographic anomalies detected. Sea dynamics stable.',
      status: anomalyAnalysis.isAnomaly ? 'alert' : 'completed',
      timestamp: '06:00:08 IST',
    });

    // STEP 5: ROUTE OPTIMIZATION AGENT
    const optimizedRoute = RouteOptimizationService.calculateRoute(
      HARBOR_START_LOCATION,
      selectedCell
    );
    trace.push({
      stepNumber: stepCount++,
      agentName: 'Navigation & Route Agent',
      action: 'OPTIMIZE_FAIRWAY_PATH',
      observation: `Origin: ${HARBOR_START_LOCATION.name} -> Target: Cell ${selectedCell.cellId} (${selectedCell.distanceFromCoastKm} km offshore). Northern Shipping Lane cross-traffic: ${selectedCell.shippingActivity}.`,
      inference: `Generated Waypoint Path: avoids shipping corridor and security perimeters. Outbound distance: ${optimizedRoute.distanceKm} km (~${optimizedRoute.estimatedTimeMinutes} mins at 8.5 knots). ${optimizedRoute.currentVectorBenefit}`,
      status: 'completed',
      timestamp: '06:00:09 IST',
    });

    // STEP 6: AGENTIC DECISION SYNTHESIS & SAFETY OVERRIDE ENFORCEMENT
    let dispatchApproved = true;
    let verdictBadge: 'SAFE_TO_GO' | 'MODERATE_CAUTION' | 'DANGER_DO_NOT_GO' = 'SAFE_TO_GO';
    let verdictText = '';
    let decisionRationale = '';
    let safetyOverrideOccurred = false;

    // SCENARIO & RULE ENFORCEMENT: Safety ALWAYS overrides PFZ potential!
    if (selectedCell.restrictedZone) {
      dispatchApproved = false;
      verdictBadge = 'DANGER_DO_NOT_GO';
      safetyOverrideOccurred = true;
      verdictText = 'FISHING PROHIBITED: Restricted Military / Petroleum Enclave';
      decisionRationale = `High bio-thermal potential (${pfzAnalysis.suitabilityScore}%) detected, but entry into ${selectedCell.restrictedZoneName || 'Sector B1'} is strictly banned by Indian Navy/Coast Guard regulations. Small crafts must stay clear.`;
    } else if (safetyAnalysis.status === 'UNSAFE' || anomalyAnalysis.riskLevel === 'EXTREME' || selectedCell.waveHeight >= 2.5) {
      dispatchApproved = false;
      verdictBadge = 'DANGER_DO_NOT_GO';
      safetyOverrideOccurred = true;
      verdictText = 'UNSAFE SEA CONDITIONS: DO NOT GO FISHING';
      decisionRationale = `PFZ Model indicates high potential (${pfzAnalysis.suitabilityScore}%), but Safety Model detected hazardous sea conditions (Waves: ${selectedCell.waveHeight}m, Wind: ${selectedCell.windSpeed} km/h, Pressure: ${selectedCell.pressure} hPa). The Agentic AI strictly prioritizes fisherman safety over catch potential. Stay in harbor.`;
    } else if (safetyAnalysis.status === 'MODERATE' || selectedCell.waveHeight > 1.3 || selectedCell.windSpeed > 22) {
      dispatchApproved = true;
      verdictBadge = 'MODERATE_CAUTION';
      verdictText = 'CONDITIONS MODERATE: Proceed With High Vigilance';
      decisionRationale = `Favorable fishing potential (${pfzAnalysis.suitabilityScore}%) in early hours, but moderate afternoon swell (${selectedCell.waveHeight}m) and breeze (${selectedCell.windSpeed} km/h) forecasted. Undertake short trip only and return before afternoon deterioration.`;
    } else {
      dispatchApproved = true;
      verdictBadge = 'SAFE_TO_GO';
      verdictText = 'FISHING CONDITIONS: SUITABLE & OPTIMAL';
      decisionRationale = `Sea conditions are safe (Safety Score: ${safetyAnalysis.safetyScore}/100, Waves: ${selectedCell.waveHeight}m, Wind: ${selectedCell.windSpeed} km/h). PFZ Bio-thermal model identifies prime feeding concentration (Suitability: ${pfzAnalysis.suitabilityScore}%) with following tide stream.`;
    }

    trace.push({
      stepNumber: stepCount++,
      agentName: 'Agentic Core Synthesizer',
      action: 'SYNTHESIZE_ACTIONABLE_DECISION',
      observation: `Safety Status: ${safetyAnalysis.status} (Score ${safetyAnalysis.safetyScore}) | PFZ Suitability: ${pfzAnalysis.suitabilityScore}% | Anomaly Risk: ${anomalyAnalysis.riskLevel}.`,
      inference: safetyOverrideOccurred
        ? `[SAFETY OVERRIDE ENFORCED] High catch potential DOES NOT override life safety. Outputting NO-GO advisory.`
        : `Approved dispatch recommendation with optimal time window (06:00-10:00) and fairway routing.`,
      status: dispatchApproved ? 'completed' : 'overridden',
      timestamp: '06:00:11 IST',
    });

    const avoidInstructions: string[] = [];
    if (selectedCell.shippingActivity !== 'LOW') {
      avoidInstructions.push('Avoid crossing Northern Shipping Corridor without active lookout');
    }
    if (selectedCell.distanceFromCoastKm > 25) {
      avoidInstructions.push('Do not venture past 15 nautical miles without VHF Channel 16 radio operational');
    }
    avoidInstructions.push(`Return to harbor before conditions change in afternoon (${safetyAnalysis.recommendedReturnTime})`);

    return {
      dispatchApproved,
      verdictText,
      verdictBadge,
      safetyScore: safetyAnalysis.safetyScore,
      pfzSuitabilityScore: pfzAnalysis.suitabilityScore,
      bestCell: selectedCell,
      bestFishingWindow: pfzAnalysis.optimalWindow,
      recommendedRoute: optimizedRoute,
      avoidInstructions,
      marineAnomalyLevel: anomalyAnalysis.riskLevel,
      returnBefore: safetyAnalysis.recommendedReturnTime,
      lastUpdated: selectedCell.lastUpdated,
      reasoningTrace: trace,
      decisionRationale,
      safetyOverrideOccurred,
    };
  }
}
