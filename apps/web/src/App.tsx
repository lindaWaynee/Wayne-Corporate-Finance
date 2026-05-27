import { FormEvent, useMemo, useState, type ComponentType } from "react";
import {
  Bell, BookCheck, BriefcaseBusiness, CalendarDays, ChartColumn, CheckCircle2, ChevronRight,
  ClipboardCheck, Clock3, CreditCard, Download, FileArchive, FileText, Filter, Landmark,
  LayoutDashboard, LogOut, Menu, Plus, ReceiptText, Search, Settings, ShieldCheck, TrendingUp,
  TriangleAlert, Upload, Users, Wallet, X
} from "lucide-react";
import { cashSeries, clients, documents, protocols, tasks, transactions, type Status } from "./data";

type Page = {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
};

const navigation: Page[] = [
  { key: "dashboard", label: "Dashboard Executivo", icon: LayoutDashboard },
  { key: "agenda", label: "Agenda Operacional", icon: CalendarDays },
  { key: "clientes", label: "Clientes", icon: Users },
  { key: "financeiro", label: "Financeiro", icon: Wallet },
  { key: "pagar", label: "Contas a Pagar", icon: CreditCard },
  { key: "receber", label: "Contas a Receber", icon: Landmark },
  { key: "fluxo", label: "Fluxo de Caixa", icon: TrendingUp },
  { key: "despesas", label: "Despesas Operacionais", icon: ReceiptText },
  { key: "honorarios", label: "Honorarios", icon: BriefcaseBusiness },
  { key: "pendencias", label: "Pendencias", icon: TriangleAlert },
  { key: "documentos", label: "Documentos", icon: FileArchive },
  { key: "relatorios", label: "Relatorios", icon: ChartColumn },
  { key: "impostos", label: "Impostos", icon: FileText },
  { key: "checklist", label: "Checklist Diario", icon: ClipboardCheck },
  { key: "protocolos", label: "Protocolos", icon: BookCheck },
  { key: "config", label: "Configuracoes", icon: Settings }
];

const brl = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function StatusBadge({ status }: { status: Status | string }) {
  const map: Record<string, string> = {
    Concluido: "completed", Ativo: "completed", Pendente: "pending",
    Urgente: "urgent", Inadimplente: "urgent", "Em andamento": "progress", Arquivado: "archived"
  };
  return <span className={`status ${map[status] ?? "progress"}`}><span />{status}</span>;
}

function Login({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      await onLogin(String(form.get("email")), String(form.get("password")));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Nao foi possivel autenticar.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      <section className="login-brand">
        <div className="brand-mark">W</div>
        <p className="eyebrow">BPO FINANCIAL OPERATIONS</p>
        <h1>WAYNE<br />CORPORATE<br /><span>FINANCE</span></h1>
        <p className="brand-description">Central administrativa, documental e financeira com rastreabilidade executiva completa.</p>
        <div className="trust-items">
          <span><ShieldCheck size={18} /> Auditoria interna ativa</span>
          <span><CheckCircle2 size={18} /> Ambiente multiusuario protegido</span>
        </div>
      </section>
      <form className="login-card" onSubmit={submit}>
        <p className="eyebrow gold">ACESSO CORPORATIVO</p>
        <h2>Bem-vindo ao ERP</h2>
        <p className="subtle">Identifique-se para acessar a operacao financeira.</p>
        <label>E-mail corporativo<input name="email" type="email" defaultValue="diretoria@waynefinance.com.br" required /></label>
        <label>Senha
          <div className="password"><input name="password" type={visible ? "text" : "password"} defaultValue="Wayne@2026" required /><button type="button" onClick={() => setVisible(!visible)}>{visible ? "Ocultar" : "Exibir"}</button></div>
        </label>
        <div className="login-row"><label className="remember"><input type="checkbox" defaultChecked /> Manter sessao</label><a>Recuperar senha</a></div>
        {error && <p className="login-error">{error}</p>}
        <button className="primary full" type="submit" disabled={loading}>{loading ? "Autenticando..." : "Entrar com seguranca"} <ChevronRight size={17} /></button>
        <p className="security-note"><ShieldCheck size={15} /> Autenticacao JWT e logs de acesso habilitados</p>
      </form>
    </div>
  );
}

