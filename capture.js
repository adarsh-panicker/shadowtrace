const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    // 1. Initial Landing Page
    await page.screenshot({ path: 'screenshots/01-landing-page.png', fullPage: false });
    console.log('✓ Captured screenshots/01-landing-page.png');

    // 2. Click Instant Demo Profile
    console.log('Running Recon Audit...');
    await page.click('button:has-text("Instant Demo Profile")');

    // Wait for the gauge & exposure results
    await page.waitForSelector('text=EXPOSURE RISK', { timeout: 15000 });
    // Let animation finish
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({ path: 'screenshots/02-audit-results.png', fullPage: true });
    console.log('✓ Captured screenshots/02-audit-results.png');

    // 3. Click 1-Click Takedown modal
    const buttons = await page.$$('button:has-text("1-Click Takedown")');
    if (buttons.length > 0) {
      await buttons[0].click();
      await page.waitForSelector('text=1-Click Legal Takedown Generator', { timeout: 5000 });
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({ path: 'screenshots/03-takedown-modal.png' });
      console.log('✓ Captured screenshots/03-takedown-modal.png');
    }

    await browser.close();
    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
    process.exit(1);
  }
})();
