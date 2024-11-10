import { test, expect } from '@playwright/test';
import { ReservaPage} from '../pages/ReservaPage';
import { PagoPage } from '../pages/PagoPage';
import { datosPrueba } from '../data/test-data';

test.describe('Clínica Salud Integral - Pruebas E2E', () => {
  let reservaPage: ReservaPage;
  let pagoPage: PagoPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000'); // Ajusta la URL según tu entorno
    reservaPage = new ReservaPage(page);
    pagoPage = new PagoPage(page);
  });

  test('debería mostrar el título correcto', async ({ page }) => {
    await expect(page).toHaveTitle('Clínica Salud Integral');
  });

  test('debería mostrar todos los elementos de navegación', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav.getByText('Inicio')).toBeVisible();
    await expect(nav.getByText('Servicios')).toBeVisible();
    await expect(nav.getByText('Reservar Cita')).toBeVisible();
    await expect(nav.getByText('Contacto')).toBeVisible();
  });

  test('debería completar todo el proceso de reserva exitosamente', async ({ page }) => {
    await reservaPage.llenarFormularioReserva(datosPrueba);
    await reservaPage.enviarFormularioReserva();
    await pagoPage.llenarFormularioPago(datosPrueba);
    await pagoPage.pagar();
    
    await expect(page.locator('#mensaje-exito')).toBeVisible();
    await expect(page.locator('#mensaje-exito')).toHaveText(
      '¡Su cita ha sido reservada exitosamente! Se ha enviado un correo de confirmación.'
    );
  });
});