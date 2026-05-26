import bcrypt from "bcryptjs";
import {
  ClientState,
  PrismaClient,
  Priority,
  RecordStatus,
  Role,
  TaskType,
  TransactionKind
} from "@prisma/client";

const db = new PrismaClient();
const day = (offset: number) => new Date(Date.now() + offset * 86400000);

async function main() {
  await db.auditLog.deleteMany();
  await db.protocol.deleteMany();
  await db.task.deleteMany();
  await db.document.deleteMany();
  await db.transaction.deleteMany();
  await db.client.deleteMany();
  await db.user.deleteMany();

  const director = await db.user.create({
    data: {
      name: "Luciana Wayne",
      email: "diretoria@waynefinance.com.br",
      passwordHash: await bcrypt.hash("Wayne@2026", 12),
      role: Role.DIRECTOR
    }
  });
  const analyst = await db.user.create({
    data: {
      name: "Rafael Martins",
      email: "financeiro@waynefinance.com.br",
      passwordHash: await bcrypt.hash("Wayne@2026", 12),
      role: Role.FINANCIAL_ANALYST
    }
  });

  const clients = await Promise.all([
    db.client.create({ data: { legalName: "Aurora Tecnologia Ltda", tradeName: "Aurora Tech", cnpj: "12.345.678/0001-90", phone: "(11) 3020-1001", whatsapp: "(11) 99111-2010", email: "financeiro@auroratech.com.br", accountant: "Camila Dias", taxRegime: "Lucro Presumido", monthlyFee: 8900, certificateExpiration: day(38), state: ClientState.ACTIVE, internalNotes: "Fechamento ate o terceiro dia util." } }),
    db.client.create({ data: { legalName: "Atlas Logistica S.A.", tradeName: "Atlas Log", cnpj: "23.456.789/0001-12", phone: "(21) 3055-8850", whatsapp: "(21) 98800-1212", email: "controladoria@atlaslog.com.br", accountant: "Marcos Vieira", taxRegime: "Lucro Real", monthlyFee: 12750, certificateExpiration: day(14), state: ClientState.DELINQUENT, internalNotes: "Cobranca escalada para diretoria." } }),
    db.client.create({ data: { legalName: "Vertice Clinicas Integradas Ltda", tradeName: "Vertice Saude", cnpj: "34.567.890/0001-23", phone: "(31) 3221-0088", whatsapp: "(31) 99700-8080", email: "adm@verticesaude.com.br", accountant: "Beatriz Lima", taxRegime: "Simples Nacional", monthlyFee: 6450, certificateExpiration: day(72), state: ClientState.ACTIVE } }),
    db.client.create({ data: { legalName: "Summit Engenharia e Obras Ltda", tradeName: "Summit", cnpj: "45.678.901/0001-34", phone: "(41) 3090-7710", whatsapp: "(41) 99001-1010", email: "contas@summiteng.com.br", accountant: "Camila Dias", taxRegime: "Lucro Presumido", monthlyFee: 10200, certificateExpiration: day(25), state: ClientState.ACTIVE } })
  ]);

  await db.transaction.createMany({
    data: [
      { kind: TransactionKind.RECEIVABLE, description: "Honorarios mensais - Aurora Tech", category: "Honorarios", counterparty: "Aurora Tech", dueDate: day(2), amount: 8900, status: RecordStatus.PENDING, priority: Priority.NORMAL, clientId: clients[0].id, recurrence: "Mensal" },
      { kind: TransactionKind.RECEIVABLE, description: "Honorarios em atraso - Atlas Log", category: "Honorarios", counterparty: "Atlas Log", dueDate: day(-6), amount: 12750, status: RecordStatus.URGENT, priority: Priority.CRITICAL, clientId: clients[1].id, notes: "Segunda notificacao enviada." },
      { kind: TransactionKind.RECEIVABLE, description: "Honorarios mensais - Vertice Saude", category: "Honorarios", counterparty: "Vertice Saude", dueDate: day(-2), paymentDate: day(-2), amount: 6450, status: RecordStatus.COMPLETED, priority: Priority.NORMAL, clientId: clients[2].id },
      { kind: TransactionKind.RECEIVABLE, description: "Honorarios mensais - Summit", category: "Honorarios", counterparty: "Summit", dueDate: day(5), amount: 10200, status: RecordStatus.PENDING, priority: Priority.HIGH, clientId: clients[3].id },
      { kind: TransactionKind.PAYABLE, description: "Licenca ERP contabil", category: "Assinaturas", counterparty: "Omni Sistemas", dueDate: day(3), amount: 3280, status: RecordStatus.PENDING, priority: Priority.HIGH, recurrence: "Mensal" },
      { kind: TransactionKind.PAYABLE, description: "Folha equipe operacional", category: "Folha de Pagamento", counterparty: "Colaboradores", dueDate: day(5), amount: 28900, status: RecordStatus.IN_PROGRESS, priority: Priority.CRITICAL },
      { kind: TransactionKind.PAYABLE, description: "DAS e tributos internos", category: "Impostos", counterparty: "Receita Federal", dueDate: day(1), amount: 4870, status: RecordStatus.URGENT, priority: Priority.CRITICAL },
      { kind: TransactionKind.PAYABLE, description: "Infraestrutura cloud", category: "Despesas Fixas", counterparty: "Cloud Prime", dueDate: day(-4), paymentDate: day(-4), amount: 1640, status: RecordStatus.COMPLETED, priority: Priority.NORMAL, recurrence: "Mensal" }
    ]
  });

  await db.document.createMany({
    data: [
      { name: "Contrato BPO - Aurora Tech.pdf", category: "Contratos", fileType: "PDF", url: "/docs/contrato-aurora.pdf", clientId: clients[0].id, status: RecordStatus.COMPLETED },
      { name: "DARF Maio - Atlas Log.pdf", category: "Impostos", fileType: "PDF", url: "/docs/darf-atlas.pdf", clientId: clients[1].id, status: RecordStatus.PENDING },
      { name: "Extrato Consolidado - Summit.pdf", category: "Extratos", fileType: "PDF", url: "/docs/extrato-summit.pdf", clientId: clients[3].id, status: RecordStatus.IN_PROGRESS },
      { name: "Procuracao Digital - Vertice.pdf", category: "Procuracoes", fileType: "PDF", url: "/docs/procuracao-vertice.pdf", clientId: clients[2].id, status: RecordStatus.COMPLETED }
    ]
  });

  await db.task.createMany({
    data: [
      { title: "Verificar contas do dia", description: "Conferir vencimentos e saldos bancarios.", type: TaskType.DAILY_CHECKLIST, dueDate: day(0), priority: Priority.HIGH, status: RecordStatus.IN_PROGRESS, responsibleId: analyst.id },
      { title: "Conferir comprovantes", description: "Vincular comprovantes aos pagamentos baixados.", type: TaskType.DAILY_CHECKLIST, dueDate: day(0), priority: Priority.NORMAL, status: RecordStatus.PENDING, responsibleId: analyst.id },
      { title: "Realizar cobranca Atlas Log", description: "Acionar financeiro e registrar retorno.", type: TaskType.PENDING_ISSUE, dueDate: day(0), priority: Priority.CRITICAL, status: RecordStatus.URGENT, responsibleId: director.id, clientId: clients[1].id },
      { title: "Renovar certificado Atlas", description: "Solicitar novo certificado antes do bloqueio.", type: TaskType.PENDING_ISSUE, dueDate: day(4), priority: Priority.HIGH, status: RecordStatus.PENDING, responsibleId: analyst.id, clientId: clients[1].id },
      { title: "Fechamento operacional", description: "Validar relatorios e dossie diario.", type: TaskType.DAILY_CHECKLIST, dueDate: day(0), priority: Priority.NORMAL, status: RecordStatus.PENDING, responsibleId: director.id }
    ]
  });

  await db.protocol.createMany({
    data: [
      { number: "2026-0001", action: "Abertura de cobranca de honorarios", responsibleId: director.id, clientId: clients[1].id, notes: "Notificacao por e-mail e WhatsApp enviada.", occurredAt: day(-2) },
      { number: "2026-0002", action: "Recepcao de comprovante tributario", responsibleId: analyst.id, clientId: clients[0].id, notes: "Documento conferido e arquivado.", occurredAt: day(-1) },
      { number: "2026-0003", action: "Solicitacao de renovacao de certificado", responsibleId: analyst.id, clientId: clients[1].id, notes: "Aguardando assinatura digital.", occurredAt: day(0) }
    ]
  });

  console.log("Base inicial WAYNE CORPORATE FINANCE criada.");
}

main()
  .finally(async () => db.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

