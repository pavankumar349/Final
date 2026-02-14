export type OpenMeteoCurrent = {
  temperatureC: number;
  windSpeedKmh?: number;
  weatherCode?: number;
};

export type OpenMeteoDaily = {
  date: string; // YYYY-MM-DD
  tempMaxC?: number;
  tempMinC?: number;
  precipitationMm?: number;
};

export type OpenMeteoResult = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  current: OpenMeteoCurrent;
  daily: OpenMeteoDaily[];
};

function withTimeout(ms: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return { controller, cancel: () => clearTimeout(t) };
}

function safeNumber(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function weatherCodeToSummary(code?: number): string {
  // https://open-meteo.com/en/docs#weathervariables
  if (code === undefined) return "Clear";
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 56 || code === 57) return "Freezing drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rain";
  if (code === 66 || code === 67) return "Freezing rain";
  if (code === 71 || code === 73 || code === 75) return "Snow";
  if (code === 77) return "Snow grains";
  if (code === 80 || code === 81 || code === 82) return "Rain showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunderstorm with hail";
  return "Clear";
}

export async function geocodePlace(query: string): Promise<{
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
} | null> {
  const q = query.trim();
  if (!q) return null;

  const cacheKey = `openmeteo_geocode_v1:${q.toLowerCase()}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  const { controller, cancel } = withTimeout(9000);
  try {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", q);
    url.searchParams.set("count", "1");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");
    // bias toward India, but still works globally
    url.searchParams.set("country", "IN");

    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) return null;
    const json = await res.json();
    const first = Array.isArray(json?.results) ? json.results[0] : null;
    if (!first) return null;

    const out = {
      name: String(first?.name ?? q),
      country: first?.country ? String(first.country) : undefined,
      admin1: first?.admin1 ? String(first.admin1) : undefined,
      latitude: safeNumber(first?.latitude) ?? 0,
      longitude: safeNumber(first?.longitude) ?? 0,
      timezone: first?.timezone ? String(first.timezone) : undefined,
    };

    if (!Number.isFinite(out.latitude) || !Number.isFinite(out.longitude)) return null;

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(out));
    } catch {
      // ignore
    }

    return out;
  } catch {
    return null;
  } finally {
    cancel();
  }
}

export async function fetchLiveWeatherByPlace(placeQuery: string): Promise<OpenMeteoResult | null> {
  const place = await geocodePlace(placeQuery);
  if (!place) return null;

  const cacheKey = `openmeteo_weather_v1:${place.latitude.toFixed(3)},${place.longitude.toFixed(3)}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  const { controller, cancel } = withTimeout(9000);
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(place.latitude));
    url.searchParams.set("longitude", String(place.longitude));
    url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m");
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum");
    url.searchParams.set("timezone", place.timezone || "auto");
    url.searchParams.set("forecast_days", "5");

    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) return null;
    const json = await res.json();

    const current = {
      temperatureC: safeNumber(json?.current?.temperature_2m) ?? 0,
      windSpeedKmh: safeNumber(json?.current?.wind_speed_10m),
      weatherCode: safeNumber(json?.current?.weather_code),
    };

    const times: string[] = Array.isArray(json?.daily?.time) ? json.daily.time : [];
    const maxes: unknown[] = Array.isArray(json?.daily?.temperature_2m_max) ? json.daily.temperature_2m_max : [];
    const mins: unknown[] = Array.isArray(json?.daily?.temperature_2m_min) ? json.daily.temperature_2m_min : [];
    const precs: unknown[] = Array.isArray(json?.daily?.precipitation_sum) ? json.daily.precipitation_sum : [];

    const daily: OpenMeteoDaily[] = times.slice(0, 5).map((t, i) => ({
      date: String(t),
      tempMaxC: safeNumber(maxes[i]),
      tempMinC: safeNumber(mins[i]),
      precipitationMm: safeNumber(precs[i]),
    }));

    const out: OpenMeteoResult = {
      name: place.name,
      country: place.country,
      admin1: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone,
      current,
      daily,
    };

    try {
      // cache is short-lived (session); good enough for a SPA “online website” feel
      sessionStorage.setItem(cacheKey, JSON.stringify(out));
    } catch {
      // ignore
    }

    return out;
  } catch {
    return null;
  } finally {
    cancel();
  }
}


