import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Directorio de pruebas
  fullyParallel: true, // Ejecuta las pruebas en paralelo
  forbidOnly: !!process.env.CI, // Evita usar test.only en CI
  retries: process.env.CI ? 2 : 0, // Reintentos en CI
  workers: process.env.CI ? 1 : undefined, // Utiliza un solo worker en CI
  reporter: 'html', // Reporte HTML de los resultados

  use: {
    baseURL: 'http://localhost:3000', // URL base de la aplicación
    trace: 'on-first-retry', // Recopila trazas solo cuando falla un test
  },

  webServer: {
    command: 'npx http-server src --port 3000', // Comando para iniciar el servidor
    port: 3000, // Puerto en el que se ejecuta el servidor
    reuseExistingServer: !process.env.CI, // No reiniciar el servidor en CI
  },

  projects: [
    {
      name: 'chromium', // Pruebas en Chromium (Chrome)
      use: { ...devices['Desktop Chrome'] }, // Usar el perfil de "Desktop Chrome"
    },
    {
      name: 'firefox', // Pruebas en Firefox
      use: { ...devices['Desktop Firefox'] }, // Usar el perfil de "Desktop Firefox"
    },
    {
      name: 'webkit', // Pruebas en Webkit (Safari)
      use: { ...devices['Desktop Safari'] }, // Usar el perfil de "Desktop Safari"
    },
  ],
});
