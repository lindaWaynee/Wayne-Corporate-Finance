export type Status = "Concluido" | "Pendente" | "Urgente" | "Em andamento" | "Arquivado";
export type Priority = "Baixa" | "Normal" | "Alta" | "Critica";

export type Transaction = {
  id: string;
  type: "Pagar" | "Receber";
  description: string;
  category: string;
  party: string;
  dueDate: string;
  paymentDate?: string;
  amount: number;
  priority: Priority;
  status: Status;
  recurrence: string;
  note: string;
  attachment: string;
};

export const transactions: Transaction[] = [
  { id: "CP-00482", type: "Pagar", description: "DAS e tributos internos", category: "Impostos", party: "Receita Federal", dueDate: "26/05/2026", amount: 4870, priority: "Critica", status: "Urgente", recurrence: "Mensal", note: "Guia validada, aguardando aprovacao.", attachment: "DARF_052026.pdf" },
  { id: "CP-00483", type: "Pagar", description: "Licenca ERP contabil", category: "Assinaturas", party: "Omni Sistemas", dueDate: "28/05/2026", amount: 3280, priority: "Alta", status: "Pendente", recurrence: "Mensal", note: "Renovacao automatica conferida.", attachment: "Boleto_Omni.pdf" },
  { id: "CP-00484", type: "Pagar", description: "Folha equipe operacional", category: "Folha de Pagamento", party: "Colaboradores", dueDate: "30/05/2026", amount: 28900, priority: "Critica", status: "Em andamento", recurrence: "Mensal", note: "Aguardando aprovacao da diretoria.", attachment: "Folha_Maio.pdf" },
  { id: "CP-00470", type: "Pagar", description: "Infraestrutura cloud", category: "Despesas Fixas", party: "Cloud Prime", dueDate: "21/05/2026", paymentDate: "21/05/2026", amount: 1640, priority: "Normal", status: "Concluido", recurrence: "Mensal", note: "Comprovante conciliado.", attachment: "Comprovante_Cloud.pdf" },
  { id: "CR-00820", type: "Receber", description: "Honorarios mensais - Aurora Tech", category: "Honorarios", party: "Aurora Tech", dueDate: "27/05/2026", amount: 8900, priority: "Normal", status: "Pendente", recurrence: "Mensal", note: "NF emitida e encaminhada.", attachment: "NF_820.pdf" },
  { id: "CR-00818", type: "Receber", description: "Honorarios em atraso - Atlas Log", category: "Cobrancas", party: "Atlas Log", dueDate: "19/05/2026", amount: 12750, priority: "Critica", status: "Urgente", recurrence: "Mensal", note: "Segunda notificacao protocolada.", attachment: "Cobranca_Atlas.pdf" },
  { id: "CR-00814", type: "Receber", description: "Honorarios mensais - Vertice Saude", category: "Honorarios", party: "Vertice Saude", dueDate: "23/05/2026", paymentDate: "23/05/2026", amount: 6450, priority: "Normal", status: "Concluido", recurrence: "Mensal", note: "Recebimento conciliado.", attachment: "Recibo_Vertice.pdf" },
  { id: "CR-00825", type: "Receber", description: "Honorarios mensais - Summit", category: "Previsoes de recebimento", party: "Summit", dueDate: "30/05/2026", amount: 10200, priority: "Alta", status: "Pendente", recurrence: "Mensal", note: "Enviar lembrete em 28/05.", attachment: "Contrato_Summit.pdf" }
];

