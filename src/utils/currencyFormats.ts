// src/utils/currencyFormats.ts

const defaultCurrencyByLocale: Record<string, string> = {
  "en-US": "USD",
  "es-ES": "EUR",
  "ja-JP": "JPY",
  "es-MX": "MXN",
  "es-AR": "ARS",
  "es-BO": "BOB",
  "pt-BR": "BRL",
  "es-CL": "CLP",
  "es-CO": "COP",
  "es-EC": "USD",
  "es-PY": "PYG",
  "es-PE": "PEN",
  "es-UY": "UYU",
  "es-VE": "VES",
};

/**
 * Llama a ipapi.co y devuelve un locale BCP-47, o `null` si falla.
 */
async function detectLocaleByIP(): Promise<string | null> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("GeoIP failed");
    const { country_code: country } = (await res.json()) as {
      country_code: string;
    };
    const lang = country.toUpperCase() === "BR" ? "pt" : "es";
    return `${lang}-${country.toUpperCase()}`; // e.g. "es-CO"
  } catch {
    return null;
  }
}

/**
 * Formatea un número a moneda, detectando primero por IP y luego por navegador.
 */
export async function currencyFormatAsync(
  value: number,
  options?: { locale?: string; currency?: string }
): Promise<string> {
  // 1) Determina locale:
  let locale: string;

  if (options?.locale) {
    // Si te lo pasan explícito, lo usas
    locale = options.locale;
  } else {
    // Primero intento por IP...
    const ipLocale = await detectLocaleByIP();
    if (ipLocale) {
      locale = ipLocale;
      console.log(locale);
    } else if (typeof navigator !== "undefined") {
      // ...si falla, caigo en el navigator.language
      locale = navigator.language;
    } else {
      // ...y en último caso un fallback
      locale = "en-US";
    }
  }

  // 2) Determina currency:
  const currency =
    options?.currency ??
    defaultCurrencyByLocale[locale as keyof typeof defaultCurrencyByLocale] ??
    "USD";

  // 3) Formatea:
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
