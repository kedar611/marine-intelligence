import { OceanGridCell, AgentDecisionResult, AuthorityAdvisory } from '../types/marine';

export interface CachedOfflineData {
  lastSyncTimestamp: string;
  gridCells: OceanGridCell[];
  latestDecision: AgentDecisionResult;
  advisories: AuthorityAdvisory[];
  isStale: boolean;
}

const CACHE_KEY = 'AQUAINTEL_OFFLINE_CACHE_V1';

export class OfflineCacheService {
  public static saveToOfflineCache(
    gridCells: OceanGridCell[],
    decision: AgentDecisionResult,
    advisories: AuthorityAdvisory[]
  ): void {
    try {
      const payload: CachedOfflineData = {
        lastSyncTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
        gridCells,
        latestDecision: decision,
        advisories,
        isStale: false,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public static loadFromOfflineCache(): CachedOfflineData | null {
    try {
      const data = localStorage.getItem(CACHE_KEY);
      if (!data) return null;
      return JSON.parse(data) as CachedOfflineData;
    } catch (e) {
      console.warn('LocalStorage read failed:', e);
      return null;
    }
  }

  public static clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
  }
}
