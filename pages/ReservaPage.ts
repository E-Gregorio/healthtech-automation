import { Page } from '@playwright/test';
import { DatosPrueba } from '../data/test-data';

export class ReservaPage {
  readonly page: Page;
  readonly nombreInput = '#nombre';
  readonly emailInput = '#email';
  readonly telefonoInput = '#telefono';
  readonly especialidadSelect = '#especialidad';
  readonly fechaInput = '#fecha';
  readonly btnReservar = '#btn-reservar';
  readonly modalPago = '#modal-pago';

  constructor(page: Page) {
    this.page = page;
  }

  async llenarFormularioReserva(datos: DatosPrueba) {
    await this.page.fill(this.nombreInput, datos.nombre);
    await this.page.fill(this.emailInput, datos.email);
    await this.page.fill(this.telefonoInput, datos.telefono);
    await this.page.selectOption(this.especialidadSelect, datos.especialidad);
    await this.page.fill(this.fechaInput, this.obtenerFechaMañana());
}

  async enviarFormularioReserva() {
    await this.page.click(this.btnReservar);
    await this.page.waitForSelector(this.modalPago, { state: 'visible' });
  }

  private obtenerFechaMañana(): string {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    return mañana.toISOString().split('T')[0];
  }
}