export const clients = [
  { name: "Aurora Tecnologia Ltda", brand: "Aurora Tech", cnpj: "12.345.678/0001-90", phone: "(11) 3020-1001", whatsapp: "(11) 99111-2010", email: "financeiro@auroratech.com.br", accountant: "Camila Dias", regime: "Lucro Presumido", fee: 8900, certificate: "02/07/2026", status: "Ativo", docs: 24, note: "Fechamento ate o terceiro dia util." },
  { name: "Atlas Logistica S.A.", brand: "Atlas Log", cnpj: "23.456.789/0001-12", phone: "(21) 3055-8850", whatsapp: "(21) 98800-1212", email: "controladoria@atlaslog.com.br", accountant: "Marcos Vieira", regime: "Lucro Real", fee: 12750, certificate: "08/06/2026", status: "Inadimplente", docs: 42, note: "Cobranca escalada para diretoria." },
  { name: "Vertice Clinicas Integradas Ltda", brand: "Vertice Saude", cnpj: "34.567.890/0001-23", phone: "(31) 3221-0088", whatsapp: "(31) 99700-8080", email: "adm@verticesaude.com.br", accountant: "Beatriz Lima", regime: "Simples Nacional", fee: 6450, certificate: "05/08/2026", status: "Ativo", docs: 18, note: "Envio de relatorio semanal." },
  { name: "Summit Engenharia e Obras Ltda", brand: "Summit", cnpj: "45.678.901/0001-34", phone: "(41) 3090-7710", whatsapp: "(41) 99001-1010", email: "contas@summiteng.com.br", accountant: "Camila Dias", regime: "Lucro Presumido", fee: 10200, certificate: "19/06/2026", status: "Ativo", docs: 31, note: "Centro de custos por obra." }
];

export const documents = [
  { name: "Contrato BPO - Aurora Tech.pdf", category: "Contratos", client: "Aurora Tech", date: "22/05/2026", owner: "Camila Dias", status: "Concluido" as Status, size: "2,4 MB" },
  { name: "DARF Maio - Atlas Log.pdf", category: "Impostos", client: "Atlas Log", date: "24/05/2026", owner: "Rafael Martins", status: "Pendente" as Status, size: "390 KB" },
  { name: "Extrato Consolidado - Summit.pdf", category: "Extratos", client: "Summit", date: "25/05/2026", owner: "Rafael Martins", status: "Em andamento" as Status, size: "1,8 MB" },
  { name: "Procuracao Digital - Vertice.pdf", category: "Procuracoes", client: "Vertice Saude", date: "18/05/2026", owner: "Beatriz Lima", status: "Concluido" as Status, size: "780 KB" },
  { name: "Comprovante Cloud Prime.pdf", category: "Comprovantes", client: "WAYNE", date: "21/05/2026", owner: "Rafael Martins", status: "Arquivado" as Status, size: "120 KB" }
];

export const tasks = [
  { title: "Verificar contas do dia", owner: "Rafael Martins", due: "Hoje, 09:00", priority: "Alta" as Priority, status: "Em andamento" as Status, group: "Financeiras", note: "Conferir saldos bancarios e vencimentos." },
  { title: "Conferir comprovantes", owner: "Rafael Martins", due: "Hoje, 11:30", priority: "Normal" as Priority, status: "Pendente" as Status, group: "Documentos faltantes", note: "Vincular documentos as baixas." },
  { title: "Realizar cobranca Atlas Log", owner: "Luciana Wayne", due: "Hoje, 14:00", priority: "Critica" as Priority, status: "Urgente" as Status, group: "Cobrancas", note: "Contato com diretoria financeira." },
  { title: "Conferir impostos", owner: "Beatriz Lima", due: "Hoje, 15:30", priority: "Alta" as Priority, status: "Pendente" as Status, group: "Impostos", note: "Validar guias antes do pagamento." },
  { title: "Fechamento operacional", owner: "Luciana Wayne", due: "Hoje, 18:00", priority: "Normal" as Priority, status: "Pendente" as Status, group: "Tarefas atrasadas", note: "Emitir dossie operacional diario." }
];

export const protocols = [
  { number: "#2026-0003", action: "Solicitacao de renovacao de certificado", owner: "Rafael Martins", date: "25/05/2026 10:18", client: "Atlas Log", note: "Aguardando assinatura digital." },
  { number: "#2026-0002", action: "Recepcao de comprovante tributario", owner: "Rafael Martins", date: "24/05/2026 16:42", client: "Aurora Tech", note: "Documento conferido e arquivado." },
  { number: "#2026-0001", action: "Abertura de cobranca de honorarios", owner: "Luciana Wayne", date: "23/05/2026 09:07", client: "Atlas Log", note: "Notificacao por e-mail e WhatsApp." }
];

export const cashSeries = [
  { month: "Dez", in: 74000, out: 51900 },
  { month: "Jan", in: 79200, out: 55300 },
  { month: "Fev", in: 76200, out: 49800 },
  { month: "Mar", in: 87400, out: 58200 },
  { month: "Abr", in: 91200, out: 61400 },
  { month: "Mai", in: 105650, out: 71690 }
];

