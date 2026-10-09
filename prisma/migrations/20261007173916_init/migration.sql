-- CreateEnum
CREATE TYPE "public"."TipoTransacao" AS ENUM ('RECEITA', 'DESPESA');

-- CreateTable
CREATE TABLE "public"."Conta" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "saldoInicial" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "public"."TipoTransacao" NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transacao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "tipo" "public"."TipoTransacao" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "contaId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conta_nome_key" ON "public"."Conta"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "public"."Categoria"("nome");

-- CreateIndex
CREATE INDEX "Transacao_data_idx" ON "public"."Transacao"("data");

-- CreateIndex
CREATE INDEX "Transacao_tipo_idx" ON "public"."Transacao"("tipo");

-- AddForeignKey
ALTER TABLE "public"."Transacao" ADD CONSTRAINT "Transacao_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "public"."Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transacao" ADD CONSTRAINT "Transacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
