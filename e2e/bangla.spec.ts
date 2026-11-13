import { test, expect, type Page } from "@playwright/test";

/**
 * In Bangla mode, visible text must not contain English words — except proper names of products, units and
 * datasets that have no Bangla equivalent. Guards against the "Bangla + English mixed" regression.
 */
const ALLOWED = new Set(
  [
    "NASA", "POWER", "MODIS", "NDVI", "ORNL", "DAAC", "NEX", "GDDP", "CMIP6", "SSP2", "SSP5", "AgriLume", "VR", "AWD",
    "ECe", "dS", "EN", "FAO", "AI", "BMD", "FFWC", "DDM", "DAE", "BARI", "BRRI", "SRDI", "BINA", "BADC", "WebXR", "GPS", "km", "mm",
  ].map((w) => w.toLowerCase()),
);

async function englishWords(page: Page): Promise<string[]> {
  const texts = await page.evaluate(() => {
    const out: string[] = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = w.nextNode())) {
      const el = n.parentElement;
      const t = n.textContent?.trim();
      // the 3D labels are canvas textures; native date inputs follow the browser locale and are excluded
      if (!el || !t || !el.checkVisibility() || el.closest("canvas, input")) continue;
      out.push(t);
    }
    return out;
  });
  const bad = new Set<string>();
  for (const t of texts) for (const w of t.match(/[A-Za-z][A-Za-z0-9]{2,}/g) ?? []) if (!ALLOWED.has(w.toLowerCase())) bad.add(`${w}  ←  "${t.slice(0, 70)}"`);
  return [...bad];
}

test("Time Travel in Bangla mode shows no stray English", async ({ page }) => {
  await page.goto("/time-travel");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  expect(await englishWords(page)).toEqual([]);
});

for (const tab of ["ফসল", "তুলনা", "দুর্যোগ"]) {
  test(`Bangla mode, ${tab} tab shows no stray English`, async ({ page }) => {
    await page.goto("/time-travel");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: new RegExp(tab) }).filter({ visible: true }).first().click();
    await page.waitForTimeout(800);
    expect(await englishWords(page)).toEqual([]);
  });
}
