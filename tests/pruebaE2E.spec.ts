import { test, expect, type Page } from '@playwright/test';

// Datos de prueba
const datosPrueba = {
  nombre: 'Juan Pérez',
  email: 'juan.perez@ejemplo.com',
  telefono: '999888777',
  especialidad: 'medicina-general',
  numeroTarjeta: '4111111111111111',
  fechaVencimiento: '12/25',
  cvv: '123'
};

// Función auxiliar para obtener la fecha de mañana en formato YYYY-MM-DD
const obtenerFechaMañana = (): string => {
  const mañana = new Date();
  mañana.setDate(mañana.getDate() + 1);
  return mañana.toISOString().split('T')[0];
};

async function llenarFormularioCita(page: Page) {
  await page.fill('#nombre', datosPrueba.nombre);
  await page.fill('#email', datosPrueba.email);
  await page.fill('#telefono', datosPrueba.telefono);
  await page.selectOption('#especialidad', datosPrueba.especialidad);
  await page.fill('#fecha', obtenerFechaMañana());
}

async function llenarFormularioPago(page: Page) {
  await page.waitForSelector('#numero-tarjeta');
  await page.fill('#numero-tarjeta', datosPrueba.numeroTarjeta);
  await page.fill('#fecha-vencimiento', datosPrueba.fechaVencimiento);
  await page.fill('#cvv', datosPrueba.cvv);
}

async function scrollToElement(page: Page, selector: string) {
  await page.$eval(selector, (element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  // Pequeña pausa para asegurar que el scroll se complete
  await page.waitForTimeout(500);
}

test.describe('Clínica Salud Integral - Pruebas E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000'); // Ajusta la URL según tu entorno
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

  test('debería mostrar la lista de precios correctamente', async ({ page }) => {
    const precios = page.locator('.precios');
    await expect(precios).toContainText('Medicina General: S/. 80.00');
    await expect(precios).toContainText('Pediatría: S/. 100.00');
    await expect(precios).toContainText('Cardiología: S/. 150.00');
    await expect(precios).toContainText('Dermatología: S/. 120.00');
  });

  test('debería validar campos requeridos en el formulario de cita', async ({ page }) => {
    await scrollToElement(page, '#btn-reservar');
    await page.click('#btn-reservar');
    
    // Verificar que los campos requeridos muestren validación
    await expect(page.locator('#nombre:invalid')).toBeVisible();
    await expect(page.locator('#email:invalid')).toBeVisible();
    await expect(page.locator('#telefono:invalid')).toBeVisible();
    await expect(page.locator('#especialidad:invalid')).toBeVisible();
    await expect(page.locator('#fecha:invalid')).toBeVisible();
  });

  test('debería abrir el modal de pago al enviar el formulario de cita', async ({ page }) => {
    await llenarFormularioCita(page);
    await scrollToElement(page, '#btn-reservar');
    await page.click('#btn-reservar');
    
    // Esperar a que el modal esté visible
    await page.waitForSelector('#modal-pago', { state: 'visible' });
    
    // Verificar el resumen de la cita
    const resumen = page.locator('#resumen-cita');
    await expect(resumen).toContainText(datosPrueba.nombre);
    
  });

  test('debería poder cerrar el modal de pago', async ({ page }) => {
    await llenarFormularioCita(page);
    await scrollToElement(page, '#btn-reservar');
    await page.click('#btn-reservar');
    
    await page.waitForSelector('#cerrar-modal', { state: 'visible' });
    await page.click('#cerrar-modal');
    
    await expect(page.locator('#modal-pago')).not.toBeVisible();
  });

  test('debería mostrar la vista previa de la tarjeta', async ({ page }) => {
    await llenarFormularioCita(page);
    await scrollToElement(page, '#btn-reservar');
    await page.click('#btn-reservar');
    
    await page.waitForSelector('#numero-tarjeta', { state: 'visible' });
    await page.fill('#numero-tarjeta', datosPrueba.numeroTarjeta);
    
    const tarjetaPreview = page.locator('#tarjeta-preview');
    await expect(tarjetaPreview).toContainText('**** **** **** 1111');
  });

  test('debería completar todo el proceso de reserva exitosamente', async ({ page }) => {
    // Llenar y enviar formulario de cita
    await llenarFormularioCita(page);
    await scrollToElement(page, '#btn-reservar');
    await page.click('#btn-reservar');
    
    // Esperar a que el modal esté visible y llenar el formulario de pago
    await page.waitForSelector('#modal-pago', { state: 'visible' });
    await llenarFormularioPago(page);
    
    // Hacer scroll al botón de pago y hacer clic
    await scrollToElement(page, '#btn-pagar');
    await page.click('#btn-pagar');
    
    // Verificar el indicador de carga
    const loading = page.locator('#loading');
    await expect(loading).toBeVisible();
    
    // Esperar a que aparezca el mensaje de éxito
    await page.waitForSelector('#mensaje-exito', { state: 'visible' });
    await expect(page.locator('#mensaje-exito')).toHaveText(
      '¡Su cita ha sido reservada exitosamente! Se ha enviado un correo de confirmación.'
    );
  });

  test('debería mantener la consistencia de la interfaz durante el proceso', async ({ page }) => {
    // Verificar estado inicial
    await expect(page.locator('#mensaje-exito')).not.toBeVisible();
    await expect(page.locator('#modal-pago')).not.toBeVisible();
    
    // Completar proceso
    await llenarFormularioCita(page);
    await scrollToElement(page, '#btn-reservar');
    await page.click('#btn-reservar');
    
    await page.waitForSelector('#modal-pago', { state: 'visible' });
    await llenarFormularioPago(page);
    
    // Hacer scroll al botón de pago y hacer clic
    await scrollToElement(page, '#btn-pagar');
    await page.click('#btn-pagar');
    
    // Esperar a que se limpien los formularios
    await page.waitForTimeout(2500); // Esperar a que termine la animación
    
    // Verificar limpieza de formularios
    await expect(page.locator('#nombre')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('#telefono')).toHaveValue('');
    await expect(page.locator('#especialidad')).toHaveValue('');
    await expect(page.locator('#fecha')).toHaveValue('');
  });
});