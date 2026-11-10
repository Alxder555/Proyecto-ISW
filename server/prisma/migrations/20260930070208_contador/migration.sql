/*
  Warnings:

  - You are about to drop the column `trabajoId` on the `AsignacionKit` table. All the data in the column will be lost.
  - You are about to drop the `Trabajo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventoId` to the `AsignacionKit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoGasto" AS ENUM ('REMUNERACION', 'MOVILIZACION', 'PEAJE', 'OTRO');

-- DropForeignKey
ALTER TABLE "AsignacionKit" DROP CONSTRAINT "AsignacionKit_trabajoId_fkey";

-- AlterTable
ALTER TABLE "AsignacionKit" DROP COLUMN "trabajoId",
ADD COLUMN     "eventoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Trabajo";

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cliente" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "valorTransmision" DECIMAL(10,2),
    "aporteAuspiciador" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gasto" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "tipo" "TipoGasto" NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntoSalida" TEXT,
    "puntoLlegada" TEXT,
    "comprobante" TEXT,
    "observacion" TEXT,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AsignacionKit" ADD CONSTRAINT "AsignacionKit_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
