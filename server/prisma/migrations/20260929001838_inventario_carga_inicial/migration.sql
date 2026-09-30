-- CreateEnum
CREATE TYPE "EstadoEquipo" AS ENUM ('BUEN_ESTADO', 'DANADO', 'PERDIDO');

-- CreateTable
CREATE TABLE "Kit" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoEquipo" NOT NULL DEFAULT 'BUEN_ESTADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kitId" INTEGER,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cliente" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionKit" (
    "id" SERIAL NOT NULL,
    "trabajoId" INTEGER NOT NULL,
    "kitId" INTEGER NOT NULL,
    "fechaEntrega" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDevolucion" TIMESTAMP(3),

    CONSTRAINT "AsignacionKit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleEquipoAsignacion" (
    "id" SERIAL NOT NULL,
    "asignacionId" INTEGER NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "estadoEntrega" "EstadoEquipo" NOT NULL,
    "estadoDevolucion" "EstadoEquipo",
    "observaciones" TEXT,

    CONSTRAINT "DetalleEquipoAsignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialEquipoKit" (
    "id" SERIAL NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "kitId" INTEGER NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaSalida" TIMESTAMP(3),
    "motivo" TEXT,

    CONSTRAINT "HistorialEquipoKit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "Kit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionKit" ADD CONSTRAINT "AsignacionKit_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionKit" ADD CONSTRAINT "AsignacionKit_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "Kit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleEquipoAsignacion" ADD CONSTRAINT "DetalleEquipoAsignacion_asignacionId_fkey" FOREIGN KEY ("asignacionId") REFERENCES "AsignacionKit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleEquipoAsignacion" ADD CONSTRAINT "DetalleEquipoAsignacion_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEquipoKit" ADD CONSTRAINT "HistorialEquipoKit_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEquipoKit" ADD CONSTRAINT "HistorialEquipoKit_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "Kit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
