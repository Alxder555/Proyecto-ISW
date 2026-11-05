-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
ADD COLUMN     "ubicacion" TEXT;

-- AlterTable
ALTER TABLE "Kit" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'LIBRE';

-- CreateTable
CREATE TABLE "Operador" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "funcion" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Operador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rolContador" BOOLEAN NOT NULL DEFAULT false,
    "rolInventario" BOOLEAN NOT NULL DEFAULT false,
    "rolSupervisor" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perdida" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perdida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventoToOperador" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventoToOperador_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventoToKit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventoToKit_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "_EventoToOperador_B_index" ON "_EventoToOperador"("B");

-- CreateIndex
CREATE INDEX "_EventoToKit_B_index" ON "_EventoToKit"("B");

-- AddForeignKey
ALTER TABLE "_EventoToOperador" ADD CONSTRAINT "_EventoToOperador_A_fkey" FOREIGN KEY ("A") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventoToOperador" ADD CONSTRAINT "_EventoToOperador_B_fkey" FOREIGN KEY ("B") REFERENCES "Operador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventoToKit" ADD CONSTRAINT "_EventoToKit_A_fkey" FOREIGN KEY ("A") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventoToKit" ADD CONSTRAINT "_EventoToKit_B_fkey" FOREIGN KEY ("B") REFERENCES "Kit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
