import { Page } from '@playwright/test';

export class PagoPage {
  readonly page: Page;
  readonly numeroTarjetaInput = '#numero-tarjeta';
  readonly fechaVencimientoInput = '#fecha-vencimiento';
  readonly cvvInput = '#cvv';
  readonly btnPagar = '#btn-pagar';
  readonly tarjetaPreview = '#tarjeta-preview';
  readonly mensajeExito = '#mensaje-exito';

  constructor(page: Page) {
    this.page = page;
  }

  async llenarFormularioPago(datos: any) {
    await this.page.fill(this.numeroTarjetaInput, datos.numeroTarjeta);
    await this.page.fill(this.fechaVencimientoInput, datos.fechaVencimiento);
    await this.page.fill(this.cvvInput, datos.cvv);
  }

  async pagar() {
    await this.page.click(this.btnPagar);
    await this.page.waitForSelector(this.mensajeExito, { state: 'visible' });
  }
}