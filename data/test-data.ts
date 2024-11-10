export interface DatosPrueba {
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  numeroTarjeta: string;
  fechaVencimiento: string;
  cvv: string;
}

export const datosPrueba: DatosPrueba = {
  nombre: "Juan Pérez",
  email: "juan.perez@ejemplo.com",
  telefono: "999888777",
  especialidad: "medicina-general",
  numeroTarjeta: "4111111111111111",
  fechaVencimiento: "12/25",
  cvv: "123"
};