function Sidebar({ active, choose, open }: { active: string; choose: (page: string) => void; open: boolean }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-brand"><div className="brand-mark small">W</div><div><strong>WAYNE</strong><small>CORPORATE FINANCE</small></div></div>
      <div className="workspace"><small>AMBIENTE</small><strong>Operacao Matriz</strong><span>Producao Segura</span></div>
      <nav>
        {navigation.map((item) => {
          const Icon = item.icon;
          return <button key={item.key} className={active === item.key ? "active" : ""} onClick={() => choose(item.key)}><Icon size={18} />{item.label}</button>;
        })}
      </nav>
      <div className="sidebar-footer"><ShieldCheck size={17} /><div><strong>Backup ativo</strong><small>Ultimo: hoje 04:00</small></div></div>
    </aside>
  );
}

function Header({ page, search, setSearch, openMenu, logout }: { page: Page; search: string; setSearch: (v: string) => void; openMenu: () => void; logout: () => void }) {
  return (
    <header className="header">
      <button className="menu-toggle" aria-label="Abrir menu principal" onClick={openMenu}><Menu size={22} /></button>
      <div className="heading"><p className="eyebrow">CENTRAL OPERACIONAL</p><h2>{page.label}</h2></div>
      <label className="global-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar cliente, documento ou protocolo" /></label>
      <div className="header-actions">
        <button className="notification" aria-label="4 notificacoes pendentes"><Bell size={19} /><span>4</span></button>
        <div className="profile"><strong>Luciana Wayne</strong><small>Diretoria</small></div>
        <button className="logout" aria-label="Sair do sistema" onClick={logout}><LogOut size={18} /></button>
      </div>
    </header>
  );
}

function PageTitle({ title, description, actions }: { title: string; description: string; actions?: boolean }) {
  return (
    <div className="page-title">
      <div><h1>{title}</h1><p>{description}</p></div>
      {actions && <div className="actions"><button className="secondary"><Download size={16} /> Exportar</button><button className="primary"><Plus size={16} /> Novo registro</button></div>}
    </div>
  );
}

function Metric({ label, value, detail, tone = "default" }: { label: string; value: string; detail: string; tone?: string }) {
  return <article className={`metric ${tone}`}><small>{label}</small><strong>{value}</strong><p>{detail}</p></article>;
}

function CashChart() {
  const max = Math.max(...cashSeries.flatMap((row) => [row.in, row.out]));
  return (
    <section className="panel chart-panel">
      <div className="panel-heading"><div><h3>Entradas e saidas</h3><p>Fluxo financeiro consolidado - ultimos 6 meses</p></div><div className="legend"><span className="gold-dot" /> Entradas <span className="gray-dot" /> Saidas</div></div>
      <div className="bars">
        {cashSeries.map((row) => <div className="bar-group" key={row.month}><div><span className="bar incoming" style={{ height: `${(row.in / max) * 160}px` }} /><span className="bar outgoing" style={{ height: `${(row.out / max) * 160}px` }} /></div><small>{row.month}</small></div>)}
      </div>
    </section>
  );
}

