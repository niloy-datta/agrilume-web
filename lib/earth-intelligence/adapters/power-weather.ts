/**
 * NASA POWER Weather Adapter (Agroclimatology / AG community).
 *
 * Docs: https://power.larc.nasa.gov/docs/services/api/
 *
 * Spatial resolution: 0.5° x 0.625° (~50 km) meteorology grid.
 * Temporal resolution: daily aggregated to monthly means.
 * Provenance: NASA Langley Research Center POWER Project.
 */

import type { AdapterResult, PowerWeatherData } from "../types";
import { fetchWithRetry, globalNasaRateLimiter, earthDataCache } from "../client-utils";
import { parseDaily, parseDistrictFile, POWER_BASE, MIN_DAYS_PER_MONTH } from "@/lib/timetravel/power";

export interface PowerWeatherRequest {
  districtId: string;
  lat: number;
  lon: number;
  basePath?: string;
  preferLive?: boolean;
}

export async function fetchPowerWeather(
  req: PowerWeatherRequest,
): Promise<AdapterResult<PowerWeatherData>> {
  const { districtId, lat, lon, basePath = "", preferLive = false } = req;
  const cacheKey = `power_weather:${districtId}:${lat.toFixed(2)},${lon.toFixed(2)}`;

  // 1. Check local cache
  const cached = earthDataCache.get<PowerWeatherData>(cacheKey);
  if (cached && !preferLive) {
    return {
      ok: true,
      status: "cached",
      data: cached,
      provenance: {
        datasetId: "nasa-power-weather",
        productName: "NASA POWER Agroclimatology Daily/Monthly",
        sourceUrl: `${POWER_BASE}/daily/point`,
        doi: "https://doi.org/10.5067/POWER/0001",
        provider: "NASA Langley Research Center",
        retrievedAt: new Date().toISOString(),
        freshness: "cached",
        originCategory: "cached-observation",
        spatial: { degrees: 0.5, approxKm: 50, label: "0.5° × 0.625° (~50 km)" },
        temporal: { cadence: "daily", periodStart: "1981-01-01", periodEnd: "2025-12-31" },
        quality: { hasQualityMask: true, cloudMaskApplied: false, fillValue: -999, notes: `Minimum ${MIN_DAYS_PER_MONTH} valid days/month` },
      },
    };
  }

  // 2. Try loading bundled 64-district build-time file
  if (!preferLive) {
    try {
      const res = await fetch(`${basePath}/data/power/${districtId}.json`, { cache: "force-cache" });
      if (res.ok) {
        const json = await res.json();
        const series = parseDistrictFile(json, districtId);
        const data: PowerWeatherData = {
          districtId,
          startYear: series.startYear,
          endYear: series.endYear,
          parameters: {
            tmax: series.tmax,
            tmin: series.tmin,
            tmean: series.tmax.map((row, y) =>
              row.map((max, m) => {
                const min = series.tmin[y]?.[m];
                return max != null && min != null ? (max + min) / 2 : null;
              }),
            ),
            rain: series.rain,
            radiation: series.tmax.map((row) => row.map(() => null)),
            rh2m: series.tmax.map((row) => row.map(() => null)),
            windSpeed: series.tmax.map((row) => row.map(() => null)),
          },
          units: {
            tmax: "°C (daily max mean)",
            tmin: "°C (daily min mean)",
            tmean: "°C",
            rain: "mm/day",
          },
          dailyMaxSd: series.tmaxDailySd,
        };

        earthDataCache.set(cacheKey, data);

        return {
          ok: true,
          status: "bundled",
          data,
          provenance: {
            datasetId: "nasa-power-weather",
            productName: "NASA POWER Agroclimatology (64-district build bundle)",
            sourceUrl: "https://power.larc.nasa.gov/api/temporal/daily/point",
            doi: "https://doi.org/10.5067/POWER/0001",
            provider: "NASA Langley Research Center",
            retrievedAt: series.provenance.retrievedAt || new Date().toISOString(),
            freshness: "bundled-real",
            originCategory: "real-observation",
            spatial: { degrees: 0.5, approxKm: 50, label: "0.5° × 0.625° (~50 km)" },
            temporal: { cadence: "daily", periodStart: `${series.startYear}-01-01`, periodEnd: `${series.endYear}-12-31` },
            quality: { hasQualityMask: true, cloudMaskApplied: false, fillValue: -999, notes: "Verified against NASA POWER SHA-256 manifest" },
          },
        };
      }
    } catch {
      // Fall through to live fetch
    }
  }

  // 3. Live browser fetch with rate limiting and exponential backoff
  try {
    await globalNasaRateLimiter.throttle();
    const endYear = new Date().getFullYear() - 1;
    const startYear = Math.max(1981, endYear - 24);
    const start = `${startYear}0101`;
    const end = `${endYear}1231`;

    const url = `${POWER_BASE}/daily/point?parameters=T2M_MAX,T2M_MIN,PRECTOTCORR&community=AG&longitude=${lon.toFixed(4)}&latitude=${lat.toFixed(4)}&start=${start}&end=${end}&format=JSON&time-standard=LST`;

    const res = await fetchWithRetry(url, undefined, { maxRetries: 2, timeoutMs: 15000 });
    if (!res.ok) {
      throw new Error(`NASA POWER HTTP ${res.status}`);
    }

    const json = await res.json();
    const parsedSeries = parseDaily(json, {
      name: districtId,
      lat,
      lon,
      startYear,
      endYear,
      url,
      origin: "nasa-power-live",
      retrievedAt: new Date().toISOString(),
    });

    const data: PowerWeatherData = {
      districtId,
      startYear: parsedSeries.startYear,
      endYear: parsedSeries.endYear,
      parameters: {
        tmax: parsedSeries.tmax,
        tmin: parsedSeries.tmin,
        tmean: parsedSeries.tmax.map((row, y) =>
          row.map((max, m) => {
            const min = parsedSeries.tmin[y]?.[m];
            return max != null && min != null ? (max + min) / 2 : null;
          }),
        ),
        rain: parsedSeries.rain,
        radiation: parsedSeries.tmax.map((row) => row.map(() => null)),
        rh2m: parsedSeries.tmax.map((row) => row.map(() => null)),
        windSpeed: parsedSeries.tmax.map((row) => row.map(() => null)),
      },
      units: {
        tmax: "°C (daily max mean)",
        tmin: "°C (daily min mean)",
        tmean: "°C",
        rain: "mm/day",
      },
      dailyMaxSd: parsedSeries.tmaxDailySd,
    };

    earthDataCache.set(cacheKey, data);

    return {
      ok: true,
      status: "live",
      data,
      provenance: {
        datasetId: "nasa-power-weather",
        productName: "NASA POWER Agroclimatology (Live Browser Fetch)",
        sourceUrl: url,
        doi: "https://doi.org/10.5067/POWER/0001",
        provider: "NASA Langley Research Center",
        retrievedAt: new Date().toISOString(),
        freshness: "live",
        originCategory: "real-observation",
        spatial: { degrees: 0.5, approxKm: 50, label: "0.5° × 0.625° (~50 km)" },
        temporal: { cadence: "daily", periodStart: `${startYear}-01-01`, periodEnd: `${endYear}-12-31` },
        quality: { hasQualityMask: true, cloudMaskApplied: false, fillValue: -999, notes: `Minimum ${MIN_DAYS_PER_MONTH} valid days/month` },
        isCustomCoordinates: true,
      },
    };
  } catch (err) {
    return {
      ok: false,
      status: "error",
      error: err instanceof Error ? err.message : String(err),
      provenance: {
        datasetId: "nasa-power-weather",
        productName: "NASA POWER Agroclimatology",
        sourceUrl: `${POWER_BASE}/daily/point`,
        provider: "NASA Langley Research Center",
        retrievedAt: new Date().toISOString(),
        freshness: "fallback-sample",
        originCategory: "unavailable-data",
        spatial: { degrees: 0.5, approxKm: 50, label: "0.5° × 0.625° (~50 km)" },
        temporal: { cadence: "daily", periodStart: "1981-01-01", periodEnd: "2025-12-31" },
        quality: { hasQualityMask: true, cloudMaskApplied: false, fillValue: -999 },
      },
    };
  }
}

