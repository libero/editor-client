import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  testDir: './tests',
  use: {
    screenshot: 'on',
    video: 'on',
  },
};
export default config;