function Dashboard({ query }: { query: string }) {
  const visibleTasks = tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()) || !query);
  return (
    <>
      <PageTitle title="Visao Executiva" description="Monitoramento integral da operacao financeira - Maio de 2026" actions />
      <div className="metrics-grid">
        <Metric label="Faturamento mensal" value="R$ 105.650,00" detail="+12,4% vs. abril" tone="gold" />
        <Metric label="Fluxo de caixa previsto" value="R$ 33.960,00" detail="Margem operacional 32,1%" />
        <Metric label="Saldo atual" value="R$ 184.720,35" detail="4 contas conciliadas" />
        <Metric label="Contas vencendo" value="12" detail="3 urgentes hoje" tone="warning" />
        <Metric label="Despesas do mes" value="R$ 71.690,00" detail="67,8% do previsto" />
        <Metric label="Clientes ativos" value="46" detail="1 inadimplente" tone="alert" />
        <Metric label="Pendencias operacionais" value="09" detail="2 criticas" tone="warning" />
        <Metric label="Tarefas do dia" value="24 / 31" detail="77% concluidas" />
      </div>
      <div className="dashboard-columns">
        <CashChart />
        <section className="panel categories">
          <div className="panel-heading"><div><h3>Despesas por categoria</h3><p>Distribuicao mensal</p></div></div>
          {[["Folha de Pagamento", 42, "R$ 28.900"], ["Impostos", 23, "R$ 15.870"], ["Assinaturas", 16, "R$ 11.280"], ["Infraestrutura", 12, "R$ 8.640"], ["Outras", 7, "R$ 7.000"]].map(([name, percent, amount]) => <div className="progress-row" key={name as string}><div><span>{name}</span><strong>{amount}</strong></div><div className="progress"><span style={{ width: `${percent}%` }} /></div></div>)}
        </section>
      </div>
      <div className="lower-grid">
        <section className="panel">
          <div className="panel-heading"><h3>Agenda financeira e notificacoes</h3><button className="text-action">Ver agenda</button></div>
          <div className="agenda">
            {transactions.filter((item) => item.status !== "Concluido").slice(0, 4).map((item) => <div key={item.id}><Clock3 size={17} /><section><strong>{item.description}</strong><small>{item.dueDate} | {brl(item.amount)}</small></section><StatusBadge status={item.status} /></div>)}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading"><h3>Tarefas do dia</h3><span className="count">{visibleTasks.length} abertas</span></div>
          <div className="task-list">
            {visibleTasks.map((task) => <div key={task.title}><StatusBadge status={task.status} /><section><strong>{task.title}</strong><small>{task.owner} | {task.due}</small></section></div>)}
          </div>
        </section>
      </div>
    </>
  );
}

