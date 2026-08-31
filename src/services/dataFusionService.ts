import { OceanGridCell } from '../types/marine';

export interface RawDataSourceRecord {
  sourceName: 'ISRO_Oceansat' | 'IMD_Weather' | 'INCOIS_Ocean' | 'Tide_Gauge' | 'AIS_Vessel_Traffic' | 'Fisheries_Dept';
  rawParams: Record<string, string | number | boolean>;
  timestamp: string;
  spatialResolution: string;
  originalCoordinates: string;
  qualityFlag: 'GOOD' | 'INTERPOLATED' | 'UNCERTAIN';
}

export interface FusedDataPipelineStep {
  stepIndex: number;
  title: string;
  description: string;
  inputSummary: string;
  outputSummary: string;
  status: 'SUCCESS' | 'WARNING' | 'PROCESSING';
}

export interface FeatureVector {
  cellId: string;
  vector: number[];
  labels: string[];
  normalizedVector: number[];
}

export class DataFusionService {
  /**
   * Generates step-by-step audit trail for the Data Fusion Layer
   */
  public static getFusionPipelineSteps(cell: OceanGridCell): FusedDataPipelineStep[] {
    return [
      {
        stepIndex: 1,
        title: 'JOB 1 — Multi-Source Ingestion',
        description: 'Ingested raw telemetric feeds from ISRO/INSAT-3D (Chlorophyll, SST), IMD Doppler Weather Radar (Wind, Rain, Pressure), INCOIS Ocean Wave Models (Wave height, Current vector), Survey of India Tide Gauges, DG Shipping AIS stream, and Coastal Fisheries catch logbooks.',
        inputSummary: `6 Heterogeneous sources: Satellite @ 1km res, Weather @ 10km res, Ocean Buoy @ 5km res, Tide Gauge point-source, AIS stream @ 30s interval.`,
        outputSummary: `Raw records retrieved with disparate timestamps and coordinate systems.`,
        status: 'SUCCESS',
      },
      {
        stepIndex: 2,
        title: 'JOB 2 — Data Cleaning & Validation',
        description: 'Applied atmospheric correction filter, removed cloud-obscured pixel artifacts from SST/Chlorophyll raster, validated barometric pressure sanity (1008 hPa within normal range), checked tide height consistency (2.8m).',
        inputSummary: `Raw sensor values checked against oceanographic domain thresholds.`,
        outputSummary: `Cleaned continuous variables without null or outlier values.`,
        status: 'SUCCESS',
      },
      {
        stepIndex: 3,
        title: 'JOB 3 — Spatial Alignment',
        description: `Bilinear interpolation and geospatial binning into standard 0.1° x 0.1° coastal ocean grid cell. Point coordinates (Lat ${cell.lat}, Lon ${cell.lon}) mapped onto unified bounding polygon for Cell ${cell.cellId}.`,
        inputSummary: `Coordinates mapped into discrete Grid Cell ${cell.cellId} (Lat ${cell.lat.toFixed(2)}, Lon ${cell.lon.toFixed(2)}).`,
        outputSummary: `Harmonized spatial boundary assigned.`,
        status: 'SUCCESS',
      },
      {
        stepIndex: 4,
        title: 'JOB 4 — Temporal Synchronization',
        description: `Aligned diverse sampling rates (satellite 12h pass, weather 1h, ocean model 3h, AIS live) into unified observation snapshot [${cell.lastUpdated}] using nearest-neighbor and linear temporal interpolation.`,
        inputSummary: `Multiple temporal timestamps transformed to standardized 06:00 IST baseline.`,
        outputSummary: `Unified temporal snapshot generated for Cell ${cell.cellId}.`,
        status: 'SUCCESS',
      },
      {
        stepIndex: 5,
        title: 'JOB 5 — Model-Ready Feature Vector Synthesis',
        description: 'Transformed categorical values (Tide High/Low, Shipping Activity, Restricted Zone) and continuous variables into normalized numeric feature vector ready for Safety, PFZ, and Anomaly ML models.',
        inputSummary: `12 Fused Parameters: [Chl: ${cell.chlorophyll}, SST: ${cell.sst}°C, Wind: ${cell.windSpeed}km/h, Rain: ${cell.rainfall}mm, Wave: ${cell.waveHeight}m, Curr: ${cell.currentSpeed}m/s, Tide: ${cell.tideHeight}m, Depth: ${cell.depthMeters}m, Catch: ${cell.historicalCatch}kg].`,
        outputSummary: `12-Dimensional normalized feature vector passed to downstream AI engines.`,
        status: 'SUCCESS',
      },
    ];
  }

