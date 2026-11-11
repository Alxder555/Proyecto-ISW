import {
  IconAlertTriangle,
  IconBox,
  IconCalendarEvent,
  IconHome,
  IconPackages,
  IconReceipt,
  IconTruckDelivery,
  IconUsers,
} from '@tabler/icons-react';

export const INICIO = { label: 'Inicio', to: '/inicio', icon: IconHome };

// Ajusta los privilegios de cada opción según lo acordado con el equipo
export const SECCIONES = [
  {
    titulo: 'Inventario',
    items: [
      {
        label: 'Equipos',
        to: '/equipos',
        icon: IconBox,
        descripcion: 'Registrar y consultar equipos y su estado',
        privilegios: ['rolInventario'],
      },
      {
        label: 'Kits',
        to: '/kits',
        icon: IconPackages,
        descripcion: 'Armar kits y asignarles equipos',
        privilegios: ['rolInventario'],
      },
      {
        label: 'Asignaciones',
        to: '/asignaciones',
        icon: IconTruckDelivery,
        descripcion: 'Entregar kits a eventos y registrar devoluciones',
        privilegios: ['rolInventario'],
      },
    ],
  },
  {
    titulo: 'Operación',
    items: [
      {
        label: 'Eventos',
        to: '/eventos',
        icon: IconCalendarEvent,
        descripcion: 'Crear y gestionar eventos',
        privilegios: ['rolSupervisor'],
      },
    ],
  },
  {
    titulo: 'Finanzas',
    items: [
      {
        label: 'Gastos',
        to: '/gastos',
        icon: IconReceipt,
        descripcion: 'Registrar y revisar gastos por evento',
        privilegios: ['rolContador'],
      },
      {
        label: 'Pérdidas',
        to: '/perdidas',
        icon: IconAlertTriangle,
        descripcion: 'Registrar pérdidas de equipos',
        privilegios: ['rolContador'],
      },
    ],
  },
  {
    titulo: 'Administración',
    items: [
      {
        label: 'Usuarios',
        to: '/usuarios',
        icon: IconUsers,
        descripcion: 'Crear usuarios y cambiar contraseñas',
        privilegios: ['rolAdministrador'],
      },
    ],
  },
];

export const ITEMS = SECCIONES.flatMap((s) => s.items);

// Debe reflejar la regla de requierePrivilegio del backend:
export function tienePrivilegio(usuario, privilegios = []) {
  if (!usuario) return false;
  if (privilegios.length === 0) return true;
  return usuario.rolAdministrador || privilegios.some((p) => usuario[p]);
}

export function seccionesVisibles(usuario) {
  return SECCIONES.map((s) => ({
    ...s,
    items: s.items.filter((i) => tienePrivilegio(usuario, i.privilegios)),
  })).filter((s) => s.items.length > 0);
}