import { test, expect, type Page } from "@playwright/test";

/** Console errors that are environment noise in headless CI rather than app defects. */
const IGNORED = [/WebGL/i, /GPU stall/i, /THREE\.WebGLRenderer/i, /Failed to load resource.*power\.larc\.nasa\.gov/i, /speech/i];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !IGNORED.some((r) => r.test(m.text()))) errors.push(m.text());
  });
  return errors;
}

for (const route of ["/", "/time-travel", "/nasa-data", "/bangladesh-agriculture", "/recycling", "/agrilume-farming-game.html"]) {
  test(`route ${route} loads without uncaught errors`, async ({ page }) => {
    const errors = collectErrors(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    expect(errors, errors.join("\n")).toEqual([]);
  });
}

test("home: no horizontal scrolling at this viewport", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("home: every image has alt text", async ({ page }) => {
  await page.goto("/");
  const missing = await page.locator("img:not([alt])").count();
  expect(missing).toBe(0);
});

test("download section is honest while no APK is released", async ({ page }) => {
  await page.goto("/#download");
  const section = page.locator("#download");
  await expect(section.getByText("Android app: coming soon")).toBeVisible();
  await expect(section.getByText("Not yet released")).toBeVisible();
  await expect(section.getByText(/Latest release/i)).toHaveCount(0);
  await expect(section.getByText(/Scan to download/i)).toHaveCount(0);
  await expect(section.locator('a[download], a[href="#"]')).toHaveCount(0);
  await expect(section.getByRole("link", { name: /Watch releases on GitHub/ })).toHaveAttribute("href", /github\.com\/niloy-datta\/agrilume-web\/releases/);
});

/** Panels exist twice (desktop sidebar, mobile sheet); act on the visible copy and open the tab if needed. */
async function openTab(page: Page, name: RegExp) {
  await page.getByRole("button", { name }).filter({ visible: true }).first().click();
}
async function ensurePlacePanel(page: Page) {
  if ((await page.getByLabel("Division").filter({ visible: true }).count()) === 0) await openTab(page, /Place/);
}

test.describe("Time Travel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/time-travel");
    // the app starts in Bangla; switch to English for stable selectors
    await page.getByRole("button", { name: "Switch to English" }).filter({ visible: true }).first().click();
  });

  test("switching district loads that district's own NASA POWER file (no stand-in)", async ({ page }) => {
    const powerReq = page.waitForResponse((r) => r.url().endsWith("/data/power/sylhet.json") && r.status() === 200);
    await ensurePlacePanel(page);
    await page.getByLabel("Division").filter({ visible: true }).selectOption("sylhet");
    await page.getByLabel("District").filter({ visible: true }).selectOption("sylhet");
    await powerReq;
    await expect(page.getByText(/Real NASA POWER monthly data bundled at build time \(1981–2025/).filter({ visible: true })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: /Stand-in data|Loading…/ })).toHaveCount(0);
  });

  test("if the district file and the live API both fail, a prominent stand-in warning appears", async ({ page }) => {
    await page.route("**/data/power/khulna.json", (r) => r.abort());
    await page.route("https://power.larc.nasa.gov/**", (r) => r.abort());
    await ensurePlacePanel(page);
    await page.getByLabel("Division").filter({ visible: true }).selectOption("khulna");
    await page.getByLabel("District").filter({ visible: true }).selectOption("khulna");
    await expect(page.getByRole("alert").filter({ hasText: "Stand-in data" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("alert").filter({ hasText: /projections are disabled/ })).toBeVisible();
  });

  test("Scenario A vs B comparison renders numbers, reasons and caveats", async ({ page }) => {
    await openTab(page, /Compare/);
    const table = page.getByRole("table", { name: /Scenario A versus B/ }).filter({ visible: true });
    await expect(table).toBeVisible();
    await expect(table.getByRole("rowheader", { name: /Crop-condition index/ })).toBeVisible();
    await expect(page.getByText("Why the difference?").filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText(/not calibrated against Bangladesh yield data/).filter({ visible: true }).first()).toBeVisible();
  });

  test("NASA data tab shows separate integration stages", async ({ page }) => {
    await openTab(page, /NASA data/);
    await expect(page.getByRole("list", { name: "Integration stages" }).first()).toBeVisible();
  });
});