function Filters({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return (
    <div className="filters">
      <label><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisa rapida..." /></label>
      <button><Filter size={16} /> Status: Todos</button>
      <button>Periodo: Maio/2026</button>
      <button>Prioridade: Todas</button>
      <button>Responsavel: Todos</button>
    </div>
  );
}

const payableTabs = ["Despesas Fixas", "Despesas Variaveis", "Impostos", "Fornecedores", "Assinaturas", "Parcelamentos", "Folha de Pagamento", "Emergenciais", "Agendados", "Pendentes", "Concluidos", "Urgentes"];
const receivableTabs = ["Recebimentos Pendentes", "Recebimentos Concluidos", "Honorarios", "Clientes Inadimplentes", "Cobrancas", "Pagamentos Recorrentes", "Previsoes"];

function TransactionsModule({ type, title, query }: { type: "Pagar" | "Receber"; title: string; query: string }) {
  const [tab, setTab] = useState(type === "Pagar" ? payableTabs[0] : receivableTabs[0]);
  const [localSearch, setLocalSearch] = useState(query);
  const filter = (localSearch || query).toLowerCase();
  const records = transactions.filter((item) => item.type === type && (!filter || `${item.description} ${item.party} ${item.category}`.toLowerCase().includes(filter)));
  const total = records.reduce((sum, item) => sum + item.amount, 0);
  return (
    <>
      <PageTitle title={title} description={`${type === "Pagar" ? "Controle minucioso de obrigacoes, fornecedores e comprovantes" : "Gestao de cobrancas, honorarios e previsoes de entrada"}`} actions />
      <div className="mini-metrics">
        <Metric label={`Total a ${type.toLowerCase()}`} value={brl(total)} detail={`${records.length} lancamentos localizados`} tone="gold" />
        <Metric label="Urgente" value={brl(records.filter((item) => item.status === "Urgente").reduce((v, item) => v + item.amount, 0))} detail="Exige tratativa imediata" tone="alert" />
        <Metric label="Concluido" value={brl(records.filter((item) => item.status === "Concluido").reduce((v, item) => v + item.amount, 0))} detail="Com comprovacao vinculada" />
      </div>
      <section className="panel records">
        <div className="tabs">{(type === "Pagar" ? payableTabs : receivableTabs).map((item) => <button className={tab === item ? "selected" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
        <Filters search={localSearch} setSearch={setLocalSearch} />
        <div className="table-scroll">
          <table>
            <thead><tr><th>Descricao / codigo</th><th>Categoria</th><th>{type === "Pagar" ? "Fornecedor" : "Cliente"}</th><th>Vencimento</th><th>Valor</th><th>Prioridade</th><th>Status</th><th>Anexos</th></tr></thead>
            <tbody>{records.map((row) => <tr key={row.id}><td><strong>{row.description}</strong><small>{row.id} | {row.recurrence}</small></td><td>{row.category}</td><td>{row.party}</td><td>{row.dueDate}</td><td className="money">{brl(row.amount)}</td><td>{row.priority}</td><td><StatusBadge status={row.status} /></td><td><button className="file">{row.attachment}</button></td></tr>)}</tbody>
          </table>
        </div>
        <div className="detail-strip"><strong>Registro selecionavel:</strong> comprovantes PDF, observacoes internas, recorrencia e historico integral de alteracoes estao vinculados a cada lancamento.</div>
      </section>
    </>
  );
}

function Clients({ query }: { query: string }) {
  const [tab, setTab] = useState("Clientes Ativos");
  const [localSearch, setLocalSearch] = useState("");
  const filter = (localSearch || query).toLowerCase();
  const rows = clients.filter((client) => !filter || `${client.name} ${client.cnpj} ${client.accountant}`.toLowerCase().includes(filter));
  return (
    <>
      <PageTitle title="Cadastro de Clientes" description="Dossies financeiros, contratos, certificados digitais e historico de relacionamento" actions />
      <section className="panel records">
        <div className="tabs">{["Clientes Ativos", "Clientes Inadimplentes", "Contratos", "Documentacao", "Certificados Digitais", "Relatorios", "Historico", "Pendencias"].map((value) => <button key={value} className={tab === value ? "selected" : ""} onClick={() => setTab(value)}>{value}</button>)}</div>
        <Filters search={localSearch} setSearch={setLocalSearch} />
        <div className="client-grid">{rows.map((client) => <article className="client" key={client.cnpj}><div className="client-top"><div className="avatar">{client.brand.slice(0, 2)}</div><div><h3>{client.brand}</h3><p>{client.name}</p></div><StatusBadge status={client.status} /></div><dl><dt>CNPJ</dt><dd>{client.cnpj}</dd><dt>Responsavel</dt><dd>{client.accountant}</dd><dt>Regime tributario</dt><dd>{client.regime}</dd><dt>Honorario</dt><dd>{brl(client.fee)}</dd><dt>Certificado</dt><dd>{client.certificate}</dd><dt>Documentos</dt><dd>{client.docs} arquivos</dd></dl><p className="note">{client.note}</p><div className="client-actions"><button>Dossie</button><button>Contratos PDF</button><button>Historico</button></div></article>)}</div>
      </section>
    </>
  );
}

function Documents({ query }: { query: string }) {
  const [tab, setTab] = useState("Todos");
  const categories = ["Todos", "Notas Fiscais", "Contratos", "Boletos", "Comprovantes", "Impostos", "Relatorios", "PDFs", "Extratos", "Procuracoes", "Certificados"];
  const filtered = documents.filter((doc) => (!query || `${doc.name} ${doc.client}`.toLowerCase().includes(query.toLowerCase())) && (tab === "Todos" || doc.category === tab));
  return (
    <>
      <PageTitle title="Central Documental" description="Arquivo estruturado, visualizacao rapida e rastreabilidade de documentos corporativos" />
      <section className="upload"><Upload size={23} /><div><strong>Upload seguro de documentos</strong><p>Arraste PDFs, comprovantes, extratos ou certificados para catalogacao automatica.</p></div><button className="primary">Selecionar arquivos</button></section>
      <section className="panel records">
        <div className="tabs">{categories.map((category) => <button className={tab === category ? "selected" : ""} onClick={() => setTab(category)} key={category}>{category}</button>)}</div>
        <div className="document-grid">{filtered.map((doc) => <article key={doc.name}><FileText size={29} /><StatusBadge status={doc.status} /><h3>{doc.name}</h3><p>{doc.category} | {doc.client}</p><small>{doc.date} - {doc.size} - {doc.owner}</small><div><button>Visualizar</button><button><Download size={14} /> Download</button></div></article>)}</div>
      </section>
    </>
  );
}

function TaskCenter({ pending = false }: { pending?: boolean }) {
  const [done, setDone] = useState<string[]>([]);
  const groups = pending ? ["Financeiras", "Clientes", "Documentos faltantes", "Impostos", "Contratos", "Cobrancas", "Tarefas atrasadas"] : ["Todas", "Financeiro", "Documentos", "Relatorios", "Fechamento"];
  return (
    <>
      <PageTitle title={pending ? "Pendencias Administrativas" : "Checklist Diario"} description={pending ? "Tratativas criticas, atrasos e documentos aguardando regularizacao" : "Rotina operacional auditavel - 25 de maio de 2026"} actions />
      <section className="panel records">
        <div className="tabs">{groups.map((group, index) => <button key={group} className={index === 0 ? "selected" : ""}>{group}</button>)}</div>
        <div className="checklist">
          {tasks.map((task) => {
            const checked = done.includes(task.title);
            return <article key={task.title}><button className={`checkbox ${checked ? "checked" : ""}`} onClick={() => setDone(checked ? done.filter((entry) => entry !== task.title) : [...done, task.title])}><CheckCircle2 size={20} /></button><div><h3>{task.title}</h3><p>{task.note}</p><small>{task.group} | Responsavel: {task.owner} | Prazo: {task.due}</small></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><StatusBadge status={checked ? "Concluido" : task.status} /><button className="secondary compact">Anexos / Historico</button></article>;
          })}
        </div>
      </section>
    </>
  );
}

function Protocols() {
  return (
    <>
      <PageTitle title="Protocolos Internos" description="Registro inviolavel de acoes, responsaveis, datas e clientes envolvidos" actions />
      <section className="panel protocol-panel">
        {protocols.map((entry) => <article key={entry.number}><div className="protocol-number">{entry.number}</div><div><strong>{entry.action}</strong><p>{entry.client} | {entry.owner} | {entry.date}</p><small>{entry.note}</small></div><button className="secondary">Abrir protocolo</button></article>)}
      </section>
    </>
  );
}

function Reports() {
  const reports = ["Fluxo de caixa", "Despesas operacionais", "Receitas e honorarios", "Carteira de clientes", "Inadimplencia", "Fechamento mensal", "Relatorio financeiro executivo"];
  const exportCsv = () => {
    const content = ["Relatorio,Competencia,Status", ...reports.map((name) => `${name},Maio/2026,Disponivel`)].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
    link.download = "wayne-relatorios-maio-2026.csv";
    link.click();
  };
  return (
    <>
      <PageTitle title="Relatorios Gerenciais" description="Analises financeiras e fechamento mensal prontos para distribuicao executiva" />
      <div className="report-grid">{reports.map((report, index) => <article className="panel report" key={report}><ChartColumn size={26} /><div><h3>{report}</h3><p>Competencia: Maio/2026</p><small>Atualizado hoje, {9 + index}:20</small></div><div><button className="secondary" onClick={exportCsv}>Excel</button><button className="primary">PDF</button></div></article>)}</div>
    </>
  );
}
function SettingsPage() {
  return (
    <>
      <PageTitle
        title="Seguranca e Configuracoes"
        description="Governanca da plataforma, acessos, integracoes e continuidade operacional"
      />

      <div className="settings-grid">
        {[
          [
            "Usuarios e permissoes",
            "5 usuarios ativos | Perfis: Diretoria, Gestao, Analista, Auditoria"
          ],
          [
            "Autenticacao JWT",
            "Sessoes protegidas por token com expiracao de 8 horas"
          ],
          [
            "Auditoria interna",
            "128 eventos registrados neste mes | Exportacao disponivel"
          ],
          [
            "Backup automatico",
            "Ultimo backup: 25/05/2026 04:00 | Retencao: 90 dias"
          ],
          [
            "Integracoes bancarias",
            "2 contas conciliadas | Sincronizacao agendada"
          ],
          [
            "Notificacoes",
            "Alertas de vencimento, inadimplencia e certificados habilitados"
          ]
        ].map(([title, description]) => (
          <article className="panel setting" key={title}>
            <ShieldCheck size={25} />
            <h3>{title}</h3>
            <p>{description}</p>
            <button className="secondary">Administrar</button>
          </article>
        ))}
      </div>
    </>
  );
}

function GenericFinance({ title, description, kind }: { title: string; description: string; kind?: "Pagar" | "Receber" }) {
  const rows = kind ? transactions.filter((item) => item.type === kind) : transactions;
  return (
    <>
      <PageTitle title={title} description={description} actions />
      <CashChart />
      <section className="panel simple-list">{rows.slice(0, 6).map((row) => <div key={row.id}><span><strong>{row.description}</strong><small>{row.category} | {row.dueDate}</small></span><b>{brl(row.amount)}</b><StatusBadge status={row.status} /></div>)}</section>
    </>
  );
}

function Content({ active, query }: { active: string; query: string }) {
  switch (active) {
    case "dashboard": return <Dashboard query={query} />;
    case "clientes": return <Clients query={query} />;
    case "pagar": return <TransactionsModule type="Pagar" title="Contas a Pagar" query={query} />;
    case "receber": return <TransactionsModule type="Receber" title="Contas a Receber" query={query} />;
    case "documentos": return <Documents query={query} />;
    case "checklist": return <TaskCenter />;
    case "pendencias": return <TaskCenter pending />;
    case "protocolos": return <Protocols />;
    case "relatorios": return <Reports />;
    case "fluxo": return <GenericFinance title="Fluxo de Caixa" description="Entradas, saidas, saldos projetados e conciliacao mensal" />;
    case "despesas": return <TransactionsModule type="Pagar" title="Despesas Operacionais" query={query} />;
    case "honorarios": return <TransactionsModule type="Receber" title="Honorarios" query={query} />;
    case "impostos": return <GenericFinance title="Gestao de Impostos" description="Guias, apuracoes, vencimentos e comprovantes fiscais" kind="Pagar" />;
    case "financeiro": return <GenericFinance title="Controle Financeiro" description="Consolidacao administrativa de recebimentos, despesas e saldo operacional" />;
    case "agenda": return <TaskCenter />;
    case "config": return <SettingsPage />;
    default: return <Dashboard query={query} />;
  }
}
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(false);

  const [authenticated, setAuthenticated] = useState(
    !!sessionStorage.getItem("wayne_token")
  );

  const currentPage =
    navigation.find((item) => item.key === active) ?? navigation[0];

  const login = async (email: string, password: string) => {
    const response = await fetch(
      "https://wayneapi-production.up.railway.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    );

    if (!response.ok) {
      const failure = await response.json().catch(() => ({
        message: "Acesso negado."
      }));

      throw new Error(failure.message ?? "Acesso negado.");
    }

    const session = await response.json();

    sessionStorage.setItem("wayne_token", session.token);

    setAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem("wayne_token");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={login} />;
  }

  const selectPage = (page: string) => {
    setActive(page);
    setMenu(false);
  };

  return (
    <div className="app-shell">
      <Sidebar active={active} choose={selectPage} open={menu} />

      {menu && (
        <button
          className="overlay"
          aria-label="Fechar menu principal"
          onClick={() => setMenu(false)}
        >
          <X />
        </button>
      )}

      <div className="workarea">
        <Header
          page={currentPage}
          search={search}
          setSearch={setSearch}
          openMenu={() => setMenu(true)}
          logout={logout}
        />

        <main>
          <Content active={active} query={search} />
        </main>
      </div>
    </div>
  );
}