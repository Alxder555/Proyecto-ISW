export const ESTADOS_KIT = {
    LIBRE: { label: 'Libre', color: 'green' },
    ASIGNADO: { label: 'Asignado', color: 'blue' },
};
export function estadoKit(valor) {
  return ESTADOS_KIT[valor] ?? { label: valor, color: 'gray' };
}