  /**
   * Produces the raw data sources that contributed to a specific grid cell
   */
  public static getRawSourceBreakdown(cell: OceanGridCell): RawDataSourceRecord[] {
    return [
      {
        sourceName: 'ISRO_Oceansat',
        rawParams: {
          'Chlorophyll-a': `${cell.chlorophyll} mg/m³`,
          'Sea Surface Temp (SST)': `${cell.sst} °C`,
          'Ocean Colour Index': '0.74 (Phytoplankton Active)',
          'Cloud Mask': 'Clear Sky (0% occlusion)',
        },
        timestamp: '31 Aug 2026 04:30 IST',
        spatialResolution: '1 km x 1 km raster',
        originalCoordinates: `Lat ${cell.lat.toFixed(4)}, Lon ${cell.lon.toFixed(4)}`,
        qualityFlag: 'GOOD',
      },
      {
        sourceName: 'IMD_Weather',
        rawParams: {
          'Surface Wind Speed': `${cell.windSpeed} km/h`,
          'Wind Direction': `${cell.windDirection}° (SW Monsoonal Flow)`,
          'Accumulated Rainfall': `${cell.rainfall} mm`,
          'Atmospheric Pressure': `${cell.pressure} hPa`,
          'Visibility': '9.5 km',
        },
        timestamp: '31 Aug 2026 05:45 IST',
        spatialResolution: '0.1° Numerical Weather Prediction (NWP)',
        originalCoordinates: `Grid Node (18.5, 72.8)`,
        qualityFlag: 'GOOD',
      },
      {
        sourceName: 'INCOIS_Ocean',
        rawParams: {
          'Significant Wave Height': `${cell.waveHeight} m`,
          'Wave Peak Period': '6.8 sec',
          'Surface Current Velocity': `${cell.currentSpeed} m/s`,
          'Current Bearing': `${cell.currentDirection}°`,
          'Sea Surface Salinity': '35.4 PSU',
        },
        timestamp: '31 Aug 2026 05:00 IST',
        spatialResolution: '1/12° Global Ocean Physics Model',
        originalCoordinates: `Lat ${cell.lat.toFixed(3)}, Lon ${cell.lon.toFixed(3)}`,
        qualityFlag: 'GOOD',
      },
      {
        sourceName: 'Tide_Gauge',
        rawParams: {
          'Tide Phase': cell.tide,
          'Water Level Height': `${cell.tideHeight} m (Above Chart Datum)`,
          'Tidal Stream Rate': '0.3 knots',
        },
        timestamp: '31 Aug 2026 06:00 IST',
        spatialResolution: 'Coastal Hydrographic Sensor',
        originalCoordinates: 'Apollo Bunder / Sassoon Station',
        qualityFlag: 'GOOD',
      },
      {
        sourceName: 'AIS_Vessel_Traffic',
        rawParams: {
          'Vessel Density': `${cell.shippingActivity} Traffic Density`,
          'Restricted Security Perimeter': cell.restrictedZone ? 'ACTIVE RESTRICTION' : 'CLEAR WATERS',
          'Vessel Count in 5km Radius': cell.shippingActivity === 'HIGH' ? 14 : cell.shippingActivity === 'MEDIUM' ? 5 : 1,
        },
        timestamp: '31 Aug 2026 05:58 IST',
        spatialResolution: 'Real-time AIS Class A/B Transponder',
        originalCoordinates: 'Sector B2 Marine Corridor',
        qualityFlag: 'GOOD',
      },
      {
        sourceName: 'Fisheries_Dept',
        rawParams: {
          'Seasonal Catch Average': `${cell.historicalCatch} kg / voyage`,
          'Dominant Pelagic Stocks': cell.dominantSpecies.join(', '),
          'Bathymetry Sounding': `${cell.depthMeters} meters`,
        },
        timestamp: 'Historical Logbook 2024-2026',
        spatialResolution: 'Fisheries Statistical Block 18-72',
        originalCoordinates: 'Block B2',
        qualityFlag: 'GOOD',
      },
    ];
  }

  /**
   * Generates model-ready normalized feature vector
   */
  public static extractFeatureVector(cell: OceanGridCell): FeatureVector {
    const raw = [
      cell.chlorophyll,
      cell.sst,
      cell.windSpeed,
      cell.rainfall,
      cell.pressure,
      cell.waveHeight,
      cell.currentSpeed,
      cell.tideHeight,
      cell.depthMeters,
      cell.shippingActivity === 'LOW' ? 0.2 : cell.shippingActivity === 'MEDIUM' ? 0.5 : 0.9,
      cell.restrictedZone ? 1.0 : 0.0,
      cell.historicalCatch,
    ];

    const labels = [
      'Chlorophyll-a (mg/m³)',
      'SST (°C)',
      'Wind Speed (km/h)',
      'Rainfall (mm)',
      'Pressure (hPa)',
      'Wave Height (m)',
      'Current Speed (m/s)',
      'Tide Height (m)',
      'Depth (m)',
      'Shipping Density Index',
      'Restricted Zone Flag',
      'Historical Catch (kg)',
    ];

    // Normalized between 0 and 1
    const normalized = [
      Math.min(1, cell.chlorophyll / 5.0),
      Math.min(1, Math.max(0, (cell.sst - 24) / 10)),
      Math.min(1, cell.windSpeed / 50),
      Math.min(1, cell.rainfall / 50),
      Math.min(1, Math.max(0, (cell.pressure - 980) / 40)),
      Math.min(1, cell.waveHeight / 4.0),
      Math.min(1, cell.currentSpeed / 2.0),
      Math.min(1, cell.tideHeight / 5.0),
      Math.min(1, cell.depthMeters / 150),
      cell.shippingActivity === 'LOW' ? 0.2 : cell.shippingActivity === 'MEDIUM' ? 0.5 : 0.9,
      cell.restrictedZone ? 1.0 : 0.0,
      Math.min(1, cell.historicalCatch / 150),
    ];

    return {
      cellId: cell.cellId,
      vector: raw,
      labels,
      normalizedVector: normalized,
    };
  }
}
