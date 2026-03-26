// =============================================================
// RISE – PORTAL INTERNO
// Google Apps Script · Code.gs
// =============================================================
var CONFIG = {
  TICKETS_SHEET_ID: "1HAbfB0Ol_3nqfIzq0vdrMSqZcUP20pK0O9e09gXrA6w",
  COMUNICADOS_SHEET_ID: "1G3GCsdMkdOFIPzFCxYgZqeCAFSW5e4jkrEpZTPzXxXE",
  FROTA_SHEET_ID: "1G3GCsdMkdOFIPzFCxYgZqeCAFSW5e4jkrEpZTPzXxXE",
  ALERTAS_SHEET_ID: "1lkhzZfbuIR2fwifcOFb7ekbXwx4SOrWzYr_yH7bNdrA",
  UTILIZADORES_SHEET_ID: "1ved9K4fdfBDh6VjQ_t4CyWJl5bUT8X54LXjbRk9tDJw",
  RESTAURANTES_SHEET_ID: "1fzRLqdgUmQhnViAmOwA0yXYKwyA5P10sBGcjxboFE3M",
  FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLScrZJtY3Z4wsFhCoJNYoFK-9g5UdsNj0RMq8lkj3wHA8Q01TQ/viewform",
  CAL_FERIAS_EMBED: "https://calendar.google.com/calendar/embed?src=c_c7fe74dbb8130415320dc2a8a03f609f908dc54ad2f6e3933fb054a7f994a98e%40group.calendar.google.com&ctz=Europe%2FLisbon&mode=AGENDA&showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0",
  CAL_TRABALHOS_EMBED: "https://calendar.google.com/calendar/embed?src=l0b3fuhm3vma069hkf8eot9qnikcfg7c%40import.calendar.google.com&ctz=Europe%2FLisbon&mode=AGENDA&showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0",
  ADMIN_EMAIL: "bruno.domingos@rise.pt",
  WEBAPP_URL: "https://script.google.com/a/macros/rise.pt/s/AKfycbyOwEGKYxHJ7GWlyizMlQMtVwEuDp9ZWjjEy3oyiolHa9viggRIvnmqGE0TVAof_yZ2CA/exec",
  GESTAO_SHEET_ID: "1LBaQ5BrsTJ3Wr1X8LTJzOMYul19edIsRMT77oKIALFU",

};


var NOME_ABA_PROJETOS = "PROJETOS";

var FLEX_TOKEN = 'VrtQA9V5saiCjV3wcfh5BwNllIDwv6GDECuF';

// IDs dos 3 calendários para o módulo Calendário
var CAL_IDS = {
  crew: 'l0b3fuhm3vma069hkf8eot9qnikcfg7c@import.calendar.google.com',
  reunioes: 'c_1671eba6cbd3ee7467954d579e17b4b481b9286c1cc8e85579d5a46088f8f054@group.calendar.google.com',
  ferias: 'c_c7fe74dbb8130415320dc2a8a03f609f908dc54ad2f6e3933fb054a7f994a98e@group.calendar.google.com'
};

// =============================================================
// COMUNICADOS — CONFIGURAÇÃO DE EMAIL
// =============================================================
var CFG = {
  SHEET_ID: "1G3GCsdMkdOFIPzFCxYgZqeCAFSW5e4jkrEpZTPzXxXE",
  DESTINATARIOS: [
    "bruno.domingos@rise.pt",
    // adiciona aqui os restantes colaboradores
  ],
  PORTAL_URL: "https://script.google.com/a/macros/rise.pt/s/AKfycbyOwEGKYxHJ7GWlyizMlQMtVwEuDp9ZWjjEy3oyiolHa9viggRIvnmqGE0TVAof_yZ2CA/exec?page=comunicados",
  REMETENTE_NOME: "RISE – Portal Interno",
};

var CORES_TIPO = {
  "Urgente": { fundo: "#d92b22", texto: "#ffffff" },
  "Informação": { fundo: "#3b82f6", texto: "#ffffff" },
  "Lembrete": { fundo: "#e0a500", texto: "#000000" },
  "RH": { fundo: "#10b981", texto: "#ffffff" },
  "Planeamento": { fundo: "#6366f1", texto: "#ffffff" },
};

var ASSINATURA = '<table style="font-family:Arial,sans-serif;font-size:12px;color:#aaaaaa;margin-top:8px;border-collapse:collapse;">'
  + '<tr><td style="padding-bottom:6px;">'
  + '<span style="font-weight:700;font-size:13px;color:#f5f5f5;letter-spacing:0.03em;">Departamento de Planeamento</span><br>'
  + '<span style="font-size:11px;color:#666;letter-spacing:0.05em;text-transform:uppercase;">RISE · a Europalco company</span>'
  + '</td></tr>'
  + '<tr><td style="padding:12px 0 8px;"><div style="height:1px;background:#2a2a2a;width:200px;"></div></td></tr>'
  + '<tr><td style="font-size:10px;color:#444;line-height:1.6;max-width:480px;">'
  + 'IMPORTANT: This e-mail is confidential and may be privileged. It may be read, copied and used only by the intended recipient. '
  + 'If you have received it in error, please contact the sender immediately. Save our resources. Print this email only if necessary.'
  + '</td></tr></table>';

// =============================================================
// ENVIAR EMAIL DO COMUNICADO
// =============================================================
function enviarEmailComunicado(com) {
  var cor = CORES_TIPO[com.tipo] || { fundo: "#d92b22", texto: "#ffffff" };

  var dataObj;
  if (!com.data || com.data === "" || com.data === 0) {
    dataObj = new Date();
  } else if (com.data instanceof Date) {
    dataObj = com.data;
  } else {
    dataObj = new Date(com.data);
    if (isNaN(dataObj.getTime()) || dataObj.getFullYear() < 2000) dataObj = new Date();
  }

  var mesesPT = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var dataFormatada = dataObj.getDate() + " de " + mesesPT[dataObj.getMonth()] + " de " + dataObj.getFullYear();

  var assunto = "[RISE] " + com.tipo.toUpperCase() + ": " + com.titulo;

  var corpo =
    '<div style="font-family:\'DM Sans\',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f4f2;">'

    // NAV
    + '<div style="background:#0a0a0a;padding:16px 32px;border-bottom:3px solid #d92b22;display:block;">'
    + '<span style="font-family:Arial,sans-serif;font-weight:800;font-size:15px;color:#ffffff;letter-spacing:.01em;">R<span style="color:#d92b22;">/</span>SE</span>'
    + '&nbsp;&nbsp;<span style="font-size:10px;font-weight:600;color:rgba(255,255,255,.35);letter-spacing:.14em;text-transform:uppercase;">PORTAL INTERNO</span>'
    + '</div>'

    // PAGE HEADER
    + '<div style="background:#f5f4f2;padding:20px 32px;border-bottom:1px solid #e2e0dd;">'
    + '<div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#9e9e9e;margin-bottom:4px;">Comunicado Interno</div>'
    + '<div style="font-size:22px;font-weight:800;color:#0a0a0a;letter-spacing:-.03em;line-height:1.1;">' + com.titulo + '</div>'
    + '</div>'

    // CARD
    + '<div style="background:#ffffff;margin:20px 24px;border:1px solid #e2e0dd;border-left:3px solid ' + cor.fundo + ';border-radius:0 10px 10px 0;padding:20px 24px;">'

    // Badge tipo
    + '<div style="margin-bottom:14px;">'
    + '<span style="background:' + cor.fundo + ';color:' + cor.texto + ';font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:3px 10px;border-radius:20px;">' + com.tipo + '</span>'
    + '</div>'

    // Descrição
    + '<div style="font-size:14px;color:#1a1a1a;line-height:1.7;margin-bottom:20px;">' + (com.descricao || '').replace(/\n/g, '<br>') + '</div>'

    // Meta
    + '<div style="border-top:1px solid #e2e0dd;padding-top:14px;margin-top:16px;">'
    + '<div style="margin-bottom:10px;">'
    + '<div style="font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#9e9e9e;margin-bottom:3px;">Publicado por</div>'
    + '<div style="font-size:12px;color:#1a1a1a;font-weight:500;">Departamento de Planeamento</div>'
    + '</div>'
    + '<div>'
    + '<div style="font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#9e9e9e;margin-bottom:3px;">Data</div>'
    + '<div style="font-size:12px;color:#1a1a1a;">' + dataFormatada + '</div>'
    + '</div>'
    + '</div>'

    // CTA
    + '<div style="padding:8px 24px 24px;">'
    + '<a href="' + CFG.PORTAL_URL + '" style="display:inline-block;background:#d92b22;color:#ffffff;font-size:12px;font-weight:700;padding:10px 20px;border-radius:7px;text-decoration:none;letter-spacing:.02em;">Ver no Portal →</a>'
    + '</div>'

    // FOOTER
    + '<div style="background:#f5f4f2;padding:14px 32px;border-top:1px solid #e2e0dd;">'
    + '<div style="font-size:11px;color:#6b6b6b;">Este é um email automático do Portal Interno RISE. Por favor não respondas a este email.</div>'
    + '<div style="font-size:10px;color:#9e9e9e;margin-top:4px;">© 2026 RISE · a Europalco company · Departamento de Planeamento</div>'
    + '</div>'

    + '</div>';

  GmailApp.sendEmail(
    CFG.DESTINATARIOS.join(","),
    assunto,
    "Novo comunicado: " + com.titulo + ". Ver em: " + CFG.PORTAL_URL,
    { htmlBody: corpo, name: CFG.REMETENTE_NOME }
  );

  Logger.log("Email enviado para: " + CFG.DESTINATARIOS.join(", "));
}


// =============================================================
// PERMISSÕES POR ROLE
// =============================================================
var PERMISSOES = {
  admin: {
    paginas: ["index", "tickets", "calendario", "comunicados",
      "restaurantes", "fotos", "frota", "alertas", "rh", "verProjetos", "criarProjeto", "editarProjeto"],
    podeEscrever: true, podeCriarComunicados: true,
    podeVerTodosTickets: true, podeGerirUtilizadores: true, podeGerirCalendario: true,
  },
  gestor: {
    paginas: ["index", "tickets", "calendario", "comunicados",
      "restaurantes", "fotos", "frota", "alertas", "rh", "verProjetos", "editarProjeto"],
    podeEscrever: true, podeCriarComunicados: true,
    podeVerTodosTickets: true, podeGerirUtilizadores: false, podeGerirCalendario: true,
  },
  utilizador: {
    paginas: ["index", "tickets", "calendario", "comunicados",
      "restaurantes", "fotos", "frota", "alertas", "rh", "verProjetos", "editarProjeto"],
    podeEscrever: false, podeCriarComunicados: false,
    podeVerTodosTickets: true, podeGerirUtilizadores: false, podeGerirCalendario: false,
  },
};

// =============================================================
// SESSÃO
// =============================================================
function getSessao() {
  var email = "";
  try { email = Session.getActiveUser().getEmail(); } catch (e) { }
  Logger.log("Email detetado: '" + email + "'");
  if (!email) return null;
  email = email.toLowerCase().trim();
  var utilizador = encontrarUtilizador(email);
  if (!utilizador) {
    salvarUtilizador({ email: email, nome: email.split("@")[0], role: "utilizador" });
    return { email: email, nome: email.split("@")[0], role: "utilizador" };
  }
  return { email: utilizador.email, nome: utilizador.nome, role: utilizador.role };
}

// =============================================================
// ROUTER — doGet
// =============================================================
function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : "index";
  var sessao = getSessao();
  if (!sessao) return renderPage("acesso_negado", { sessao: null }, "");
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (perms.paginas.indexOf(page) === -1) return renderPage("acesso_negado", { sessao: sessao, perms: perms }, "");
  return renderPage(page, { sessao: sessao, perms: perms, params: e.parameter }, "");
}

// =============================================================
// RENDER PAGE
// =============================================================
function renderPage(page, extraDados, _unused) {
  var validPages = ["index", "tickets", "calendario", "comunicados", "tarefas",
    "operacoes", "restaurantes", "fotos", "eventos", "frota",
    "alertas", "rh", "acesso_negado", "verProjetos", "criarProjeto", "editarProjeto"];
  if (validPages.indexOf(page) === -1) page = "index";

  var template = HtmlService.createTemplateFromFile(page);
  var dados = getDadosDinamicos(page, extraDados.sessao || null, extraDados.params || {});
  Object.keys(extraDados).forEach(function (k) {
    if (k !== 'eventos') dados[k] = extraDados[k];
  });

  template.dados = dados;
  template.webappUrl = CONFIG.WEBAPP_URL;
  template.formUrl = CONFIG.FORM_URL;
  template.calFerias = CONFIG.CAL_FERIAS_EMBED;
  template.calTrab = CONFIG.CAL_TRABALHOS_EMBED;
  template.token = "";


  return template.evaluate()
    .setTitle("RISE – Portal Interno")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0");
}

// =============================================================
// API JSON
// =============================================================
function getSessaoCliente() {
  var sessao = getSessao();
  if (!sessao) return { erro: "Não autenticado." };
  return { ok: true, email: sessao.email, nome: sessao.nome, role: sessao.role, perms: PERMISSOES[sessao.role] || PERMISSOES["utilizador"] };
}

function getTicketsCliente() {
  var sessao = getSessao();
  if (!sessao) return { erro: "Não autenticado." };
  var d = getDadosDinamicos("tickets", sessao);
  return { tickets: d.tickets, stats: { total: d.totalTickets, emAnalise: d.emAnalise, pendentes: d.pendentes, resolvidos: d.resolvidos } };
}

function getComunicadosCliente() {
  var sessao = getSessao();
  if (!sessao) return { erro: "Não autenticado." };
  return { comunicados: getDadosDinamicos("index", sessao).comunicados };
}

function adicionarComunicado(dados) {
  var sessao = getSessao();
  if (!sessao) return { erro: "Não autenticado." };
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeCriarComunicados) return { erro: "Sem permissão." };
  try {
    var ss = SpreadsheetApp.openById(CONFIG.COMUNICADOS_SHEET_ID);
    var sh = ss.getSheetByName("Comunicados");
    var rows = sh.getDataRange().getValues();
    var maxNum = 0;
    for (var i = 1; i < rows.length; i++) {
      var existingId = rows[i][0].toString();
      if (existingId.startsWith("C")) {
        var num = parseInt(existingId.substring(1));
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    }
    var id = "C" + String(maxNum + 1).padStart(3, "0");
    var dataHoje = new Date();
    sh.appendRow([id, dados.tipo || "Informação", dados.titulo || "", dados.corpo || "",
      "Departamento de Planeamento",
      Utilities.formatDate(dataHoje, "Europe/Lisbon", "dd/MM/yyyy"),
      "Sim", "Sim", dataHoje]);

    // Enviar email
    try {
      enviarEmailComunicado({
        id: id,
        tipo: dados.tipo || "Informação",
        titulo: dados.titulo || "",
        descricao: dados.corpo || "",
        autor: sessao.nome || "Departamento de Planeamento",
        data: dataHoje,
      });
    } catch (emailErr) {
      Logger.log("Aviso: email não enviado — " + emailErr.message);
    }

    return { ok: true, id: id };
  } catch (err) { return { erro: err.message }; }
}

function getUtilizadoresCliente() {
  var sessao = getSessao();
  if (!sessao) return { erro: "Não autenticado." };
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeGerirUtilizadores) return { erro: "Sem permissão." };
  return { utilizadores: listarUtilizadores() };
}

function saveUtilizadorCliente(email, nome, role) {
  var sessao = getSessao();
  if (!sessao) return { erro: "Não autenticado." };
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeGerirUtilizadores) return { erro: "Sem permissão." };
  return salvarUtilizador({ email: email, nome: nome, role: role });
}

function deleteUtilizadorCliente(email) {
  var sessao = getSessao();
  if (!sessao) return { erro: "Não autenticado." };
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeGerirUtilizadores) return { erro: "Sem permissão." };
  return apagarUtilizador(email);
}

// =============================================================
// UTILIZADORES
// =============================================================
function getSheetUtilizadores() {
  return SpreadsheetApp.openById(CONFIG.UTILIZADORES_SHEET_ID).getSheetByName("Utilizadores");
}

function encontrarUtilizador(email) {
  try {
    var rows = getSheetUtilizadores().getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if ((rows[i][0] || "").toString().toLowerCase().trim() === email) {
        return { email: rows[i][0], nome: rows[i][1], role: rows[i][2] || "utilizador" };
      }
    }
  } catch (e) { Logger.log("Erro findUser: " + e.message); }
  return null;
}

function listarUtilizadores() {
  try {
    var rows = getSheetUtilizadores().getDataRange().getValues();
    var lista = [];
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][0]) continue;
      lista.push({ email: rows[i][0], nome: rows[i][1], role: rows[i][2] });
    }
    return lista;
  } catch (e) { return []; }
}


// =============================================================
// DADOS DINÂMICOS
// =============================================================
function getDadosDinamicos(page, sessao, params) {
  params = params || {};
  var now = new Date();
  var dados = {
    tickets: [], comunicados: [], eventos: [],
    dataHoje: Utilities.formatDate(now, "Europe/Lisbon", "dd/MM/yyyy"),
    diaNum: Utilities.formatDate(now, "Europe/Lisbon", "dd"),
    diaNome: getDiaNome(),
    mesNome: getMesNome(),
    totalTickets: 0, emAnalise: 0, pendentes: 0, resolvidos: 0,
    sessao: sessao || null,
  };

  // ── Tickets ──
  try {
    var sh = SpreadsheetApp.openById(CONFIG.TICKETS_SHEET_ID).getSheetByName("Tickets");
    if (sh) {
      var rows = sh.getDataRange().getDisplayValues();
      var tickets = [];
      var emailUser = sessao ? sessao.email : "";
      var verTodos = sessao && (PERMISSOES[sessao.role] || {}).podeVerTodosTickets;

      for (var i = rows.length - 1; i >= 1; i--) {
        var r = rows[i];
        if (!r[19]) continue;
        if (!verTodos && (r[1] || "").toLowerCase() !== emailUser) continue;

        var situacaoRaw = (r[2] || "").trim();
        var situacao = situacaoRaw.indexOf("(") !== -1
          ? situacaoRaw.substring(0, situacaoRaw.lastIndexOf(" (")).trim()
          : situacaoRaw;

        var urgencia = "—";
        if (situacaoRaw.indexOf("Visita") !== -1) { urgencia = r[4] || "—"; }
        else if (situacaoRaw.indexOf("Frota") !== -1 || situacaoRaw.indexOf("Vehicle") !== -1) { urgencia = r[8] || "—"; }

        var reqRaw = (r[1] || "").split("@")[0];
        var req = reqRaw.split(".").map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); }).join(" ");

        var dataFormatada = "—";
        try {
          var dataRaw = r[0];
          if (dataRaw) {
            var d = new Date(dataRaw);
            if (!isNaN(d.getTime())) { dataFormatada = Utilities.formatDate(d, "Europe/Lisbon", "dd-MM-yyyy HH:mm"); }
            else { dataFormatada = dataRaw; }
          }
        } catch (dateErr) { dataFormatada = r[0] || "—"; }

        tickets.push({
          id: r[19], situacaoRaw: situacaoRaw, situacao: situacao, urgencia: urgencia,
          req: req, estado: r[17] || "—", data: dataFormatada,
          responsavel: (function () {
            var respRaw = (r[18] || "").split("@")[0];
            if (!respRaw) return "—";
            return respRaw.split(".").map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); }).join(" ");
          })(),
          vt_evento: r[3] || "", vt_urgencia: r[4] || "", vt_dataHora: r[5] || "", vt_local: r[6] || "",
          fr_veiculo: r[7] || "", fr_urgencia: r[8] || "", fr_assunto: r[9] || "", fr_obs: r[10] || "", fr_link: r[11] || "",
          co_sugestao: r[12] || "", co_link: r[13] || "",
          cs_falta: r[14] || "", su_desc: r[15] || "", de_desc: r[16] || "",
        });
        if (tickets.length >= 50) break;
      }

      dados.tickets = tickets;
      dados.totalTickets = tickets.length;
      dados.emAnalise = tickets.filter(function (t) { return t.estado === "Em Análise"; }).length;
      dados.pendentes = tickets.filter(function (t) { return t.estado === "Pendente"; }).length;
      dados.resolvidos = tickets.filter(function (t) { return t.estado === "Resolvido"; }).length;
    }
  } catch (err) { Logger.log("Erro tickets: " + err.message); }

  // ── Comunicados ──
  try {
    var shCom = SpreadsheetApp.openById(CONFIG.COMUNICADOS_SHEET_ID).getSheetByName("Comunicados");
    if (shCom) {
      var cRows = shCom.getDataRange().getDisplayValues();
      var coms = [];
      for (var j = cRows.length - 1; j >= 1; j--) {
        var c = cRows[j];
        if (c[6] !== "Sim") continue;
        coms.push({ id: c[0], tipo: c[1], titulo: c[2], descricao: c[3], autor: c[4], data: c[5] });
        if (coms.length >= 100) break;
      }
      dados.comunicados = coms;
    }
  } catch (err) { Logger.log("Erro comunicados: " + err.message); }

  // ── RH Documentos ──
  if (page === 'rh') {
    try {
      var shRH = SpreadsheetApp.openById(CONFIG.COMUNICADOS_SHEET_ID).getSheetByName('RH Documentos');
      if (shRH) {
        var rhRows = shRH.getDataRange().getDisplayValues();
        var docs = [];
        var roleUser = (sessao ? sessao.role : 'utilizador').toLowerCase();
        for (var r = 1; r < rhRows.length; r++) {
          var dr = rhRows[r];
          if (!dr[0]) continue;

          var acessoDoc = (dr[6] || 'utilizador').toLowerCase().trim();

          var podeVer = false;
          if (roleUser === 'admin') {
            podeVer = true; // admin vê tudo
          } else if (roleUser === 'gestor') {
            podeVer = (acessoDoc === 'utilizador' || acessoDoc === 'gestor');
          } else {
            podeVer = (acessoDoc === 'utilizador'); // utilizador só vê o que é público
          }

          if (!podeVer) continue;

          docs.push({
            id: dr[0], nome: dr[1], cat: dr[2], tipo: dr[3],
            url: dr[4], autor: dr[5], acesso: dr[6],
            data: dr[7], descricao: dr[8] || ''
          });
        }
        // Mais recentes primeiro
        docs.sort(function (a, b) {
          var na = parseInt((a.id || '').replace(/\D/g, '')) || 0;
          var nb = parseInt((b.id || '').replace(/\D/g, '')) || 0;
          return nb - na;
        });
        dados.documentos = docs;
      }
    } catch (err) {
      Logger.log('Erro RH: ' + err.message);
      dados.documentos = [];
    }
  } else {
    dados.documentos = [];
  }

  // ── Eventos do Calendário ──
  // Só carrega quando estamos na página de calendário para não atrasar as outras páginas
  if (page === 'calendario' || page === 'index') {
    try {
      dados.eventos = getEventosCalendario();
    } catch (err) {
      Logger.log('Erro eventos calendário: ' + err.message);
      dados.eventos = [];
    }
  } else {
    dados.eventos = [];
  }


  // ── Frota ──
  if (page === 'frota') {
    try {
      dados.frota = getFrotaManutencao();
    } catch (err) {
      Logger.log('Erro frota: ' + err.message);
      dados.frota = [];
    }
  } else {
    dados.frota = [];
  }

  // ── Alertas ──
  if (page === 'alertas') {
    try {
      dados.alertas = getAlertasVeiculos();
    } catch (err) {
      Logger.log('Erro alertas: ' + err.message);
      dados.alertas = { atuais: [], historico: [] };
    }
  } else {
    dados.alertas = { atuais: [], historico: [] };
  }

  // ── Gestão de Projetos ──
  if (page === 'verProjetos') {
    try {
      dados.projetos = listarProjetos();
    } catch (err) {
      Logger.log('Erro verProjetos: ' + err.message);
      dados.projetos = [];
    }
  } else {
    dados.projetos = [];
  }

  if (page === 'editarProjeto') {
    var projetoId = params && params.id ? params.id : '';
    dados.projetoId = projetoId;
    dados.podeEditar = !!(sessao && sessao.role === 'admin');
    dados.podeEliminar = !!(sessao && sessao.role === 'admin');
    dados.podePDF = !!(sessao && sessao.role === 'admin');

    Logger.log('PERMISSOES — role: ' + (sessao ? sessao.role : 'NULL') + ' | podeEditar: ' + dados.podeEditar + ' | podeEliminar: ' + dados.podeEliminar);

    try {
      dados.projeto = projetoId ? obterProjeto(projetoId) : null;
    } catch (err) {
      Logger.log('Erro editarProjeto: ' + err.message);
      dados.projeto = null;
    }
  } else {
    dados.projeto = null;
  }

  return dados;
}

// =============================================================
// CALENDÁRIO — getEventosCalendario()  (versão final)
// Substitui a função homónima em Code.gs
//
// Correções:
//   1. Sem truncagem — mostra TODOS os eventos do intervalo
//   2. Payload compacto (campos curtos) para caber no template
//   3. Intervalo: 2 meses antes + 6 meses à frente
//   4. Eventos multi-dia em curso (férias) aparecem correctamente
// =============================================================
function getEventosCalendario() {
  var agora = new Date();
  var inicio = new Date(agora.getFullYear(), agora.getMonth() - 2, 1);
  var fim    = new Date(agora.getFullYear(), agora.getMonth() + 6, 0);
  Logger.log('getEventosCalendario: ' + inicio + ' → ' + fim);

  var eventos = [];

  // ── CrewBrain via iCal direto (sem passar pelo Google Calendar) ──
  try {
    var crewEventos = getEventosCrewBrainICal(inicio, fim);
    crewEventos.forEach(function(e){ eventos.push(e); });
  } catch(e) {
    Logger.log('Erro CrewBrain iCal: ' + e.message);
  }

  // ── Férias — continua a vir do Google Calendar ──
  try {
    var calFerias = CalendarApp.getCalendarById(CAL_IDS.ferias);
    if (calFerias) {
      calFerias.getEvents(inicio, fim).forEach(function(ev) {
        var isAllDay = ev.isAllDayEvent();
        var start    = ev.getStartTime();
        var end      = ev.getEndTime();
        function fmt(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
        function fmtT(d){ return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
        if (isAllDay) {
          var d = new Date(start.getTime());
          var endDay = new Date(end.getTime() - 86400000);
          while (d <= endDay) {
            eventos.push({ dt:fmt(d), de:fmt(endDay), n:ev.getTitle(), c:'ferias', a:1, st:'', et:'', l:ev.getLocation()||'', ds:'' });
            d.setDate(d.getDate() + 1);
          }
        } else {
          eventos.push({ dt:fmt(start), de:fmt(end), n:ev.getTitle(), c:'ferias', a:0, st:fmtT(start), et:fmtT(end), l:ev.getLocation()||'', ds:'' });
        }
      });
    }
  } catch(e) {
    Logger.log('Erro ferias: ' + e.message);
  }

  eventos.sort(function(a,b){ return a.dt < b.dt ? -1 : a.dt > b.dt ? 1 : 0; });

  var json = JSON.stringify(eventos);
  Logger.log('Eventos: ' + eventos.length + ' | JSON: ' + json.length + ' chars');
  if (json.length > 800000) eventos = eventos.slice(0, 1000);

  return eventos;
}

function getEventosCrewBrainICal(inicio, fim) {
  var ICAL_URL = 'https://europalco.crewbrain.com/ical/u89u9onioy';

  // Cache de 5 minutos
  var cache   = CacheService.getScriptCache();
  var cacheKey = 'crewbrain_ical';
  var cached  = cache.get(cacheKey);
  var icalText;

  if (cached) {
    icalText = cached;
  } else {
    var response = UrlFetchApp.fetch(ICAL_URL, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      throw new Error('iCal HTTP ' + response.getResponseCode());
    }
    icalText = response.getContentText();
    // O cache só aceita strings até 100KB por entrada
    if (icalText.length < 100000) {
      cache.put(cacheKey, icalText, 60); // 1 minutos
    }
  }

  return _parseICal(icalText, inicio, fim);
}

function _parseICal(text, inicio, fim) {
  var eventos = [];

  var unfolded = text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
  var linhas   = unfolded.split(/\r?\n/);
  var ev       = null;

  linhas.forEach(function(linha) {
    if (linha === 'BEGIN:VEVENT') {
      ev = {};
    } else if (linha === 'END:VEVENT') {
      if (ev && ev.dt) eventos.push(ev);
      ev = null;
    } else if (ev) {
      if (linha.match(/^SUMMARY[;:]/))
        ev.n = linha.replace(/^SUMMARY[^:]*:/, '').trim();
      else if (linha.match(/^DTSTART/))
        ev.dt = _parseDtIcal(linha, false);
      else if (linha.match(/^DTEND/))
        ev.de = _parseDtIcal(linha, true);
      else if (linha.match(/^LOCATION[;:]/))
        ev.l = linha.replace(/^LOCATION[^:]*:/, '').trim();
      else if (linha.match(/^DESCRIPTION[;:]/))
  ev.ds = linha.replace(/^DESCRIPTION[^:]*:/, '')
               .replace(/\\n/g, '\n')
               .replace(/\\,/g, ',')
               .replace(/\\;/g, ';')
               .replace(/Event-ID\s+/gi, '')  // ← remove "Event-ID ", fica só "C261369"
               .trim();
    }
  });

  var inicioStr = _fmtDate(inicio);
  var fimStr    = _fmtDate(fim);
  var resultado = [];

  eventos.forEach(function(e) {
    if (!e.de) e.de = e.dt;

    // ── Descartar sempre eventos com Staffing needs: 0/0: ──
    if (_eStaffingVazio(e.ds)) return;

    if (e.de < inicioStr || e.dt > fimStr) return;

    var d      = _strToDate(e.dt);
    var endDay = _strToDate(e.de);
    while (d <= endDay) {
      resultado.push({
        dt: _fmtDate(d), de: e.de,
        n: e.n || '', c: 'crew',
        a: 1, st: '', et: '',
        l: e.l || '', ds: e.ds || ''
      });
      d.setDate(d.getDate() + 1);
    }
  });

  return resultado;
}

function _eStaffingVazio(ds) {
  if (!ds) return true;
  // Após o replace, "Event-ID " já foi removido, fica só "C261369\n\n\nStaffing needs: 0/0:"
  return /^C\d+[\s\n]*Staffing\s+needs\s*:\s*0\/0\s*:?\s*$/i.test(ds);
}


function _parseDtIcal(linha, isEnd) {
  var val = linha.split(':').pop().trim();
  var d   = val.slice(0, 8); // YYYYMMDD
  var date = new Date(
    parseInt(d.slice(0, 4)),
    parseInt(d.slice(4, 6)) - 1,
    parseInt(d.slice(6, 8))
  );
  // DTEND no iCal all-day é exclusivo — subtrai 1 dia
  if (isEnd && val.length === 8) date.setDate(date.getDate() - 1);
  return _fmtDate(date);
}

function _fmtDate(d) {
  return d.getFullYear() + '-'
    + String(d.getMonth() + 1).padStart(2, '0') + '-'
    + String(d.getDate()).padStart(2, '0');
}

function _strToDate(s) {
  var p = s.split('-');
  return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
}

function testarIcal() {
  var eventos = getEventosCrewBrainICal(
    new Date(2026, 0, 1),
    new Date(2026, 11, 31)
  );
  Logger.log('Total: ' + eventos.length);
  if (eventos.length > 0) Logger.log('Primeiro: ' + JSON.stringify(eventos[0]));
}

function inspecionarIcal() {
  var ICAL_URL = 'https://europalco.crewbrain.com/ical/u89u9onioy';
  var response = UrlFetchApp.fetch(ICAL_URL, { muteHttpExceptions: true });
  var text = response.getContentText();
  
  var eventos = _parseICal(text, new Date(2026, 2, 1), new Date(2026, 2, 31));
  Logger.log('Total eventos em Março 2026: ' + eventos.length);
  eventos.forEach(function(e, i) {
    Logger.log('--- Evento ' + (i+1) + ' ---');
    Logger.log(JSON.stringify(e, null, 2));
  });
}

// =============================================================
// TICKETS — actualizar / eliminar
// =============================================================
function atualizarEstadoTicket(id, novoEstado) {
  var sessao = getSessao();
  if (!sessao) throw new Error("Não autenticado.");
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeEscrever) throw new Error("Sem permissão.");
  var estadosValidos = ["Em Análise", "Pendente", "Resolvido"];
  if (estadosValidos.indexOf(novoEstado) === -1) throw new Error("Estado inválido.");
  try {
    var sh = SpreadsheetApp.openById(CONFIG.TICKETS_SHEET_ID).getSheetByName("Tickets");
    var rows = sh.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if ((rows[i][19] || "").toString().trim() === id.toString().trim()) {
        sh.getRange(i + 1, 18).setValue(novoEstado); return { ok: true };
      }
    }
    throw new Error("Ticket não encontrado: " + id);
  } catch (e) { Logger.log("Erro atualizarEstadoTicket: " + e.message); throw e; }
}

function atualizarTicket(id, updates) {
  var sessao = getSessao();
  if (!sessao) throw new Error("Não autenticado.");
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeEscrever) throw new Error("Sem permissão.");
  try {
    var sh = SpreadsheetApp.openById(CONFIG.TICKETS_SHEET_ID).getSheetByName("Tickets");
    var rows = sh.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if ((rows[i][19] || "").toString().trim() !== id.toString().trim()) continue;
      var lin = i + 1;
      if (updates.estado !== undefined) {
        var ev = ["", "Em Análise", "Pendente", "Resolvido"];
        if (ev.indexOf(updates.estado) === -1) throw new Error("Estado inválido.");
        sh.getRange(lin, 18).setValue(updates.estado);
      }
      if (updates.responsavel !== undefined) sh.getRange(lin, 19).setValue(updates.responsavel);
      if (updates.fr_obs !== undefined) sh.getRange(lin, 11).setValue(updates.fr_obs);
      if (updates.fr_link !== undefined) sh.getRange(lin, 12).setValue(updates.fr_link);
      if (updates.co_sugestao !== undefined) sh.getRange(lin, 13).setValue(updates.co_sugestao);
      if (updates.co_link !== undefined) sh.getRange(lin, 14).setValue(updates.co_link);
      if (updates.cs_falta !== undefined) sh.getRange(lin, 15).setValue(updates.cs_falta);
      if (updates.su_desc !== undefined) sh.getRange(lin, 16).setValue(updates.su_desc);
      if (updates.de_desc !== undefined) sh.getRange(lin, 17).setValue(updates.de_desc);
      return { ok: true };
    }
    throw new Error("Ticket não encontrado: " + id);
  } catch (e) { Logger.log("Erro atualizarTicket: " + e.message); throw e; }
}

function eliminarTicket(id) {
  var sessao = getSessao();
  if (!sessao) throw new Error("Não autenticado.");
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeEscrever) throw new Error("Sem permissão.");
  try {
    var sh = SpreadsheetApp.openById(CONFIG.TICKETS_SHEET_ID).getSheetByName("Tickets");
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if ((rows[i][19] || "").toString().trim() === id.toString().trim()) {
        sh.deleteRow(i + 1); Logger.log("Ticket eliminado: " + id); return { ok: true };
      }
    }
    throw new Error("Ticket não encontrado: " + id);
  } catch (e) { Logger.log("Erro eliminarTicket: " + e.message); throw e; }
}

// =============================================================
// COMUNICADOS — actualizar / eliminar
// =============================================================
function atualizarComunicado(id, updates) {
  var sessao = getSessao();
  if (!sessao) throw new Error("Não autenticado.");
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeCriarComunicados) throw new Error("Sem permissão.");
  try {
    var sh = SpreadsheetApp.openById(CONFIG.COMUNICADOS_SHEET_ID).getSheetByName("Comunicados");
    var rows = sh.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if ((rows[i][0] || "").toString().trim() !== id.toString().trim()) continue;
      var lin = i + 1;
      if (updates.tipo !== undefined) sh.getRange(lin, 2).setValue(updates.tipo);
      if (updates.titulo !== undefined) sh.getRange(lin, 3).setValue(updates.titulo);
      if (updates.descricao !== undefined) sh.getRange(lin, 4).setValue(updates.descricao);
      Logger.log("Comunicado atualizado: " + id); return { ok: true };
    }
    throw new Error("Comunicado não encontrado: " + id);
  } catch (e) { Logger.log("Erro atualizarComunicado: " + e.message); throw e; }
}

function eliminarComunicado(id) {
  var sessao = getSessao();
  if (!sessao) throw new Error("Não autenticado.");
  var perms = PERMISSOES[sessao.role] || PERMISSOES["utilizador"];
  if (!perms.podeCriarComunicados) throw new Error("Sem permissão.");
  try {
    var sh = SpreadsheetApp.openById(CONFIG.COMUNICADOS_SHEET_ID).getSheetByName("Comunicados");
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if ((rows[i][0] || "").toString().trim() === id.toString().trim()) {
        sh.deleteRow(i + 1); Logger.log("Comunicado eliminado: " + id); return { ok: true };
      }
    }
    throw new Error("Comunicado não encontrado: " + id);
  } catch (e) { Logger.log("Erro eliminarComunicado: " + e.message); throw e; }
}





// =============================================================
// HELPERS DE DATA
// =============================================================
function getDiaNome() {
  return ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"][new Date().getDay()];
}
function getMesNome() {
  return ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][new Date().getMonth()]
    + " " + new Date().getFullYear();
}

// =============================================================
// FOTOS DO MÊS — adicionar ao Code.gs
// =============================================================

var FOTOS_FOLDER_ID = '1yNwtA7_WLWRCuiHq1pIpnUBTm2ktuv7E';

// Listar fotos da pasta
function getFotosCliente() {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  try {
    var folder = DriveApp.getFolderById(FOTOS_FOLDER_ID);
    var files = folder.getFiles();
    var fotos = [];
    while (files.hasNext()) {
      var file = files.next();
      var mime = file.getMimeType();
      if (mime.indexOf('image/') === -1) continue;
      fotos.push({
        id: file.getId(),
        nome: file.getName().replace(/\.[^.]+$/, ''),
        url: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1600',
        data: Utilities.formatDate(file.getDateCreated(), 'Europe/Lisbon', 'dd-MM-yyyy HH:mm'),
        autor: file.getDescription() || 'Equipa RISE',
      });
    }
    // Mais recentes primeiro
    fotos.sort(function (a, b) {
      return a.data < b.data ? 1 : a.data > b.data ? -1 : 0;
    });
    return { fotos: fotos };
  } catch (e) {
    Logger.log('Erro getFotos: ' + e.message);
    return { erro: e.message };
  }
}

// Fazer upload de uma foto
function uploadFoto(base64Data, fileName, mimeType, autorNome) {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  try {
    var folder = DriveApp.getFolderById(FOTOS_FOLDER_ID);
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    var file = folder.createFile(blob);
    file.setDescription(autorNome || sessao.nome || 'Equipa RISE');
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return {
      ok: true,
      id: file.getId(),
      nome: file.getName().replace(/\.[^.]+$/, ''),
      url: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1600',
      data: Utilities.formatDate(new Date(), 'Europe/Lisbon', 'dd-MM-yyyy HH:mm'),
      autor: file.getDescription(),
    };
  } catch (e) {
    Logger.log('Erro uploadFoto: ' + e.message);
    return { erro: e.message };
  }
}

// Eliminar uma foto
function eliminarFoto(fileId) {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  var perms = PERMISSOES[sessao.role] || PERMISSOES['utilizador'];
  if (!perms.podeEscrever) return { erro: 'Sem permissão.' };
  try {
    var file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return { ok: true };
  } catch (e) {
    Logger.log('Erro eliminarFoto: ' + e.message);
    return { erro: e.message };
  }
}

// RH DOCUMENTOS
function adicionarDocumentoRH(dados) {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  var perms = PERMISSOES[sessao.role] || PERMISSOES['utilizador'];
  if (!perms.podeEscrever) return { erro: 'Sem permissão.' };
  try {
    var sh = SpreadsheetApp.openById(CONFIG.COMUNICADOS_SHEET_ID).getSheetByName('RH Documentos');
    var rows = sh.getDataRange().getValues();
    var maxNum = 0;
    for (var i = 1; i < rows.length; i++) {
      var n = parseInt((rows[i][0] || '').toString().replace(/\D/g, ''));
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
    var id = 'D' + String(maxNum + 1).padStart(3, '0');
    var dataHoje = Utilities.formatDate(new Date(), 'Europe/Lisbon', 'dd/MM/yyyy');
    sh.appendRow([id, dados.nome, dados.cat, dados.tipo, dados.url || '', dados.autor || 'RH', dados.acesso || 'Todos', dataHoje, dados.descricao || '']);
    return { ok: true, id: id, data: dataHoje };
  } catch (e) { return { erro: e.message }; }
}

function eliminarDocumentoRH(id) {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  var perms = PERMISSOES[sessao.role] || PERMISSOES['utilizador'];
  if (!perms.podeEscrever) return { erro: 'Sem permissão.' };
  try {
    var sh = SpreadsheetApp.openById(CONFIG.COMUNICADOS_SHEET_ID).getSheetByName('RH Documentos');
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if ((rows[i][0] || '').toString().trim() === id.toString().trim()) {
        sh.deleteRow(i + 1); return { ok: true };
      }
    }
    return { erro: 'Documento não encontrado.' };
  } catch (e) { return { erro: e.message }; }
}

function atualizarDocumentoRH(id, nome, cat, tipo, url, autor, acesso, descricao, data) {
  var sessao = getSessao();
  if (!sessao) throw new Error('Não autenticado.');
  var perms = PERMISSOES[sessao.role] || PERMISSOES['utilizador'];
  if (!perms.podeEscrever) throw new Error('Sem permissão.');
  try {
    var sh = SpreadsheetApp.openById(CONFIG.COMUNICADOS_SHEET_ID).getSheetByName('RH Documentos');
    var rows = sh.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if ((rows[i][0] || '').toString().trim() !== id.toString().trim()) continue;
      var lin = i + 1;
      if (nome !== undefined) sh.getRange(lin, 2).setValue(nome);
      if (cat !== undefined) sh.getRange(lin, 3).setValue(cat);
      if (tipo !== undefined) sh.getRange(lin, 4).setValue(tipo);
      if (url !== undefined) sh.getRange(lin, 5).setValue(url);
      if (autor !== undefined) sh.getRange(lin, 6).setValue(autor);
      if (acesso !== undefined) sh.getRange(lin, 7).setValue(acesso);
      if (descricao !== undefined) sh.getRange(lin, 9).setValue(descricao);
      if (data !== undefined) sh.getRange(lin, 8).setValue(data);
      return { ok: true };
    }
    throw new Error('Documento não encontrado: ' + id);
  } catch (e) { Logger.log('Erro atualizarDocumentoRH: ' + e.message); throw e; }
}


// =============================================================
// RESTAURANTES — listar / adicionar / actualizar / eliminar
// =============================================================

function emailParaNome(email) {
  if (!email) return '';
  var parte = email.split('@')[0];
  return parte.split('.').map(function (p) {
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }).join(' ');
}

function getRestaurantesCliente() {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  try {
    var sh = SpreadsheetApp.openById(CONFIG.RESTAURANTES_SHEET_ID).getSheetByName('Restaurantes');
    var rows = sh.getDataRange().getValues();
    var lista = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      var dataVal = '';
      if (r[12]) {
        try {
          var d = new Date(r[12]);
          if (!isNaN(d.getTime())) {
            dataVal = Utilities.formatDate(d, 'Europe/Lisbon', 'dd/MM/yyyy');
          }
        } catch (e) { dataVal = String(r[12]); }
      }
      lista.push({
        id: String(r[0]),
        nome: r[1] || '',
        zona: r[2] || '',
        tipo: r[3] || '',
        rating: r[4] || '',
        preco: r[5] || '',
        horario: r[6] || '',
        telefone: r[7] || '',
        foto: r[8] || '',
        maps: r[9] || '',
        autor: r[10] || '',
        // r[11] = email (não enviado ao frontend)
        data: dataVal,
      });
    }
    return { ok: true, restaurantes: lista };
  } catch (e) { return { ok: false, erro: e.message }; }
}

function addRestauranteCliente(dados) {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  var perms = PERMISSOES[sessao.role] || PERMISSOES['utilizador'];
  if (!perms.podeEscrever) return { erro: 'Sem permissão.' };
  try {
    var sh = SpreadsheetApp.openById(CONFIG.RESTAURANTES_SHEET_ID).getSheetByName('Restaurantes');
    var rows = sh.getDataRange().getValues();

    // ID incremental Rxxx
    var maxNum = 0;
    for (var i = 1; i < rows.length; i++) {
      var idStr = String(rows[i][0] || '');
      if (/^R\d+$/i.test(idStr)) {
        var n = parseInt(idStr.substring(1));
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    }
    var id = 'R' + String(maxNum + 1).padStart(3, '0');

    var autorNome = emailParaNome(sessao.email);
    var dataHoje = Utilities.formatDate(new Date(), 'Europe/Lisbon', 'dd/MM/yyyy');

    sh.appendRow([
      id,                          // A - ID
      dados.nome || '',         // B - Nome
      dados.zona || '',         // C - Zona
      dados.tipo || '',         // D - Tipo de Cozinha
      dados.rating || '',         // E - Avaliação (1-5)
      dados.preco || '',         // F - Preço Médio
      dados.horario || '',         // G - Horário
      dados.telefone || '',         // H - Telefone
      dados.foto || '',         // I - Foto (URL)
      dados.maps || '',         // J - Link Google Maps
      autorNome,                   // K - Sugerido por
      sessao.email || '',         // L - Email
      dataHoje,                    // M - Data
    ]);

    return { ok: true, id: id };
  } catch (e) { return { ok: false, erro: e.message }; }
}

function updateRestauranteCliente(id, updates) {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  var perms = PERMISSOES[sessao.role] || PERMISSOES['utilizador'];
  if (!perms.podeEscrever) return { erro: 'Sem permissão.' };
  try {
    var sh = SpreadsheetApp.openById(CONFIG.RESTAURANTES_SHEET_ID).getSheetByName('Restaurantes');
    var rows = sh.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) !== String(id)) continue;
      var lin = i + 1;
      // A=1(id) B=2(nome) C=3(zona) D=4(tipo) E=5(rating) F=6(preco)
      // G=7(horario) H=8(telefone) I=9(foto) J=10(maps)
      // K=11(autor) L=12(email) M=13(data) — não editáveis
      if (updates.nome !== undefined) sh.getRange(lin, 2).setValue(updates.nome);
      if (updates.zona !== undefined) sh.getRange(lin, 3).setValue(updates.zona);
      if (updates.tipo !== undefined) sh.getRange(lin, 4).setValue(updates.tipo);
      if (updates.rating !== undefined) sh.getRange(lin, 5).setValue(updates.rating);
      if (updates.preco !== undefined) sh.getRange(lin, 6).setValue(updates.preco);
      if (updates.horario !== undefined) sh.getRange(lin, 7).setValue(updates.horario);
      if (updates.telefone !== undefined) sh.getRange(lin, 8).setValue(updates.telefone);
      if (updates.foto !== undefined) sh.getRange(lin, 9).setValue(updates.foto);
      if (updates.maps !== undefined) sh.getRange(lin, 10).setValue(updates.maps);
      return { ok: true };
    }
    return { ok: false, erro: 'Restaurante não encontrado.' };
  } catch (e) { return { ok: false, erro: e.message }; }
}

function deleteRestauranteCliente(id) {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };
  var perms = PERMISSOES[sessao.role] || PERMISSOES['utilizador'];
  if (!perms.podeEscrever) return { erro: 'Sem permissão.' };
  try {
    var sh = SpreadsheetApp.openById(CONFIG.RESTAURANTES_SHEET_ID).getSheetByName('Restaurantes');
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return { ok: true };
      }
    }
    return { ok: false, erro: 'Restaurante não encontrado.' };
  } catch (e) { return { ok: false, erro: e.message }; }
}

// ── FROTA — adicionar ao code.gs ──────────────────────────────────────────
//
// Adicionar ao CONFIG:
//   FROTA_SHEET_ID: '1G3GCsdMkdOFIPzFCxYgZqeCAFSW5e4jkrEpZTPzXxXE',
//
// Colunas da sheet "Frota_Manutenção" (linha 1 = cabeçalho):
//   A: ID | B: Data | C: Tipologia | D: Veículo | E: Descrição | F: Estado
//
// Formato de data usado: DD/MM/YYYY HH:MM  (ex: 09/03/2026 14:35)
// ──────────────────────────────────────────────────────────────────────────

var TZ = Session.getScriptTimeZone();
var DATA_FORMAT = 'dd/MM/yyyy HH:mm';

// Devolve a data atual no formato da sheet
function _dataAgora() {
  return Utilities.formatDate(new Date(), TZ, DATA_FORMAT);
}

// Abre a sheet Frota_Manutenção e devolve {ss, sheet, headers, iId, iData, iTipol, iVeic, iDesc, iEst}
function _frotaSheet() {
  var ss = SpreadsheetApp.openById(CONFIG.FROTA_SHEET_ID);
  var sheet = ss.getSheetByName('Frota_Manutenção');
  if (!sheet) throw new Error('Sheet "Frota_Manutenção" não encontrada');

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (h) { return String(h).trim().toLowerCase(); });

  function col(name) {
    // Tenta match exato, depois match parcial (para acentos)
    var idx = headers.indexOf(name.toLowerCase());
    if (idx >= 0) return idx;
    for (var i = 0; i < headers.length; i++) {
      if (headers[i].indexOf(name.toLowerCase()) !== -1) return i;
    }
    return -1;
  }

  return {
    ss: ss,
    sheet: sheet,
    iId: col('id'),
    iData: col('data'),
    iTipol: col('tipologia'),
    iVeic: col('veículo'),   // tenta com acento; fallback tenta 'veiculo'
    iDesc: col('descrição'), // idem
    iEst: col('estado'),
  };
}

// Converte uma linha da sheet num objeto JS
function _rowToObj(row, ctx) {
  function cell(i) { return i >= 0 ? String(row[i] || '').trim() : ''; }

  var dataVal = ctx.iData >= 0 ? row[ctx.iData] : '';
  if (dataVal instanceof Date) {
    dataVal = Utilities.formatDate(dataVal, TZ, DATA_FORMAT);
  } else {
    dataVal = String(dataVal || '').trim();
  }

  return {
    id: cell(ctx.iId),
    data: dataVal,
    tipologia: cell(ctx.iTipol),
    veiculo: cell(ctx.iVeic),
    desc: cell(ctx.iDesc),
    estado: cell(ctx.iEst),
  };
}

// ── GET ────────────────────────────────────────────────────────────────────
/**
 * Lê todos os registos da tab Frota_Manutenção.
 * Chamada em doGet: dados.frota = getFrotaManutencao();
 */
function getFrotaManutencao() {
  try {
    var ctx = _frotaSheet();
    var data = ctx.sheet.getDataRange().getValues();
    if (data.length < 2) return [];

    var result = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row.every(function (c) { return c === '' || c === null || c === undefined; })) continue;
      result.push(_rowToObj(row, ctx));
    }
    return result;
  } catch (e) {
    Logger.log('getFrotaManutencao error: ' + e);
    return [];
  }
}

// ── ADD ────────────────────────────────────────────────────────────────────
/**
 * Adiciona nova linha com ID automático, data atual e estado Pendente.
 * payload: { tipologia, veiculo, desc }
 * Devolve: { ok: true, registo: {...} }
 */
function addFrotaManutencao(payload) {
  try {
    var ctx = _frotaSheet();
    var sheet = ctx.sheet;

    // Gera ID: conta linhas de dados (exclui cabeçalho) + 1
    var numDados = sheet.getLastRow() - 1; // linhas com dados
    var novoId = 'F' + String(numDados + 1).padStart(3, '0');

    var dataAgora = _dataAgora();
    var estado = 'Pendente';

    // Constrói linha com a mesma ordem das colunas da sheet
    var novaLinha = new Array(sheet.getLastColumn() || 6).fill('');
    if (ctx.iId >= 0) novaLinha[ctx.iId] = novoId;
    if (ctx.iData >= 0) novaLinha[ctx.iData] = dataAgora;
    if (ctx.iTipol >= 0) novaLinha[ctx.iTipol] = payload.tipologia || '';
    if (ctx.iVeic >= 0) novaLinha[ctx.iVeic] = payload.veiculo || '';
    if (ctx.iDesc >= 0) novaLinha[ctx.iDesc] = payload.desc || '';
    if (ctx.iEst >= 0) novaLinha[ctx.iEst] = estado;

    sheet.appendRow(novaLinha);

    return {
      ok: true,
      registo: {
        id: novoId,
        data: dataAgora,
        tipologia: payload.tipologia || '',
        veiculo: payload.veiculo || '',
        desc: payload.desc || '',
        estado: estado,
      }
    };
  } catch (e) {
    Logger.log('addFrotaManutencao error: ' + e);
    return { ok: false, error: String(e) };
  }
}

// ── UPDATE ─────────────────────────────────────────────────────────────────
/**
 * Atualiza os campos de um registo existente e regista a data/hora de edição.
 * id:      'F001'
 * updates: { tipologia, veiculo, desc, estado }
 * Devolve: { ok: true, data: '09/03/2026 14:35' }
 */
function updateFrotaManutencao(id, updates) {
  try {
    var ctx = _frotaSheet();
    var sheet = ctx.sheet;
    var data = sheet.getDataRange().getValues();

    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      var cellId = String(data[i][ctx.iId] || '').trim();
      if (cellId === String(id).trim()) { rowIndex = i + 1; break; } // +1: 1-indexed
    }

    if (rowIndex === -1) {
      return { ok: false, error: 'Registo ' + id + ' não encontrado' };
    }

    var dataAgora = _dataAgora();

    // Escreve só as células que existem na sheet
    function setCell(colIdx, value) {
      if (colIdx >= 0) sheet.getRange(rowIndex, colIdx + 1).setValue(value);
    }

    setCell(ctx.iData, dataAgora);
    setCell(ctx.iTipol, updates.tipologia || '');
    setCell(ctx.iVeic, updates.veiculo || '');
    setCell(ctx.iDesc, updates.desc || '');
    setCell(ctx.iEst, updates.estado || '');

    return { ok: true, data: dataAgora };
  } catch (e) {
    Logger.log('updateFrotaManutencao error: ' + e);
    return { ok: false, error: String(e) };
  }
}

function deleteFrotaManutencao(id) {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.FROTA_SHEET_ID);
    var sheet = ss.getSheetByName('Frota_Manutenção');
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(id).trim()) {
        sheet.deleteRow(i + 1);
        return { ok: true };
      }
    }
    return { ok: false, erro: 'Registo não encontrado' };
  } catch (e) {
    return { ok: false, erro: e.message };
  }
}

// Nova função — adicionar antes de getDadosDinamicos ou no fim do ficheiro:
function getAlertasVeiculos() {
  try {
    var ss = SpreadsheetApp.openById("1lkhzZfbuIR2fwifcOFb7ekbXwx4SOrWzYr_yH7bNdrA");

    // Tab Atuais
    var shAtuais = ss.getSheetByName("Atuais");
    var atuais = [];
    if (shAtuais) {
      var rowsA = shAtuais.getDataRange().getValues();
      var hdrsA = rowsA[0].map(function (h) { return String(h).trim(); });
      for (var i = 1; i < rowsA.length; i++) {
        var r = rowsA[i];
        if (!r[0]) continue;
        var obj = {};
        hdrsA.forEach(function (h, idx) {
          var val = r[idx];
          if (val instanceof Date) {
            obj[h] = Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
          } else {
            obj[h] = String(val || '').trim();
          }
        });
        atuais.push(obj);
      }
    }

    // Tab Historico — lê tudo e constrói objetos com cabeçalhos reais
    var shHist = ss.getSheetByName("Historico");
    var historico = [];
    if (shHist) {
      var rowsH = shHist.getDataRange().getValues();
      var hdrsH = rowsH[0].map(function (h) { return String(h).trim(); });

      // Índices das colunas necessárias
      function ci(name) {
        for (var x = 0; x < hdrsH.length; x++) {
          if (hdrsH[x].toLowerCase().replace(/['\s_]/g, '') === name.toLowerCase().replace(/['\s_]/g, '')) return x;
        }
        return -1;
      }
      var iId = ci('ID_Percurso');
      var iIdViatura = ci('ID_Viatura');
      var iData = ci('Data');
      var iMat = ci('Matricula');
      var iModelo = ci('Modelo');
      var iCond = ci('Condutores');
      var iKmsIni = ci('Kms_Inicial');
      var iKmsFim = ci('Kms_Final');
      var iHoraIni = ci('Hora_Inicial');
      var iHoraFim = ci('Hora_Final');
      var iKmEntre = ci("KMs_entre_Percursos");
      var iStatus = ci('Status_Percurso');
      var iNotif = ci('Notificado');

      function fmtDate(val) {
        if (!val || val === '') return '';
        if (val instanceof Date) {
          return Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
        }
        // Já é string — devolve tal qual (ou tenta parsear)
        var s = String(val).trim();
        if (s === '') return '';
        // Se parecer uma data ISO ou JS date string, converte
        var d = new Date(s);
        if (!isNaN(d.getTime()) && s.length > 8) {
          return Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
        }
        return s;
      }

      function cell(row, idx) {
        if (idx < 0 || idx >= row.length) return '';
        var v = row[idx];
        if (v instanceof Date) return fmtDate(v);
        return String(v || '').trim();
      }

      // Primeira passagem: constrói array de todos os registos
      var todos = [];
      for (var j = 1; j < rowsH.length; j++) {
        var rh = rowsH[j];
        if (!rh[0]) continue;
        todos.push({
          ID_Percurso: cell(rh, iId),
          ID_Viatura: cell(rh, iIdViatura),
          Data: cell(rh, iData),
          Matricula: cell(rh, iMat),
          Modelo: cell(rh, iModelo),
          Condutores: cell(rh, iCond),
          Kms_Inicial: cell(rh, iKmsIni),
          Kms_Final: cell(rh, iKmsFim),
          Hora_Inicial: cell(rh, iHoraIni),
          Hora_Final: cell(rh, iHoraFim),
          "KM's_entre_Percursos": cell(rh, iKmEntre),
          Status_Percurso: cell(rh, iStatus),
          Notificado: cell(rh, iNotif),
          _rowIndex: j  // guarda posição original
        });
      }

      // Segunda passagem: para cada registo ANALISAR, encontra o par de comparação
      // O par é: viagem anterior do mesmo ID_Viatura (maior _rowIndex < rowIndex atual)
      for (var k = 0; k < todos.length; k++) {
        var reg = todos[k];

        if (reg.Status_Percurso.toUpperCase() !== 'ANALISAR') {
          historico.push(reg);
          continue;
        }

        // Procura o registo anterior do mesmo veículo (penúltima viagem = ID mais baixo da comparação)
        var anterior = null;
        for (var m = k - 1; m >= 0; m--) {
          if (todos[m].ID_Viatura === reg.ID_Viatura && todos[m].Kms_Final !== '') {
            anterior = todos[m];
            break;
          }
        }

        // Campos extra para mostrar na tabela
        reg.comp_kms_final_anterior = anterior ? anterior.Kms_Final : '';
        reg.comp_hora_final_anterior = anterior ? anterior.Hora_Final : '';
        reg.comp_kms_ini_atual = reg.Kms_Inicial;

        historico.push(reg);
      }
    }

    return { atuais: atuais, historico: historico };
  } catch (e) {
    Logger.log('getAlertasVeiculos error: ' + e.message);
    return { atuais: [], historico: [] };
  }
}

function getAlertasAtualizados() {
  try {
    var ss = SpreadsheetApp.openById("1lkhzZfbuIR2fwifcOFb7ekbXwx4SOrWzYr_yH7bNdrA");

    // Tab Atuais — só os campos necessários para os cards
    var shAtuais = ss.getSheetByName("Atuais");
    var atuais = [];
    if (shAtuais) {
      var rowsA = shAtuais.getDataRange().getValues();
      var hdrsA = rowsA[0].map(function (h) { return String(h).trim(); });
      for (var i = 1; i < rowsA.length; i++) {
        if (!rowsA[i][0]) continue;
        var obj = {};
        hdrsA.forEach(function (h, idx) {
          var val = rowsA[i][idx];
          if (val instanceof Date) {
            obj[h] = Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
          } else {
            obj[h] = String(val || '').trim();
          }
        });
        atuais.push(obj);
      }
    }

    // Tab Historico — só os registos ANALISAR com campos já calculados
    var shHist = ss.getSheetByName("Historico");
    var historico = [];
    if (shHist) {
      var rowsH = shHist.getDataRange().getValues();
      var hdrsH = rowsH[0].map(function (h) { return String(h).trim(); });

      function ci(name) {
        var n = name.toLowerCase().replace(/['\s_]/g, '');
        for (var x = 0; x < hdrsH.length; x++) {
          if (hdrsH[x].toLowerCase().replace(/['\s_]/g, '') === n) return x;
        }
        return -1;
      }

      var iIdViatura = ci('ID_Viatura');
      var iModelo = ci('Modelo');
      var iMat = ci('Matricula');
      var iKmsIni = ci('Kms_Inicial');
      var iKmsFim = ci('Kms_Final');
      var iHoraIni = ci('Hora_Inicial');
      var iHoraFim = ci('Hora_Final');
      var iKmEntre = ci("KMs_entre_Percursos");
      var iStatus = ci('Status_Percurso');

      function fmtCell(val) {
        if (val instanceof Date) return Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
        return String(val || '').trim();
      }

      // Primeira passagem: todos os registos com Kms_Final para lookup
      var todos = [];
      for (var j = 1; j < rowsH.length; j++) {
        if (!rowsH[j][0]) continue;
        todos.push({
          ID_Viatura: fmtCell(rowsH[j][iIdViatura]),
          Modelo: fmtCell(rowsH[j][iModelo]),
          Matricula: fmtCell(rowsH[j][iMat]),
          Kms_Inicial: fmtCell(rowsH[j][iKmsIni]),
          Kms_Final: fmtCell(rowsH[j][iKmsFim]),
          Hora_Inicial: fmtCell(rowsH[j][iHoraIni]),
          Hora_Final: fmtCell(rowsH[j][iHoraFim]),
          "KM's_entre_Percursos": fmtCell(rowsH[j][iKmEntre]),
          Status_Percurso: fmtCell(rowsH[j][iStatus])
        });
      }

      // Segunda passagem: só ANALISAR, com campos comp_*
      for (var k = 0; k < todos.length; k++) {
        if (todos[k].Status_Percurso.toUpperCase() !== 'ANALISAR') continue;
        var anterior = null;
        for (var m = k - 1; m >= 0; m--) {
          if (todos[m].ID_Viatura === todos[k].ID_Viatura && todos[m].Kms_Final !== '') {
            anterior = todos[m];
            break;
          }
        }
        todos[k].comp_kms_final_anterior = anterior ? anterior.Kms_Final : '';
        todos[k].comp_hora_final_anterior = anterior ? anterior.Hora_Final : '';
        todos[k].comp_kms_ini_atual = todos[k].Kms_Inicial;
        historico.push(todos[k]);
      }
    }

    return { atuais: atuais, historico: historico };

  } catch (e) {
    Logger.log('getAlertasAtualizados error: ' + e.message);
    return { atuais: [], historico: [] };
  }
}


// ── PROJETOS — adicionar ao code.gs ──────────────────────────────────────────
//
//
// ──────────────────────────────────────────────────────────────────────────

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSheet(nome) {
  var ss = SpreadsheetApp.openById(CONFIG.GESTAO_SHEET_ID);
  var sh = ss.getSheetByName(nome);
  if (!sh) throw new Error("A aba '" + nome + "' não existe.");
  return sh;
}


function criarProjeto(dados) {
  var ss = SpreadsheetApp.openById(CONFIG.GESTAO_SHEET_ID);

  // ============================
  // 0) VALIDAR ID DUPLICADO
  // ============================
  var shProjetos = ss.getSheetByName("PROJETOS");
  var lastRow = shProjetos.getLastRow();

  if (lastRow >= 2) {
    var ids = shProjetos.getRange(2, 1, lastRow - 1, 1).getValues()
      .map(r => String(r[0]).trim().toUpperCase());

    if (ids.includes(dados.projeto.ID_Projeto.trim().toUpperCase())) {
      throw new Error(`Já existe um projeto com o Nº "${dados.projeto.ID_Projeto}"`);
    }
  }

  // ============================
  // 1) GRAVAR NA SHEET PROJETOS
  // ============================
  shProjetos.appendRow([
    dados.projeto.ID_Projeto,
    dados.projeto.Local,
    dados.projeto.Nome_do_Evento,
    dados.projeto.Dia_Inicio,
    dados.projeto.Dia_Fim,
    dados.projeto.Rigging_Nr,
    dados.projeto.Video_Nr,
    dados.projeto.Som_Nr,
    dados.projeto.Iluminacao_Nr,
    dados.projeto.Estruturas_Nr,
    dados.projeto.Freelancers_Nr,
    dados.projeto.Subcontratados_Nr,
    dados.projeto.Estacionamento_Reservado ? "TRUE" : "FALSE",
    dados.projeto.Status_Planeamento
  ]);

  // ============================
  // 2) GRAVAR ALIMENTAÇÃO
  // ============================
  var shAlimentacao = ss.getSheetByName("ALIMENTAÇÃO");

  dados.alimentacao.forEach(reg => {
    shAlimentacao.appendRow([
      dados.projeto.ID_Projeto,
      "TRUE",
      reg.Local,
      reg.Nome_Restaurante,
      reg.Local_Restaurante || "",
      reg.Dia,
      reg.Nr_Pessoas,
      reg.Almoco ? "TRUE" : "FALSE",
      reg.Jantar ? "TRUE" : "FALSE",
      reg.Reservado ? "TRUE" : "FALSE"
    ]);
  });

  // ============================
  // 3) GRAVAR ALOJAMENTO
  // ============================
  if (dados.alojamento) {
    var shAlojamento = ss.getSheetByName("ALOJAMENTO");

    shAlojamento.appendRow([
      dados.projeto.ID_Projeto,
      "TRUE",
      dados.alojamento.Nome_Alojamento,
      dados.alojamento.Local_Alojamento,
      dados.alojamento.Checkin,
      dados.alojamento.Checkout,
      dados.alojamento.Nr_Pessoas_Alojamento,
      dados.alojamento.Alojamento_Reservado ? "TRUE" : "FALSE"
    ]);
  }

  // ============================
  // 4) GRAVAR FREELANCERS
  // ============================
  var shFreelancers = ss.getSheetByName("FREELANCERS");

  dados.freelancers.forEach(reg => {
    shFreelancers.appendRow([
      dados.projeto.ID_Projeto,
      "TRUE",
      reg.Nome_Freelancer,
      reg.Freelancer_Confirmado,
      reg.Freelancer_Confirmado === "Confirmado" ? "TRUE" : "FALSE"
    ]);
  });

  // ============================
  // 5) GRAVAR SUBCONTRATADOS
  // ============================
  var shSub = ss.getSheetByName("SUBCONTRATADOS");

  dados.subcontratados.forEach(reg => {
    shSub.appendRow([
      dados.projeto.ID_Projeto,
      "TRUE",
      reg.Nome_Subcontratado,
      reg.Subcontratado_Confirmado,
      reg.Subcontratado_Confirmado === "Confirmado" ? "TRUE" : "FALSE"
    ]);
  });

  // ============================
  // 6) GRAVAR VIATURAS
  // ============================
  var shViaturas = ss.getSheetByName("VIATURAS");

  dados.viaturas.forEach(reg => {
    shViaturas.appendRow([
      dados.projeto.ID_Projeto,
      reg.Viatura
    ]);
  });

  try {
  PropertiesService.getScriptProperties().setProperty(
    'after_criar_' + dados.projeto.ID_Projeto,
    JSON.stringify({ dados: dados })
  );
  ScriptApp.newTrigger('_runAfterCriarTrigger')
    .timeBased()
    .after(1000)
    .create();
} catch (e) { Logger.log('Trigger afterCriar: ' + e.message); }

return true;

}


function listarProjetos() {
  var ss = SpreadsheetApp.openById(CONFIG.GESTAO_SHEET_ID);

  var shProjetos = ss.getSheetByName("PROJETOS");
  var lastRowP = shProjetos.getLastRow();
  if (lastRowP < 2) return [];

  var shAlim = ss.getSheetByName("ALIMENTAÇÃO");
  var shAloj = ss.getSheetByName("ALOJAMENTO");
  var shFree = ss.getSheetByName("FREELANCERS");
  var shSub = ss.getSheetByName("SUBCONTRATADOS");

  var dadosProjetos = shProjetos.getRange(2, 1, lastRowP - 1, 14).getValues();

  function getIds(sh) {
    var ids = new Set();
    if (!sh || sh.getLastRow() < 2) return ids;
    sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues()
      .forEach(r => { if (String(r[1]).toUpperCase() === 'TRUE') ids.add(String(r[0]).trim()); });
    return ids;
  }

  var idsAlim = getIds(shAlim);
  var idsAloj = getIds(shAloj);
  var idsFree = getIds(shFree);
  var idsSub = getIds(shSub);

  return dadosProjetos
    .filter(row => row[0] !== "" && row[0] !== null)
    .map(row => {
      var id = String(row[0]).trim();
      return {
        ID_Projeto: id,
        Local: row[1] || "",
        Nome_do_Evento: row[2] || "",
        Dia_Inicio: formatarDataGAS(row[3]),
        Dia_Fim: formatarDataGAS(row[4]),
        Rigging_Nr: row[5] || 0,
        Video_Nr: row[6] || 0,
        Som_Nr: row[7] || 0,
        Iluminacao_Nr: row[8] || 0,
        Estruturas_Nr: row[9] || 0,
        Freelancers_Nr: row[10] || 0,
        Subcontratados_Nr: row[11] || 0,
        Estacionamento_Reservado: row[12] === "TRUE" || row[12] === true,
        Status_Planeamento: row[13] || "",
        Tem_Alimentacao: idsAlim.has(id),
        Tem_Alojamento: idsAloj.has(id),
        Tem_Freelancer: idsFree.has(id),
        Tem_Subcontratado: idsSub.has(id)
      };
    });
}

function getIdsComFlag(ss, nomeSheet) {
  var ids = new Set();

  try {
    var sh = ss.getSheetByName(nomeSheet);
    if (!sh) return ids;

    var lastRow = sh.getLastRow();
    if (lastRow < 2) return ids;

    // Ler colunas A e B a partir da linha 2
    var dados = sh.getRange(2, 1, lastRow - 1, 2).getValues();

    dados.forEach(row => {
      var id = String(row[0]).trim();
      var flag = String(row[1]).trim().toUpperCase();
      if (id && flag === "TRUE") {
        ids.add(id);
      }
    });

  } catch (e) {
    // Se a sheet não existir ou der erro, devolve Set vazio
    console.warn("Aviso em getIdsComFlag para " + nomeSheet + ": " + e.message);
  }

  return ids;
}

function formatarDataGAS(valor) {
  if (!valor || valor === "") return "";

  // Se já é uma string no formato correcto, devolve como está
  if (typeof valor === "string") {
    // Já está em YYYY-MM-DD?
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
    // Tentar converter mesmo assim
    var d = new Date(valor);
    if (isNaN(d)) return valor;
    return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  // Se é um objecto Date do Sheets
  if (valor instanceof Date) {
    if (isNaN(valor.getTime())) return "";
    return Utilities.formatDate(valor, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  return "";
}


function obterProjeto(id) {
  var ss = SpreadsheetApp.openById(CONFIG.GESTAO_SHEET_ID);

  // ----------------------------------------------------------
  // 1) BUSCAR DADOS DO PROJETO
  // ----------------------------------------------------------
  var shProjetos = ss.getSheetByName("PROJETOS");
  var lastRowP = shProjetos.getLastRow();

  if (lastRowP < 2) throw new Error("Projeto não encontrado.");

  var dadosProjetos = shProjetos.getRange(2, 1, lastRowP - 1, 14).getValues();

  // Encontrar a linha do projeto
  var linhaProjeto = dadosProjetos.find(row => String(row[0]).trim().toUpperCase() === id.trim().toUpperCase());

  if (!linhaProjeto) throw new Error("Projeto não encontrado.");

  var projeto = {
    ID_Projeto: String(linhaProjeto[0]).trim(),
    Local: linhaProjeto[1] || "",
    Nome_do_Evento: linhaProjeto[2] || "",
    Dia_Inicio: formatarDataGAS(linhaProjeto[3]),
    Dia_Fim: formatarDataGAS(linhaProjeto[4]),
    Rigging_Nr: linhaProjeto[5] || 0,
    Video_Nr: linhaProjeto[6] || 0,
    Som_Nr: linhaProjeto[7] || 0,
    Iluminacao_Nr: linhaProjeto[8] || 0,
    Estruturas_Nr: linhaProjeto[9] || 0,
    Freelancers_Nr: linhaProjeto[10] || 0,
    Subcontratados_Nr: linhaProjeto[11] || 0,
    Estacionamento_Reservado: linhaProjeto[12] === "TRUE" || linhaProjeto[12] === true,
    Status_Planeamento: linhaProjeto[13] || ""
  };

  // ----------------------------------------------------------
  // 2) BUSCAR ALIMENTAÇÃO
  // ----------------------------------------------------------
  var alimentacao = [];
  var shAlim = ss.getSheetByName("ALIMENTAÇÃO");
  if (shAlim && shAlim.getLastRow() >= 2) {
    var dadosAlim = shAlim.getRange(2, 1, shAlim.getLastRow() - 1, 10).getValues();
    dadosAlim.forEach(row => {
      if (String(row[0]).trim().toUpperCase() === id.trim().toUpperCase()) {
        alimentacao.push({
          Local: row[2], Nome_Restaurante: row[3], Local_Restaurante: row[4] || "",
          Dia: formatarDataGAS(row[5]), Nr_Pessoas: row[6],
          Almoco: row[7] === "TRUE" || row[7] === true,
          Jantar: row[8] === "TRUE" || row[8] === true,
          Reservado: row[9] === "TRUE" || row[9] === true
        });
      }
    });
  }

  // ----------------------------------------------------------
  // 3) BUSCAR ALOJAMENTO
  // ----------------------------------------------------------
  var alojamento = null;
  var periodos = [];
  var shAloj = ss.getSheetByName("ALOJAMENTO");
  if (shAloj && shAloj.getLastRow() >= 2) {
    var dadosAloj = shAloj.getRange(2, 1, shAloj.getLastRow() - 1, 8).getValues();
    dadosAloj.forEach(row => {
      if (String(row[0]).trim().toUpperCase() === id.trim().toUpperCase()) {
        if (!alojamento) {
          alojamento = {
            Nome_Alojamento: row[2] || "",
            Local_Alojamento: row[3] || "",
            Alojamento_Reservado: row[7] === "TRUE" || row[7] === true
          };
        }
        periodos.push({
          Checkin: formatarDataGAS(row[4]),
          Checkout: formatarDataGAS(row[5]),
          Nr_Pessoas_Alojamento: row[6] || 0
        });
      }
    });
    if (alojamento) alojamento.periodos = periodos;
  }

  // ----------------------------------------------------------
  // 4) BUSCAR FREELANCERS
  // ----------------------------------------------------------
  var freelancers = [];
  var shFree = ss.getSheetByName("FREELANCERS");
  if (shFree && shFree.getLastRow() >= 2) {
    var dadosFree = shFree.getRange(2, 1, shFree.getLastRow() - 1, 5).getValues();
    dadosFree.forEach(row => {
      if (String(row[0]).trim().toUpperCase() === id.trim().toUpperCase()) {
        freelancers.push({
          Nome_Freelancer: row[2] || "",
          Freelancer_Confirmado: row[3] || "Em análise"
        });
      }
    });
  }

  // ----------------------------------------------------------
  // 5) BUSCAR SUBCONTRATADOS
  // ----------------------------------------------------------
  var subcontratados = [];
  var shSub = ss.getSheetByName("SUBCONTRATADOS");
  if (shSub && shSub.getLastRow() >= 2) {
    var dadosSub = shSub.getRange(2, 1, shSub.getLastRow() - 1, 5).getValues();
    dadosSub.forEach(row => {
      if (String(row[0]).trim().toUpperCase() === id.trim().toUpperCase()) {
        subcontratados.push({
          Nome_Subcontratado: row[2] || "",
          Subcontratado_Confirmado: row[3] || "Em análise"
        });
      }
    });
  }

  // ----------------------------------------------------------
  // 6) BUSCAR VIATURAS
  // ----------------------------------------------------------
  var viaturas = [];
  var shViat = ss.getSheetByName("VIATURAS");
  if (shViat && shViat.getLastRow() >= 2) {
    var dadosViat = shViat.getRange(2, 1, shViat.getLastRow() - 1, 2).getValues();
    dadosViat.forEach(row => {
      if (String(row[0]).trim().toUpperCase() === id.trim().toUpperCase()) {
        viaturas.push({
          Viatura: row[1] || ""
        });
      }
    });
  }

  // ── 7) BUSCAR EQUIPAMENTO DA SHEET ──
  var equipamento = lerEquipamentoSheet(id);

  return {
    projeto,
    alimentacao,
    alojamento,
    freelancers,
    subcontratados,
    viaturas,
    equipamento  // ← novo campo
  };
}


function atualizarProjeto(id, dados) {
  var ss = SpreadsheetApp.openById(CONFIG.GESTAO_SHEET_ID);

  // ----------------------------------------------------------
  // 1) ATUALIZAR PROJETO PRINCIPAL
  // ----------------------------------------------------------
  var shProjetos = ss.getSheetByName("PROJETOS");
  var lastRowP = shProjetos.getLastRow();

  if (lastRowP < 2) throw new Error("Projeto não encontrado.");

  // Encontrar a linha do projeto
  var ids = shProjetos.getRange(2, 1, lastRowP - 1, 1).getValues();
  var linhaIndex = -1;

  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim().toUpperCase() === id.trim().toUpperCase()) {
      linhaIndex = i + 2; // +2 porque começa na linha 2
      break;
    }
  }

  if (linhaIndex === -1) throw new Error("Projeto não encontrado.");

  // Atualizar a linha (mantém o ID original na coluna A)
  shProjetos.getRange(linhaIndex, 1, 1, 14).setValues([[
    id, // ID não muda
    dados.projeto.Local,
    dados.projeto.Nome_do_Evento,
    dados.projeto.Dia_Inicio,
    dados.projeto.Dia_Fim,
    dados.projeto.Rigging_Nr,
    dados.projeto.Video_Nr,
    dados.projeto.Som_Nr,
    dados.projeto.Iluminacao_Nr,
    dados.projeto.Estruturas_Nr,
    dados.projeto.Freelancers_Nr,
    dados.projeto.Subcontratados_Nr,
    dados.projeto.Estacionamento_Reservado ? "TRUE" : "FALSE",
    dados.projeto.Status_Planeamento
  ]]);

  // ----------------------------------------------------------
  // 2) REMOVER DADOS ANTIGOS DAS SHEETS SECUNDÁRIAS
  // ----------------------------------------------------------
  removerLinhasProjeto(ss, "ALIMENTAÇÃO", id);
  removerLinhasProjeto(ss, "ALOJAMENTO", id);
  removerLinhasProjeto(ss, "FREELANCERS", id);
  removerLinhasProjeto(ss, "SUBCONTRATADOS", id);
  removerLinhasProjeto(ss, "VIATURAS", id);

  // ----------------------------------------------------------
  // 3) INSERIR NOVOS DADOS (igual ao criarProjeto)
  // ----------------------------------------------------------

  // ALIMENTAÇÃO
  var shAlimentacao = ss.getSheetByName("ALIMENTAÇÃO");
  dados.alimentacao.forEach(reg => {
    shAlimentacao.appendRow([
      id,
      "TRUE",
      reg.Local,
      reg.Nome_Restaurante,
      reg.Local_Restaurante || "",
      reg.Dia,
      reg.Nr_Pessoas,
      reg.Almoco ? "TRUE" : "FALSE",
      reg.Jantar ? "TRUE" : "FALSE",
      reg.Reservado ? "TRUE" : "FALSE"
    ]);
  });

  // ALOJAMENTO
  if (dados.alojamento) {
    var shAlojamento = ss.getSheetByName("ALOJAMENTO");
    dados.alojamento.periodos.forEach(periodo => {
      shAlojamento.appendRow([
        id,
        "TRUE",
        dados.alojamento.Nome_Alojamento,
        dados.alojamento.Local_Alojamento,
        periodo.Checkin,
        periodo.Checkout,
        periodo.Nr_Pessoas_Alojamento,
        dados.alojamento.Alojamento_Reservado ? "TRUE" : "FALSE"
      ]);
    });
  }

  // FREELANCERS
  var shFreelancers = ss.getSheetByName("FREELANCERS");
  dados.freelancers.forEach(reg => {
    shFreelancers.appendRow([
      id,
      "TRUE",
      reg.Nome_Freelancer,
      reg.Freelancer_Confirmado,
      reg.Freelancer_Confirmado === "Confirmado" ? "TRUE" : "FALSE"
    ]);
  });

  // SUBCONTRATADOS
  var shSub = ss.getSheetByName("SUBCONTRATADOS");
  dados.subcontratados.forEach(reg => {
    shSub.appendRow([
      id,
      "TRUE",
      reg.Nome_Subcontratado,
      reg.Subcontratado_Confirmado,
      reg.Subcontratado_Confirmado === "Confirmado" ? "TRUE" : "FALSE"
    ]);
  });

  // VIATURAS
  var shViaturas = ss.getSheetByName("VIATURAS");
  dados.viaturas.forEach(reg => {
    shViaturas.appendRow([
      id,
      reg.Viatura
    ]);
  });

  try {
    // Guardar dados para o trigger ler
    PropertiesService.getScriptProperties().setProperty(
      'after_atualizar_' + id,
      JSON.stringify({ id: id, dados: dados })
    );
    // Trigger que corre 1 minuto depois (mínimo permitido)
    ScriptApp.newTrigger('_runAfterAtualizarTrigger')
      .timeBased()
      .after(1000) // 1 segundo — na prática corre logo que possível
      .create();
  } catch (e) { Logger.log('Trigger after: ' + e.message); }

  return true;
}

function removerLinhasProjeto(ss, nomeSheet, id) {
  var sh = ss.getSheetByName(nomeSheet);
  if (!sh) return;

  var lastRow = sh.getLastRow();
  if (lastRow < 2) return;

  var numCols = sh.getLastColumn();
  if (numCols < 1) return;

  // Ler cabeçalho + dados de uma vez
  var header = sh.getRange(1, 1, 1, numCols).getValues()[0];
  var dados = sh.getRange(2, 1, lastRow - 1, numCols).getValues();

  // Filtrar linhas que NÃO são do projeto a remover
  var filtradas = dados.filter(function (row) {
    return String(row[0]).trim().toUpperCase() !== id.trim().toUpperCase();
  });

  // Limpar toda a sheet e reescrever de uma vez
  sh.clearContents();
  sh.getRange(1, 1, 1, numCols).setValues([header]);

  if (filtradas.length > 0) {
    sh.getRange(2, 1, filtradas.length, numCols).setValues(filtradas);
  }
}


function gerarPDFProjeto(id) {
  var dados = obterProjeto(id);

  // Buscar logo do Drive e converter para base64
  var logoBase64 = '';
  try {
    var fileId = '1-JhwNr9xY04Zkec1HXaJr5OAACuQahAf';
    var file = DriveApp.getFileById(fileId);
    var blob = file.getBlob();
    var base64 = Utilities.base64Encode(blob.getBytes());
    var mimeType = blob.getContentType();
    logoBase64 = 'data:' + mimeType + ';base64,' + base64;
  } catch (e) {
    logoBase64 = '';
  }

  var html = construirHTMLPDF(dados, logoBase64);

  var blob = Utilities.newBlob(html, 'text/html', 'temp_projeto.html');
  var pdfFile = DriveApp.createFile(blob);
  var pdfBlob = pdfFile.getAs('application/pdf');
  var pdfBase64 = Utilities.base64Encode(pdfBlob.getBytes());

  pdfFile.setTrashed(true);

  return pdfBase64;
}

function construirHTMLPDF(dados, logoBase64) {
  var p = dados.projeto || {};
  var alim = dados.alimentacao || [];
  var aloj = dados.alojamento;
  var free = dados.freelancers || [];
  var sub = dados.subcontratados || [];
  var viat = dados.viaturas || [];
  var equip = dados.equipamento || [];

  function fmt(str) {
    if (!str) return '—';
    try {
      var d = new Date(str);
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) { return str; }
  }

  function secao(titulo, icone, conteudo) {
    return '<div class="secao">' +
      '<div class="secao-titulo"><span class="secao-icone">' + icone + '</span>' + titulo + '</div>' +
      conteudo +
      '</div>';
  }

  function pill(texto, tipo) {
    return '<span class="pill pill-' + (tipo || 'cinza') + '">' + texto + '</span>';
  }

  var statusTipo = p.Status_Planeamento === 'Finalizado' ? 'verde'
    : p.Status_Planeamento === 'Cancelado' ? 'vermelho' : 'amarelo';

  // Equipa
  var equipaChips = [
    ['Rigging', p.Rigging_Nr],
    ['Vídeo', p.Video_Nr],
    ['Som', p.Som_Nr],
    ['Iluminação', p.Iluminacao_Nr],
    ['Estruturas', p.Estruturas_Nr],
    ['Freelancers', p.Freelancers_Nr],
    ['Subcontratados', p.Subcontratados_Nr]
  ].filter(function (r) { return r[1] > 0; })
    .map(function (r) {
      return '<div class="equipa-chip"><span class="equipa-nr">' + r[1] + '</span><span class="equipa-label">' + r[0] + '</span></div>';
    }).join('');

  // Alimentação
  var alimHTML = '';
  if (alim.length > 0) {
    alimHTML = '<table class="tabela"><thead><tr><th>Local / Restaurante</th><th>Data</th><th style="text-align:center;">Pessoas</th><th>Refeições</th><th style="text-align:center;">Reservado</th></tr></thead><tbody>';
    alim.forEach(function (r) {
      var ref = [r.Almoco ? 'Almoço' : '', r.Jantar ? 'Jantar' : ''].filter(Boolean).join(', ') || '—';
      alimHTML += '<tr>' +
        '<td><strong>' + (r.Local || '—') + '</strong>' + (r.Nome_Restaurante ? '<br><span class="sub">' + r.Nome_Restaurante + '</span>' : '') + '</td>' +
        '<td>' + fmt(r.Dia) + '</td>' +
        '<td style="text-align:center;">' + (r.Nr_Pessoas || 0) + '</td>' +
        '<td>' + ref + '</td>' +
        '<td style="text-align:center;">' + (r.Reservado ? pill('✓ Sim', 'verde') : pill('Não', 'cinza')) + '</td>' +
        '</tr>';
    });
    alimHTML += '</tbody></table>';
  } else {
    alimHTML = '<p class="muted">Não configurado.</p>';
  }

  // Alojamento — estilo capa, sem tabela de info
  var alojHTML = '';
  if (aloj) {
    alojHTML =
      '<div style="margin-bottom:10px;">' +
      '<div style="font-size:13px;font-weight:700;color:#111827;">' + (aloj.Nome_Alojamento || '—') + '</div>' +
      '<div style="font-size:10.5px;color:#6b7280;margin-top:3px;">📍 ' + (aloj.Local_Alojamento || '—') + '</div>' +
      '<div style="margin-top:6px;">' + (aloj.Alojamento_Reservado ? pill('✓ Reservado', 'verde') : pill('✗ Não reservado', 'cinza')) + '</div>' +
      '</div>';
    if (aloj.periodos && aloj.periodos.length > 0) {
      alojHTML += '<table class="tabela" style="margin-top:8px;"><thead><tr><th>Check-in</th><th>Check-out</th><th style="text-align:center;">Pessoas</th></tr></thead><tbody>';
      aloj.periodos.forEach(function (periodo) {
        alojHTML += '<tr><td>' + fmt(periodo.Checkin) + '</td><td>' + fmt(periodo.Checkout) + '</td><td style="text-align:center;">' + (periodo.Nr_Pessoas_Alojamento || 0) + '</td></tr>';
      });
      alojHTML += '</tbody></table>';
    }
  } else {
    alojHTML = '<p class="muted">Não configurado.</p>';
  }

  // Freelancers
  var freeHTML = '';
  if (free.length > 0) {
    freeHTML = '<table class="tabela"><thead><tr><th>Nome</th><th>Estado</th></tr></thead><tbody>';
    free.forEach(function (f) {
      var estado = f.Freelancer_Confirmado || 'Em análise';
      var tipo = estado === 'Confirmado' ? 'verde' : estado === 'Rejeitado' ? 'vermelho' : 'amarelo';
      freeHTML += '<tr><td>' + (f.Nome_Freelancer || '—') + '</td><td>' + pill(estado, tipo) + '</td></tr>';
    });
    freeHTML += '</tbody></table>';
  } else {
    freeHTML = '<p class="muted">Não configurado.</p>';
  }

  // Subcontratados
  var subHTML = '';
  if (sub.length > 0) {
    subHTML = '<table class="tabela"><thead><tr><th>Nome</th><th>Estado</th></tr></thead><tbody>';
    sub.forEach(function (s) {
      var estado = s.Subcontratado_Confirmado || 'Em análise';
      var tipo = estado === 'Confirmado' ? 'verde' : estado === 'Rejeitado' ? 'vermelho' : 'amarelo';
      subHTML += '<tr><td>' + (s.Nome_Subcontratado || '—') + '</td><td>' + pill(estado, tipo) + '</td></tr>';
    });
    subHTML += '</tbody></table>';
  } else {
    subHTML = '<p class="muted">Não configurado.</p>';
  }

  // Viaturas
  var viatHTML = '';
  if (viat.length > 0) {
    viatHTML = '<div style="margin-bottom:8px;">' +
      pill(p.Estacionamento_Reservado ? '✓ Estacionamento reservado' : 'Estacionamento não reservado',
        p.Estacionamento_Reservado ? 'verde' : 'cinza') +
      '</div>';
    viatHTML += '<table class="tabela viat-tabela"><tbody>';
    viat.forEach(function (v) {
      viatHTML += '<tr><td>' + (v.Viatura || '—') + '</td></tr>';
    });
    viatHTML += '</tbody></table>';
  } else {
    viatHTML = '<p class="muted">Não configurado.</p>';
  }

  // Equipamento
  var equipHTML = '';
  if (equip.length > 0) {
    var grupos = {};
    var itensPorId = {};

    equip.forEach(function (l) {
  if (l.group === true) grupos[l.id] = { name: l.name, facility: l.facility || '', itens: [] };
});
    equip.forEach(function (l) {
      if (l.group === true) return;
      if (!l.parentId || l.parentId === 'undefined' || l.parentId === 'null') l.parentId = null;
      itensPorId[l.id] = l;
    });
    equip.forEach(function (l) {
      if (l.group === true || !l.parentId) return;
      var pai = itensPorId[l.parentId];
      if (pai) {
        if (!pai._pdfChildren) pai._pdfChildren = [];
        pai._pdfChildren.push(l);
      }
    });
    equip.forEach(function (l) {
      if (l.group === true || l.parentId) return;
      var g = grupos[l.rootLineId];
      if (g) g.itens.push(l);
    });

    function renderItemPDF(item, nivel) {
      nivel = nivel || 0;
      var qty = item.quantity % 1 === 0 ? parseInt(item.quantity) : item.quantity;
      var nota = (item.note || '').trim();
      var indent = 8 + nivel * 16;
      var bg = nivel > 0 ? 'background:#f9fafb;' : '';
      var prefix = '';
      if (nivel === 1) {
        prefix = '<span style="color:#d1d5db;margin-right:4px;">└</span>';
      } else if (nivel >= 2) {
        prefix = '<span style="color:#e5e7eb;margin-right:4px;">' + '&nbsp;&nbsp;'.repeat(nivel - 1) + '└</span>';
      }

      var html = '<tr>' +
        '<td style="padding-left:' + indent + 'px;padding-top:5px;padding-bottom:5px;padding-right:9px;' + bg + 'border-bottom:1px solid #f1f3f5;vertical-align:middle;color:#374151;">' + prefix + (item.name || '—') + '</td>' +
        '<td style="' + bg + 'padding:5px 9px;border-bottom:1px solid #f1f3f5;vertical-align:middle;color:#9ca3af;font-style:italic;word-break:break-all;overflow-wrap:anywhere;font-size:8.5px;">' + (nota || '—') + '</td>' +
        '<td style="' + bg + 'padding:5px 9px;border-bottom:1px solid #f1f3f5;text-align:right;font-weight:700;color:#111827;">' + qty + '</td>' +
        '</tr>';

      if (item._pdfChildren && item._pdfChildren.length > 0) {
        item._pdfChildren
          .sort(function (a, b) { return (a.ordinal || 0) - (b.ordinal || 0); })
          .forEach(function (filho) { html += renderItemPDF(filho, nivel + 1); });
      }
      return html;
    }

    Object.keys(grupos).forEach(function (gid) {
      var grupo = grupos[gid];
      if (grupo.itens.length === 0) return;
      equipHTML += '<div class="equip-grupo">';
      equipHTML += '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:0;">' +
        '<tr>' +
        '<td style="padding:7px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#CC2D22;border-top:3px solid #CC2D22;border-bottom:1px solid #e5e7eb;">' + 
  grupo.name + 
  (grupo.facility ? ' <span style="font-size:9px;font-weight:400;color:#6b7280;text-transform:none;letter-spacing:0;">📍 ' + grupo.facility + '</span>' : '') +
'</td>' +
        '<td style="padding:7px 12px;font-size:9px;color:#9ca3af;font-style:italic;text-align:right;border-top:3px solid #CC2D22;border-bottom:1px solid #e5e7eb;">' + grupo.itens.length + ' ' + (grupo.itens.length === 1 ? 'item' : 'itens') + '</td>' +
        '</tr>' +
        '</table>';
      equipHTML += '<table class="tabela equip-tabela" style="table-layout:fixed;">' +
        '<colgroup><col style="width:45%;"><col style="width:42%;"><col style="width:13%;"></colgroup>' +
        '<thead><tr bgcolor="#1f2937">' +
        '<th style="text-align:left;padding:5px 9px;font-size:9px;font-weight:700;text-transform:uppercase;color:#e5e7eb;">Nome</th>' +
        '<th style="text-align:left;padding:5px 9px;font-size:9px;font-weight:700;text-transform:uppercase;color:#e5e7eb;">Notas</th>' +
        '<th style="text-align:right;padding:5px 9px;font-size:9px;font-weight:700;text-transform:uppercase;color:#e5e7eb;">Qtd.</th>' +
        '</tr></thead><tbody>';
      grupo.itens
        .sort(function (a, b) { return (a.ordinal || 0) - (b.ordinal || 0); })
        .forEach(function (item) { equipHTML += renderItemPDF(item, 0); });
      equipHTML += '</tbody></table></div>';
    });
  }
  if (!equipHTML) equipHTML = '<p class="muted">Não configurado.</p>';

  var dataGeracao = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });

  return '<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8">' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0;}' +
    'body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#1a1a1a;background:#fff;line-height:1.4;}' +

    '.header{background:#111827;}' +
    '.header-inner{display:flex;align-items:center;justify-content:space-between;padding:10px 24px;}' +
    '.header-logo img{height:60px;display:block;}' +
    '.header-logo span{color:#fff;font-size:16px;font-weight:700;}' +
    '.doc-label{font-size:8.5px;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:right;}' +

    '.capa{background:#f9fafb;border-bottom:3px solid #CC2D22;padding:12px 24px 14px;}' +
    '.capa-id{font-size:24px;font-weight:700;color:#CC2D22;letter-spacing:-.5px;line-height:1;}' +
    '.capa-evento{font-size:13px;font-weight:600;color:#111827;margin-top:3px;}' +
    '.capa-meta{display:flex;align-items:center;gap:10px;margin-top:7px;flex-wrap:wrap;}' +
    '.capa-meta-item{display:flex;align-items:center;gap:4px;font-size:10.5px;color:#6b7280;}' +
    '.capa-meta-item strong{color:#374151;}' +
    '.capa-sep{color:#d1d5db;}' +
    '.capa-equipa{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid #e5e7eb;}' +

    '.pill{display:inline-block;padding:2px 8px;border-radius:99px;font-size:9.5px;font-weight:700;letter-spacing:.02em;}' +
    '.pill-verde{background:#dcfce7;color:#166534;}' +
    '.pill-amarelo{background:#fef9c3;color:#854d0e;}' +
    '.pill-vermelho{background:#fee2e2;color:#991b1b;}' +
    '.pill-cinza{background:#f3f4f6;color:#6b7280;}' +

    '.content{padding:12px 24px 20px;}' +

    '.secao{margin-bottom:14px;page-break-inside:avoid;}' +
    '.secao-titulo{display:flex;align-items:center;gap:6px;font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#CC2D22;padding-bottom:4px;border-bottom:2px solid #CC2D22;margin-bottom:8px;}' +
    '.secao-icone{font-size:12px;}' +

    '.tabela{width:100%;border-collapse:collapse;font-size:10.5px;}' +
    '.tabela thead tr{background:#111827;}' +
    '.tabela th{text-align:left;padding:5px 9px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#e5e7eb;border:none;}' +
    '.tabela td{padding:5px 9px;border-bottom:1px solid #f1f3f5;vertical-align:middle;color:#374151;}' +
    '.tabela tbody tr:last-child td{border-bottom:none;}' +
    '.tabela tbody tr:nth-child(even) td{background:#f9fafb;}' +
    '.sub{font-size:9.5px;color:#9ca3af;}' +

    '.viat-tabela thead{display:none;}' +

    '.equipa-chip{background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:5px 12px;display:inline-flex;align-items:center;gap:7px;box-shadow:0 1px 2px rgba(0,0,0,.04);}' +
    '.equipa-nr{font-size:15px;font-weight:700;color:#CC2D22;line-height:1;}' +
    '.equipa-label{font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;}' +

    '.equip-grupo{margin-bottom:12px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;}' +
    '.equip-grupo-header{display:flex;align-items:center;justify-content:space-between;background:#CC2D22;padding:7px 12px;}' +
    '.equip-grupo-nome{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#ffffff;}' +
    '.equip-grupo-count{font-size:9px;color:#fecaca;font-style:italic;}' +
    '.equip-tabela td{padding:5px 12px;border-bottom:1px solid #f1f3f5;font-size:10.5px;}' +
    '.equip-tabela tbody tr:last-child td{border-bottom:none;}' +
    '.equip-tabela tbody tr:nth-child(even) td{background:#f9fafb;}' +

    '.muted{color:#9ca3af;font-style:italic;font-size:10.5px;}' +

    '.footer{background:#f9fafb;border-top:1px solid #e5e7eb;padding:8px 24px;display:flex;align-items:center;justify-content:space-between;}' +
    '.footer-left{font-size:8.5px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:.07em;}' +
    '.footer-right{font-size:8.5px;color:#9ca3af;}' +
    '.footer-accent{color:#CC2D22;font-weight:700;}' +

    '</style></head><body>' +

    // HEADER
    '<div class="header"><div class="header-inner">' +
    '<div class="header-logo">' +
    (logoBase64 ? '<img src="' + logoBase64 + '">' : '<span>Rise — Gestão de Projetos</span>') +
    '</div>' +
    '<div><div class="doc-label">Documento de Projeto</div></div>' +
    '</div></div>' +

    // CAPA
    '<div class="capa">' +
    '<div class="capa-id">' + (p.ID_Projeto || '—') + '</div>' +
    (p.Nome_do_Evento ? '<div class="capa-evento">' + p.Nome_do_Evento + '</div>' : '') +
    '<div class="capa-meta">' +
    (p.Local ? '<div class="capa-meta-item">📍 <strong>' + p.Local + '</strong></div><span class="capa-sep">·</span>' : '') +
    '<div class="capa-meta-item">📅 <strong>' + fmt(p.Dia_Inicio) + '</strong> → <strong>' + fmt(p.Dia_Fim) + '</strong></div>' +
    '<span class="capa-sep">·</span>' +
    '<div class="capa-meta-item"><span class="pill pill-' + statusTipo + '">' + (p.Status_Planeamento || '—') + '</span></div>' +
    '</div>' +
    (equipaChips ? '<div class="capa-equipa">' + equipaChips + '</div>' : '') +
    '</div>' +

    // CONTEÚDO
    '<div class="content">' +

    secao('Alimentação', '🍽️', alimHTML) +
    secao('Alojamento', '🏨', alojHTML) +
    secao('Freelancers', '👤', freeHTML) +
    secao('Subcontratados', '🏢', subHTML) +
    secao('Viaturas', '🚐', viatHTML) +
    secao('Equipamento', '🎛️', equipHTML) +

    '</div>' +

    // FOOTER
    '<div class="footer">' +
    '<div class="footer-left"><span class="footer-accent">Rise</span> — Gestão de Projetos</div>' +
    '<div class="footer-right">Documento gerado automaticamente em ' + dataGeracao + '</div>' +
    '</div>' +

    '</body></html>';
}


function eliminarProjeto(id) {
  var ss = SpreadsheetApp.openById(CONFIG.GESTAO_SHEET_ID);

  // Apagar da sheet principal PROJETOS
  var shProjetos = ss.getSheetByName("PROJETOS");
  if (!shProjetos) throw new Error("Sheet PROJETOS não encontrada.");

  var lastRow = shProjetos.getLastRow();
  if (lastRow < 2) throw new Error("Projeto não encontrado: " + id);

  var ids = shProjetos.getRange(2, 1, lastRow - 1, 1).getValues();
  var encontrado = false;

  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
      shProjetos.deleteRow(i + 2);
      encontrado = true;
      break;
    }
  }

  if (!encontrado) throw new Error("Projeto não encontrado: " + id);

  // Apagar de todas as sheets secundárias (reutiliza o helper já existente)
  removerLinhasProjeto(ss, "ALIMENTAÇÃO", id);
  removerLinhasProjeto(ss, "ALOJAMENTO", id);
  removerLinhasProjeto(ss, "FREELANCERS", id);
  removerLinhasProjeto(ss, "SUBCONTRATADOS", id);
  removerLinhasProjeto(ss, "VIATURAS", id);
  removerLinhasProjeto(ss, "EQUIPAMENTO", id);  // ← adicionar esta linha

  return true;
}

function pesquisarLocalizacao(query) {
  var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' +
    encodeURIComponent(query) + '&limit=3&addressdetails=0&accept-language=pt';
  var response = UrlFetchApp.fetch(url, {
    headers: { 'User-Agent': 'RiseGestao/1.0' }
  });
  return response.getContentText();
}


function obterEquipamentoFlex(numeroProjeto) {
  var headers = {
    'X-Auth-Token': FLEX_TOKEN,
    'Accept': 'application/json'
  };

  // ── PASSO 1: Buscar o ID interno do Flex ──
  var urlSearch = 'https://europalco.flexrentalsolutions.com/f5/api/search/single-result'
    + '?numberString=' + encodeURIComponent(numeroProjeto);

  var respSearch = UrlFetchApp.fetch(urlSearch, {
    method: 'GET',
    headers: headers,
    muteHttpExceptions: true
  });

  if (respSearch.getResponseCode() !== 200) {
    throw new Error('Flex (pesquisa): HTTP ' + respSearch.getResponseCode()
      + ' — ' + respSearch.getContentText());
  }

  var jsonSearch = JSON.parse(respSearch.getContentText());
  var flexId = jsonSearch && jsonSearch.id ? jsonSearch.id : null;
  if (!flexId) throw new Error('Projeto "' + numeroProjeto + '" não encontrado no Flex.');

  // ── PASSO 2: Buscar a árvore do elemento e extrair o nodeID do financial-document ──
  var urlTree = 'https://europalco.flexrentalsolutions.com/f5/api/element/'
    + encodeURIComponent(flexId) + '/tree';

  var respTree = UrlFetchApp.fetch(urlTree, {
    method: 'GET',
    headers: headers,
    muteHttpExceptions: true
  });

  if (respTree.getResponseCode() !== 200) {
    throw new Error('Flex (tree): HTTP ' + respTree.getResponseCode()
      + ' — ' + respTree.getContentText());
  }

  var treeData = JSON.parse(respTree.getContentText());

  // Percorrer recursivamente a árvore à procura do nó com
  // domainId = "financial-document" e documentNumber = numeroProjeto
  function encontrarNodeId(nodes, numeroAlvo) {
    if (!Array.isArray(nodes)) return null;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (
        node.domainId === 'financial-document' &&
        node.documentNumber === numeroAlvo
      ) {
        return node.nodeId || node.id || null;
      }
      // Verificar filhos recursivamente (estrutura pode variar)
      var filhos = node.children || node.nodes || node.items || [];
      var encontrado = encontrarNodeId(filhos, numeroAlvo);
      if (encontrado) return encontrado;
    }
    return null;
  }

  // A resposta pode ser um array ou um objeto com nós dentro
  var treeNodes = Array.isArray(treeData) ? treeData : (treeData.children || treeData.nodes || [treeData]);
  var financialNodeId = encontrarNodeId(treeNodes, numeroProjeto);

  // Se não encontrar o nodeID, usar o flexId original como fallback
  var nodeId = financialNodeId || flexId;

  // ── PASSO 3: Tentar financial-document-line-item ──
  var urlFinancial = 'https://europalco.flexrentalsolutions.com/f5/api/financial-document-line-item/'
    + encodeURIComponent(nodeId)
    + '/row-data/?codeList=conflict&codeList=type&codeList=quantity&codeList=name&codeList=note&codeList=timeQty&codeList=warehouseMute&node=root';

  var respFinancial = UrlFetchApp.fetch(urlFinancial, {
    method: 'GET',
    headers: headers,
    muteHttpExceptions: true
  });

  var rawFinancial = [];
  if (respFinancial.getResponseCode() === 200) {
    var parsed = JSON.parse(respFinancial.getContentText());
    if (Array.isArray(parsed)) rawFinancial = parsed;
    else if (Array.isArray(parsed.rows)) rawFinancial = parsed.rows;
    else if (Array.isArray(parsed.items)) rawFinancial = parsed.items;
    else if (Array.isArray(parsed.data)) rawFinancial = parsed.data;
  }

  var temResultados = rawFinancial.length > 0;

  if (temResultados) {
    return _parsearFinancialDocument(rawFinancial);
  }

  // ── PASSO 4: Fallback para line-item (lógica antiga) ──
  var urlItems = 'https://europalco.flexrentalsolutions.com/f5/api/line-item/'
    + encodeURIComponent(nodeId)
    + '/row-data/?codeList=conflict&codeList=quantity&codeList=name&codeList=note&node=root';

  var respItems = UrlFetchApp.fetch(urlItems, {
    method: 'GET',
    headers: headers,
    muteHttpExceptions: true
  });

  if (respItems.getResponseCode() !== 200) {
    throw new Error('Flex (equipamento): HTTP ' + respItems.getResponseCode()
      + ' — ' + respItems.getContentText());
  }

  var raw = JSON.parse(respItems.getContentText());
  var topLevel = [];
  if (Array.isArray(raw)) topLevel = raw;
  else if (Array.isArray(raw.rows)) topLevel = raw.rows;
  else if (Array.isArray(raw.items)) topLevel = raw.items;
  else if (Array.isArray(raw.data)) topLevel = raw.data;

  return _parsearLineItem(topLevel);
}


// ── Parser para financial-document-line-item ──
function _parsearFinancialDocument(topLevel) {
  var resultado = [];

  topLevel.forEach(function (categoria) {
    if (categoria.subtotalType && categoria.subtotalType !== 'header') return;
    if (!categoria.name || !categoria.children) return;

    var grupoId = categoria.id || '';
    var grupoNome = (categoria.name || '').trim();

    resultado.push({
  id: grupoId,
  rootLineId: grupoId,
  parentId: null,
  ordinal: categoria.ordinal || 0,
  name: grupoNome,
  facility: (categoria.subtotalFacility && categoria.subtotalFacility.name) ? categoria.subtotalFacility.name.trim() : '',
  group: true,
  leaf: false,
  quantity: 0,
  note: ''
});

    _extrairItensFinancial(categoria.children, grupoId, null, resultado);
  });

  return resultado;
}

function _extrairItensFinancial(children, grupoId, parentId, resultado) {
  if (!children || !Array.isArray(children)) return;

  children.forEach(function (item) {
    if (item.subtotal === true) return;
    if (item.lineItemType === 'subtotal') return;
    if (item.lineItemType === 'call-time') return;

    if (item.name) {
      resultado.push({
        id: item.id || '',
        rootLineId: grupoId,
        parentId: parentId,       // ← null se filho direto da categoria, id do pai se sub-item
        ordinal: item.ordinal || 0,
        name: (item.name || '').trim(),
        group: false,
        leaf: item.leaf === true,
        quantity: Math.round(item.quantity || 0),
        note: (item.note || '').trim()
      });

      // Se tem children, processa-os com este item como pai
      if (item.children && Array.isArray(item.children)) {
        _extrairItensFinancial(item.children, grupoId, item.id, resultado);
      }
    }
  });
}


// ── Parser para line-item (lógica antiga, mantida) ──
function _parsearLineItem(topLevel) {
  var resultado = [];

  topLevel.forEach(function (item) {
    resultado.push({
      id: item.id || '',
      rootLineId: item.rootLineId || '',
      ordinal: item.ordinal || 0,
      name: item.name || '',
      group: item.group === true,
      leaf: item.leaf === true,
      quantity: Math.round(item.quantity || 0),
      note: (item.note || '').trim()
    });

    if (item.children && Array.isArray(item.children)) {
      item.children.forEach(function (child) {
        resultado.push({
          id: child.id || '',
          rootLineId: child.rootLineId || '',
          ordinal: child.ordinal || 0,
          name: child.name || '',
          group: child.group === true,
          leaf: child.leaf === true,
          quantity: Math.round(child.quantity || 0),
          note: (child.note || '').trim()
        });
      });
    }
  });

  return resultado;
}

/* =========================================================
   EQUIPAMENTO — Gravar / Ler / Atualizar da sheet
   ========================================================= */

// Gravar equipamento na sheet (apaga anterior e insere novo)
function gravarEquipamentoFlex(idProjeto, linhas) {
  var ss = SpreadsheetApp.openById(CONFIG.GESTAO_SHEET_ID);
  var sh = ss.getSheetByName("EQUIPAMENTO");
  if (!sh) {
    sh = ss.insertSheet("EQUIPAMENTO");
    sh.appendRow(["ID_Projeto", "grupo_id", "grupo_nome", "item_id", "item_nome", "quantidade", "ordinal", "nota", "parent_id", "facility"]);
  }

  removerLinhasProjeto(ss, "EQUIPAMENTO", idProjeto);

  var grupos = {};
  var gruposFacility = {};
  linhas.forEach(function (l) {
    if (l.group === true) {
      grupos[l.id] = l.name;
      gruposFacility[l.id] = l.facility || '';
    }
  });

  linhas.forEach(function (l) {
    if (l.group === true) return;
    sh.appendRow([
      idProjeto,
      l.rootLineId || "",
      grupos[l.rootLineId] || "Outros",
      l.id || "",
      l.name || "",
      l.quantity || 0,
      l.ordinal || 0,
      l.note || "",
      l.parentId || "",
      gruposFacility[l.rootLineId] || ""
    ]);
  });

  return true;
}

// Ler equipamento guardado na sheet
function lerEquipamentoSheet(idProjeto) {
  var ss = SpreadsheetApp.openById(CONFIG.GESTAO_SHEET_ID);
  var sh = ss.getSheetByName("EQUIPAMENTO");
  if (!sh || sh.getLastRow() < 2) return [];

  var dados = sh.getRange(2, 1, sh.getLastRow() - 1, 10).getValues(); // ← 10 colunas
  var grupos = [];
  var gruposVistos = {};
  var itensPorGrupo = {};

  dados.forEach(function (row) {
    if (String(row[0]).trim().toUpperCase() !== idProjeto.trim().toUpperCase()) return;

    var grupoId = String(row[1]).trim() || 'outros';
    var grupoNome = String(row[2]).trim() || 'Outros';
    if (grupoNome === 'Outros') grupoId = '__outros__';

    if (!gruposVistos[grupoId]) {
      gruposVistos[grupoId] = true;
      itensPorGrupo[grupoId] = [];
      grupos.push({
  id: grupoId, rootLineId: grupoId, name: grupoNome,
  facility: String(row[9] || '').trim(),
  group: true, leaf: false, quantity: 0, ordinal: 0
});
    }

    itensPorGrupo[grupoId].push({
      id: String(row[3]),
      rootLineId: grupoId,
      parentId: String(row[8]) || null,   // ← coluna 9
      name: String(row[4]),
      group: false,
      leaf: true,
      quantity: Number(row[5]) || 0,
      ordinal: Number(row[6]) || 0,
      note: String(row[7]) || ""
    });
  });

  var final = [];
  grupos.forEach(function (grupo) {
    final.push(grupo);
    (itensPorGrupo[grupo.id] || [])
      .sort(function (a, b) { return (a.ordinal || 0) - (b.ordinal || 0); })
      .forEach(function (item) { final.push(item); });
  });

  return final;
}

// Carregar do Flex, gravar na sheet, e devolver os dados
function carregarEGravarEquipamentoFlex(idProjeto) {
  var linhas = obterEquipamentoFlex(idProjeto); // já existente
  gravarEquipamentoFlex(idProjeto, linhas);
  return linhas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RISE — INTEGRAÇÃO PORTAL → DRIVE + CALENDAR + EMAIL
// Adicionar ao Code.gs existente (no fim, sem alterar nada do que já existe)
//
// ÚNICO passo necessário na função criarProjeto() já existente:
// Adicionar esta linha antes do "return true" final:
//
//   try { _afterCriarProjeto(dados); } catch(e) { Logger.log('afterCriar: ' + e.message); }
//
// ═══════════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────────────────
// ⚙️  CONFIGURAÇÃO
// ─────────────────────────────────────────────────────────────────────────────
var CONFIG_AFTER = {

  // IDs das pastas no Google Drive
  PASTA_ATIVOS: "170Rxxjwf3JSYSg3HFsEuIqBqypPO3QCL",
  PASTA_CONCLUIDOS: "1vUsd_y-vloAhSZwrWU6WyKl5c-kjIVQ_",

  // ID do ficheiro template a copiar para cada projeto
  SHEET_TEMPLATE_ID: "1ufwiaqw-Q4ZF-20BOOvhxorV1tCg9BjSY63pFp1kjBc",

  ABA_FICHA: "📋 FICHA DO PROJETO",
  ABA_EQUIPAMENTO: "🎛️ EQUIPAMENTO FLEX",
  ABA_ALIMENTACAO: "🍽️ ALIMENTAÇÃO",
  ABA_ALOJAMENTO: "🏨 ALOJAMENTO",
  ABA_FREELANCERS: "👤 FREELANCERS",
  ABA_SUBCONTR: "🏢 SUBCONTRATADOS",

  // Google Calendar
  CALENDAR_ID: "l0b3fuhm3vma069hkf8eot9qnikcfg7c",

  // Emails da equipa (arranque do projeto)
  EMAIL_DIR_TECNICO: "nuno.cavaco@rise.pt",
  EMAIL_DIR_OPERACOES: "david.fernandes@rise.pt",
  EMAIL_COMPRAS: "ruben.matos@rise.pt",
};


// ─────────────────────────────────────────────────────────────────────────────
// 🚀  PONTO DE ENTRADA
// Chamado automaticamente no fim de criarProjeto()
// ─────────────────────────────────────────────────────────────────────────────
function _afterCriarProjeto(dados) {
  var p = dados.projeto;

  var dadosEvento = {
    nomeEvento: p.Nome_do_Evento || "",
    dataMontagem: p.Dia_Inicio || "",
    dataEvento: p.Dia_Inicio || "",
    horaInicio: "09:00",
    dataDesmont: p.Dia_Fim || "",
    local: p.Local || "",
  };

  // 1) Criar pastas no Drive + copiar template
  var resultado = { link: "", fileId: null };
  try {
    resultado = _after_criarPastasNoDrive(p.ID_Projeto, dadosEvento);
  } catch (err) {
    Logger.log("_afterCriarProjeto — Drive: " + err.message);
  }

  // 2) Preencher template — usa o fileId direto, sem procurar
  if (resultado.fileId) {
    try {
      var ss = SpreadsheetApp.openById(resultado.fileId);
      _after_preencherTemplateSS(ss, dados);
    } catch (e) {
      Logger.log("_after_preencherTemplate: " + e.message);
    }
  }

  // 3) Criar eventos + prazos no Calendar
  try {
    _after_criarEventosCalendar(p.ID_Projeto, dadosEvento);
  } catch (err) {
    Logger.log("_afterCriarProjeto — Calendar: " + err.message);
  }

  // 4) Enviar email de arranque
  try {
    _after_enviarEmailArranque(p.ID_Projeto, dadosEvento, resultado.link);
  } catch (err) {
    Logger.log("_afterCriarProjeto — Email: " + err.message);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 📁  GOOGLE DRIVE — criar estrutura de pastas + copiar template
// ─────────────────────────────────────────────────────────────────────────────
function _after_criarPastasNoDrive(projId, dados) {
  var nomePasta = projId + (dados.nomeEvento ? "_" + dados.nomeEvento : "");
  var pastaAtivos = DriveApp.getFolderById(CONFIG_AFTER.PASTA_ATIVOS);

  var iter = pastaAtivos.getFoldersByName(nomePasta);
  if (iter.hasNext()) {
    var pastaExistente = iter.next();
    // Tentar encontrar o ficheiro já existente
    var iterF = pastaExistente.getFilesByName(projId + (dados.nomeEvento ? "_" + dados.nomeEvento : ""));
    return {
      link: "https://drive.google.com/drive/folders/" + pastaExistente.getId(),
      fileId: iterF.hasNext() ? iterF.next().getId() : null
    };
  }

  var pastaProjeto = pastaAtivos.createFolder(nomePasta);

  var refs = {};
  ["01_Layout", "02_Conteudos", "03_Grafica", "04_Freelancers", "05_Briefings", "06_Pos_Evento"]
    .forEach(function (nome) { refs[nome] = pastaProjeto.createFolder(nome); });

  refs["02_Conteudos"].createFolder("Recebidos");
  refs["02_Conteudos"].createFolder("Validados");
  refs["02_Conteudos"].createFolder("Backup");
  refs["03_Grafica"].createFolder("Artes_Finais");
  refs["03_Grafica"].createFolder("Enviado_Fornecedor");
  refs["03_Grafica"].createFolder("Entregue_Confirmado");

  var fileId = null;
  try {
    var templateFile = DriveApp.getFileById(CONFIG_AFTER.SHEET_TEMPLATE_ID);
    var nomeNovo = projId + (dados.nomeEvento ? "_" + dados.nomeEvento : "");
    var copia = templateFile.makeCopy(nomeNovo, pastaProjeto);
    fileId = copia.getId(); // ← ID direto, sem precisar de procurar
  } catch (err) {
    Logger.log("_after_criarPastasNoDrive — template: " + err.message);
  }

  return {
    link: "https://drive.google.com/drive/folders/" + pastaProjeto.getId(),
    fileId: fileId
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 📅  GOOGLE CALENDAR — eventos de montagem/evento/desmontagem + prazos
// ─────────────────────────────────────────────────────────────────────────────
function _after_criarEventosCalendar(projId, dados) {
  var calendar = CalendarApp.getCalendarById(CONFIG_AFTER.CALENDAR_ID);
  if (!calendar) {
    Logger.log("_after_criarEventosCalendar — calendar não encontrado: " + CONFIG_AFTER.CALENDAR_ID);
    return;
  }

  var descBase = "Projeto: " + projId + "\nEvento: " + dados.nomeEvento + "\nLocal: " + (dados.local || "—");

  // Converter string de data (YYYY-MM-DD ou DD/MM/YYYY) para Date
  function toDate(str, hora) {
    if (!str) return null;
    var iso = str;
    if (str.indexOf("/") !== -1) {
      var partes = str.split("/");
      if (partes.length === 3) iso = partes[2] + "-" + partes[1] + "-" + partes[0];
    }
    var d = new Date(iso + "T" + (hora || "08:00") + ":00");
    return isNaN(d.getTime()) ? null : d;
  }

  function criarEvento(titulo, inicio, horaFimH, horaFimM, opts) {
    if (!inicio) return;
    var fim = new Date(inicio);
    fim.setHours(horaFimH, horaFimM, 0);
    try {
      calendar.createEvent(titulo, inicio, fim, opts || {});
    } catch (e) {
      Logger.log("criarEvento: " + e.message);
    }
  }

  // Eventos principais
  criarEvento(
    "[" + projId + "] 🏗️ MONTAGEM — " + dados.nomeEvento,
    toDate(dados.dataMontagem, "08:00"), 23, 59,
    { description: descBase, location: dados.local }
  );
  criarEvento(
    "[" + projId + "] ⭐ EVENTO — " + dados.nomeEvento,
    toDate(dados.dataEvento, dados.horaInicio || "09:00"), 23, 59,
    { description: descBase, location: dados.local }
  );
  criarEvento(
    "[" + projId + "] 🔧 DESMONTAGEM — " + dados.nomeEvento,
    toDate(dados.dataDesmont, "08:00"), 23, 59,
    { description: descBase, location: dados.local }
  );

  // Prazos automáticos relativos à data do evento
  var dtEvento = toDate(dados.dataEvento, "09:00");
  if (!dtEvento) return;

  var prazos = [
    { dias: -20, emoji: "📐", label: "Verificação técnica do espaço" },
    { dias: -18, emoji: "📐", label: "Layout Vectorworks v1" },
    { dias: -15, emoji: "✅", label: "Aprovação layout com cliente" },
    { dias: -14, emoji: "👥", label: "Enviar convites CrewBrain" },
    { dias: -12, emoji: "🖨️", label: "Encomendas gráfica" },
    { dias: -10, emoji: "🎬", label: "Solicitar conteúdos ao cliente" },
    { dias: -7, emoji: "✔️", label: "Validar formatos de conteúdos" },
    { dias: -5, emoji: "📋", label: "Briefing completo à equipa" },
    { dias: -2, emoji: "🚨", label: "Checklist final 48h" },
  ];

  prazos.forEach(function (a) {
    var dt = new Date(dtEvento);
    dt.setDate(dt.getDate() + a.dias);
    dt.setHours(9, 0, 0);
    var fim = new Date(dt);
    fim.setMinutes(30);
    try {
      calendar.createEvent(
        "[" + projId + "] " + a.emoji + " PRAZO — " + a.label,
        dt, fim,
        { description: "Prazo: " + a.label + "\nProjeto: " + projId + " — " + dados.nomeEvento }
      );
    } catch (e) {
      Logger.log("prazo calendar: " + e.message);
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 📧  EMAIL DE ARRANQUE
// ─────────────────────────────────────────────────────────────────────────────
function _after_enviarEmailArranque(projId, dados, linkPasta) {
  var destinatarios = [
    CONFIG_AFTER.EMAIL_DIR_TECNICO,
    CONFIG_AFTER.EMAIL_DIR_OPERACOES,
    CONFIG_AFTER.EMAIL_COMPRAS
  ].filter(function (e) { return e && e.indexOf("@") !== -1; }).join(",");

  if (!destinatarios) return;

  GmailApp.sendEmail(
    destinatarios,
    "[" + projId + "] Arranque — " + dados.nomeEvento,
    "Olá,\n\n" +
    "Foi criado um novo projeto no Portal RISE.\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
    "📋 ID          : " + projId + "\n" +
    "📌 EVENTO      : " + dados.nomeEvento + "\n" +
    "📍 LOCAL       : " + (dados.local || "A confirmar") + "\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
    "📅 MONTAGEM    : " + (dados.dataMontagem || "A confirmar") + "\n" +
    "📅 EVENTO      : " + (dados.dataEvento || "A confirmar") + "\n" +
    "📅 DESMONTAGEM : " + (dados.dataDesmont || "A confirmar") + "\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
    (linkPasta ? "📁 Pasta Drive: " + linkPasta + "\n\n" : "") +
    "Email gerado automaticamente pelo Portal RISE."
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// RISE — PREENCHER TEMPLATE SHEET COM DADOS DO PROJETO
// Adicionar ao Code.gs existente (no fim)
//
// ATIVAR: na função _afterCriarProjeto(), depois de _after_criarPastasNoDrive(),
// adicionar:
//
//   try { _after_preencherTemplate(p.ID_Projeto, dadosEvento, dados, linkPasta); }
//   catch(e) { Logger.log('_after_preencherTemplate: ' + e.message); }
//
// ═══════════════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS DE ESCRITA / FORMATAÇÃO
// ═══════════════════════════════════════════════════════════════════════════════

// Escreve cabeçalhos na linha 3, formatados
function _template_escreverCabecalho(sheet, colunas) {
  var range = sheet.getRange(3, 1, 1, colunas.length);
  range.setValues([colunas]);
  range
    .setBackground("#0F6FBF")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("center");
  sheet.setFrozenRows(3);
}

// Escreve dados a partir da linha 4
function _template_escreverDados(sheet, linhas) {
  if (!linhas || linhas.length === 0) return;
  sheet.getRange(4, 1, linhas.length, linhas[0].length).setValues(linhas);
}

// Aplica formatação alternada às linhas de dados
function _template_formatarTabela(sheet, nrLinhas, nrColunas) {
  for (var i = 0; i < nrLinhas; i++) {
    var row = 4 + i;
    var bg = i % 2 === 0 ? "#F9FAFB" : "#FFFFFF";
    sheet.getRange(row, 1, 1, nrColunas)
      .setBackground(bg)
      .setFontSize(10)
      .setVerticalAlignment("middle")
      .setBorder(false, false, true, false, false, false, "#E5E7EB", SpreadsheetApp.BorderStyle.SOLID);
  }
}

// Colore a coluna de estados (Confirmado=verde, Rejeitado=vermelho, Em análise=amarelo)
function _template_colorirEstados(sheet, nrLinhas, coluna) {
  for (var i = 0; i < nrLinhas; i++) {
    var cell = sheet.getRange(4 + i, coluna);
    var val = String(cell.getValue()).trim();
    if (val === "Confirmado") {
      cell.setBackground("#DCFCE7").setFontColor("#166534").setFontWeight("bold");
    } else if (val === "Rejeitado") {
      cell.setBackground("#FEE2E2").setFontColor("#991B1B").setFontWeight("bold");
    } else {
      cell.setBackground("#FEF9C3").setFontColor("#854D0E").setFontWeight("bold");
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EQUIPAMENTO FLEX — tabela com grupos coloridos igual ao Portal
// ═══════════════════════════════════════════════════════════════════════════════
function _template_escreverEquipamento(sheet, linhas) {
  var BORDA = "#B8D4E8";
  var bordaThin = SpreadsheetApp.BorderStyle.SOLID;

  var grupos = {};
  var itensPorGrupo = {};

  linhas.forEach(function (l) {
    if (l.group === true) {
      grupos[l.id] = l.name;
      itensPorGrupo[l.id] = [];
    }
  });
  linhas.forEach(function (l) {
    if (l.group === true) return;
    if (!l.parentId || l.parentId === "undefined" || l.parentId === "null") l.parentId = null;
  });
  linhas.forEach(function (l) {
    if (l.group === true || l.parentId) return;
    if (itensPorGrupo[l.rootLineId]) itensPorGrupo[l.rootLineId].push(l);
  });

  var rowAtual = 3; // ← CORREÇÃO: era 4

  Object.keys(grupos).forEach(function (gid) {
    var nomeGrupo = grupos[gid];
    var itens = itensPorGrupo[gid] || [];
    if (itens.length === 0) return;

    // ── Linha do grupo ──
    var rangeGrupo = sheet.getRange(rowAtual, 1, 1, 3);
    rangeGrupo
      .merge()
      .setBackground("#1A7A4A")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setFontFamily("Arial")
      .setFontSize(11)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setWrap(true)
      .setBorder(true, true, true, true, null, null, BORDA, bordaThin);
    var facilityLinhas = linhas.filter(function(l) { return l.group === true && l.id === gid; });
var facilityLabel = (facilityLinhas.length > 0 && facilityLinhas[0].facility) ? ' 📍 ' + facilityLinhas[0].facility : '';
sheet.getRange(rowAtual, 1).setValue(nomeGrupo + facilityLabel);
    sheet.setRowHeight(rowAtual, 30);
    rowAtual++;

    // ── Cabeçalho dentro da secção ──
    var cabecalho = ["Nome do Item", "Notas", "Quantidade"];
    sheet.getRange(rowAtual, 1, 1, 3)
      .setValues([cabecalho])
      .setBackground("#0F6FBF")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setFontFamily("Arial")
      .setFontSize(10)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setWrap(true)
      .setBorder(true, true, true, true, true, true, BORDA, bordaThin);
    sheet.setRowHeight(rowAtual, 30);
    rowAtual++;

    var itemCount = 0;

    function escreverItem(item, nivel) {
      var indent = nivel > 0 ? "    ".repeat(nivel) + "└ " : "";
      var qty = item.quantity % 1 === 0 ? parseInt(item.quantity) : item.quantity;
      var bg = itemCount % 2 === 0 ? "#FFFFFF" : "#f0f7ff";

      sheet.getRange(rowAtual, 1).setValue(indent + (item.name || ""));
      sheet.getRange(rowAtual, 2).setValue(item.note || "");
      sheet.getRange(rowAtual, 3).setValue(qty);

      sheet.getRange(rowAtual, 1, 1, 3)
        .setBackground(bg)
        .setFontFamily("Arial")
        .setFontSize(10)
        .setFontColor("#000000")
        .setVerticalAlignment("middle")
        .setWrap(true)                    // ← adicionar
        .setBorder(true, true, true, true, true, true, BORDA, bordaThin);

      sheet.getRange(rowAtual, 3)
        .setFontWeight("bold")
        .setHorizontalAlignment("center");

      rowAtual++;
      itemCount++;

      var filhos = linhas.filter(function (l) {
        return !l.group && l.parentId === item.id;
      }).sort(function (a, b) { return (a.ordinal || 0) - (b.ordinal || 0); });

      filhos.forEach(function (filho) { escreverItem(filho, nivel + 1); });
    }

    itens
      .sort(function (a, b) { return (a.ordinal || 0) - (b.ordinal || 0); })
      .forEach(function (item) { escreverItem(item, 0); });
  });

  sheet.setColumnWidth(1, 400);
  sheet.setColumnWidth(2, 350);
  sheet.setColumnWidth(3, 100);
}

function _afterAtualizarProjeto(id, dados) {
  var p = dados.projeto;
  var dadosEvento = {
    nomeEvento: p.Nome_do_Evento || "",
    dataMontagem: p.Dia_Inicio || "",
    dataEvento: p.Dia_Inicio || "",
    horaInicio: "09:00",
    dataDesmont: p.Dia_Fim || "",
    local: p.Local || "",
  };

  var resultado = { link: "", fileId: null };
  try {
    resultado = _after_criarPastasNoDrive(id, dadosEvento);
  } catch (err) {
    Logger.log("_afterAtualizarProjeto — Drive: " + err.message);
    return;
  }

  if (!resultado.fileId) {
    Logger.log("_afterAtualizarProjeto — fileId não disponível");
    return;
  }

  // Reler equipamento da sheet neste momento (já foi gravado pelo atualizarProjeto)
  try {
    dados.equipamento = lerEquipamentoSheet(id);
  } catch (e) {
    Logger.log("_afterAtualizarProjeto — lerEquipamento: " + e.message);
  }

  try {
    var ss = SpreadsheetApp.openById(resultado.fileId);
    _after_preencherTemplateSS(ss, dados);
  } catch (e) {
    Logger.log("_afterAtualizarProjeto — preencherTemplate: " + e.message);
  }
}


// Limpa dados a partir da linha 3 (mantém linhas 1 e 2 intactas)
function _template_limparDados(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow >= 3) {
    sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent().clearFormat();
  }
}


function _after_preencherTemplateSS(ss, dadosCompletos) {
  var p = dadosCompletos.projeto;

  // ── FICHA DO PROJETO ──
  var shFicha = ss.getSheetByName(CONFIG_AFTER.ABA_FICHA);
  if (shFicha) {
    shFicha.getRange("B4").setValue(p.ID_Projeto || "");
    shFicha.getRange("B5").setValue(p.Nome_do_Evento || "");
    shFicha.getRange("B6").setValue(p.Dia_Inicio || "");
    shFicha.getRange("H4").setValue(p.Status_Planeamento || "");
    shFicha.getRange("H5").setValue(p.Local || "");
    shFicha.getRange("H6").setValue(p.Dia_Fim || "");
    shFicha.getRange("B15").setValue(p.Som_Nr || 0);
    shFicha.getRange("D15").setValue(p.Iluminacao_Nr || 0);
    shFicha.getRange("F15").setValue(p.Video_Nr || 0);
    shFicha.getRange("J15").setValue(p.Rigging_Nr || 0);
    shFicha.getRange("L15").setValue(p.Estruturas_Nr || 0);
    shFicha.getRange("B16").setValue(p.Freelancers_Nr || 0);
    shFicha.getRange("D16").setValue(p.Subcontratados_Nr || 0);
  }

  // ── ALIMENTAÇÃO — ordem correta do template: Local | Nome Rest. | Local Rest. | Nº Pessoas | Data | Almoço | Jantar | Reservado ──
  var shAlim = ss.getSheetByName(CONFIG_AFTER.ABA_ALIMENTACAO);
  if (shAlim) {
    var lastRowAlim = shAlim.getLastRow();
    if (lastRowAlim >= 4) {
      shAlim.getRange(4, 1, lastRowAlim - 3, shAlim.getLastColumn()).clearContent();
    }
    var alimentacao = dadosCompletos.alimentacao || [];
    if (alimentacao.length > 0) {
      var linhasAlim = alimentacao.map(function (r) {
        return [
          r.Local || "",  // A - Local
          r.Nome_Restaurante || "",  // B - Nome Restaurante
          r.Local_Restaurante || "",  // C - Local Restaurante
          r.Nr_Pessoas || 0,   // D - Nº de pessoas
          r.Dia || "",  // E - Data
          r.Almoco ? "Sim" : "Não",   // F - Almoço
          r.Jantar ? "Sim" : "Não",   // G - Jantar
          r.Reservado ? "Sim" : "Não" // H - Reservado
          // I - Colaboradores: não escrever
        ];
      });
      shAlim.getRange(4, 1, linhasAlim.length, 8).setValues(linhasAlim);
    }
  }

  // ── ALOJAMENTO ──
  var shAloj = ss.getSheetByName(CONFIG_AFTER.ABA_ALOJAMENTO);
  if (shAloj) {
    var lastRowAloj = shAloj.getLastRow();
    if (lastRowAloj >= 4) {
      shAloj.getRange(4, 1, lastRowAloj - 3, shAloj.getLastColumn()).clearContent();
    }
    var alojamento = dadosCompletos.alojamento;
    if (alojamento && alojamento.periodos && alojamento.periodos.length > 0) {
      var linhasAloj = alojamento.periodos.map(function (periodo) {
        return [
          alojamento.Nome_Alojamento || "",
          alojamento.Local_Alojamento || "",
          periodo.Checkin || "",
          periodo.Checkout || "",
          periodo.Nr_Pessoas_Alojamento || 0,
          alojamento.Alojamento_Reservado ? "Sim" : "Não"
        ];
      });
      shAloj.getRange(4, 1, linhasAloj.length, 6).setValues(linhasAloj);
    }
  }

  // ── FREELANCERS ──
  var shFree = ss.getSheetByName(CONFIG_AFTER.ABA_FREELANCERS);
  if (shFree) {
    var lastRowFree = shFree.getLastRow();
    if (lastRowFree >= 4) {
      shFree.getRange(4, 1, lastRowFree - 3, shFree.getLastColumn()).clearContent();
    }
    var freelancers = dadosCompletos.freelancers || [];
    if (freelancers.length > 0) {
      var linhasFree = freelancers.map(function (f) {
        return [f.Nome_Freelancer || "", f.Freelancer_Confirmado || "Em análise"];
      });
      shFree.getRange(4, 1, linhasFree.length, 2).setValues(linhasFree);
    }
  }

  // ── SUBCONTRATADOS ──
  var shSub = ss.getSheetByName(CONFIG_AFTER.ABA_SUBCONTR);
  if (shSub) {
    var lastRowSub = shSub.getLastRow();
    if (lastRowSub >= 4) {
      shSub.getRange(4, 1, lastRowSub - 3, shSub.getLastColumn()).clearContent();
    }
    var subcontratados = dadosCompletos.subcontratados || [];
    if (subcontratados.length > 0) {
      var linhasSub = subcontratados.map(function (s) {
        return [s.Nome_Subcontratado || "", s.Subcontratado_Confirmado || "Em análise"];
      });
      shSub.getRange(4, 1, linhasSub.length, 2).setValues(linhasSub);
    }
  }

  // ── EQUIPAMENTO FLEX — preservar linhas 1 e 2 do template ──
  var shEquip = ss.getSheetByName(CONFIG_AFTER.ABA_EQUIPAMENTO);
  if (shEquip) {
    // Limpar só da linha 3 em diante — NÃO apagar título (linha 1) nem linha 2
    var lastRowEquip = shEquip.getLastRow();
    if (lastRowEquip >= 3) {
      shEquip.getRange(3, 1, lastRowEquip - 2, shEquip.getLastColumn()).clearContent().clearFormat();
    }
    var equipamento = dadosCompletos.equipamento || [];
    if (equipamento.length > 0) {
      _template_escreverEquipamento(shEquip, equipamento);
    }
  }
}

function _runAfterAtualizarTrigger() {
  // Apagar todos os triggers deste tipo para não acumular
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === '_runAfterAtualizarTrigger') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Ler os dados guardados
  var props = PropertiesService.getScriptProperties().getKeys()
    .filter(function (k) { return k.indexOf('after_atualizar_') === 0; });

  props.forEach(function (key) {
    try {
      var payload = JSON.parse(PropertiesService.getScriptProperties().getProperty(key));
      _afterAtualizarProjeto(payload.id, payload.dados);
      PropertiesService.getScriptProperties().deleteProperty(key);
    } catch (e) {
      Logger.log('_runAfterAtualizarTrigger erro: ' + e.message);
    }
  });
}

function _runAfterCriarTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === '_runAfterCriarTrigger') {
      ScriptApp.deleteTrigger(t);
    }
  });

  var props = PropertiesService.getScriptProperties().getKeys()
    .filter(function(k) { return k.indexOf('after_criar_') === 0; });

  props.forEach(function(key) {
    try {
      var payload = JSON.parse(PropertiesService.getScriptProperties().getProperty(key));
      _afterCriarProjeto(payload.dados);
      PropertiesService.getScriptProperties().deleteProperty(key);
    } catch(e) {
      Logger.log('_runAfterCriarTrigger erro: ' + e.message);
    }
  });
}

function atualizarProjetoAfter(id) {
  try {
    var dados = JSON.parse(
      PropertiesService.getScriptProperties().getProperty('after_atualizar_' + id) || 'null'
    );
    if (dados) {
      _afterAtualizarProjeto(dados.id, dados.dados);
      PropertiesService.getScriptProperties().deleteProperty('after_atualizar_' + id);
    }
  } catch(e) {
    Logger.log('atualizarProjetoAfter erro: ' + e.message);
  }
}


function criarProjetoAfter(id) {
  try {
    var payload = JSON.parse(
      PropertiesService.getScriptProperties().getProperty('after_criar_' + id) || 'null'
    );
    if (payload) {
      _afterCriarProjeto(payload.dados);
      PropertiesService.getScriptProperties().deleteProperty('after_criar_' + id);
    }
  } catch(e) {
    Logger.log('criarProjetoAfter erro: ' + e.message);
  }
}


function refreshEquipamentoFlex(idProjeto) {
  var sessao = getSessao();
  if (!sessao) return { erro: 'Não autenticado.' };

  try {
    // 1) Buscar do Flex e gravar na sheet EQUIPAMENTO
    var linhas = carregarEGravarEquipamentoFlex(idProjeto);

    // 2) Encontrar o ficheiro do projeto no Drive
    var nomePasta = idProjeto;
    var pastaAtivos = DriveApp.getFolderById(CONFIG_AFTER.PASTA_ATIVOS);

    // Procura pasta que começa com o ID do projeto
    var iterPastas = pastaAtivos.getFolders();
    var fileId = null;

    while (iterPastas.hasNext()) {
      var pasta = iterPastas.next();
      var nomePastaAtual = pasta.getName();

      // A pasta foi criada como "ID_NomeEvento"
      if (nomePastaAtual.toUpperCase().indexOf(idProjeto.toUpperCase()) === 0) {
        // Procura o ficheiro template dentro da pasta
        var iterFiles = pasta.getFiles();
        while (iterFiles.hasNext()) {
          var file = iterFiles.next();
          var mime = file.getMimeType();
          // Só sheets do Google
          if (mime === 'application/vnd.google-apps.spreadsheet') {
            fileId = file.getId();
            break;
          }
        }
        if (fileId) break;
      }
    }

    if (!fileId) {
      return { ok: false, erro: 'Ficheiro do projeto não encontrado no Drive.' };
    }

    // 3) Abrir o ficheiro e atualizar SÓ a tab de equipamento
    var ss = SpreadsheetApp.openById(fileId);
    var shEquip = ss.getSheetByName(CONFIG_AFTER.ABA_EQUIPAMENTO);

    if (!shEquip) {
      return { ok: false, erro: 'Tab "' + CONFIG_AFTER.ABA_EQUIPAMENTO + '" não encontrada no ficheiro.' };
    }

    // Limpar da linha 3 em diante (preserva linhas 1 e 2 do template)
    var lastRow = shEquip.getLastRow();
    if (lastRow >= 3) {
      shEquip.getRange(3, 1, lastRow - 2, shEquip.getLastColumn()).clearContent().clearFormat();
    }

    // Escrever equipamento novo
    if (linhas.length > 0) {
      _template_escreverEquipamento(shEquip, linhas);
    }

    return { ok: true, total: linhas.filter(function(l) { return !l.group; }).length };

  } catch (e) {
    Logger.log('refreshEquipamentoFlex erro: ' + e.message);
    return { ok: false, erro: e.message };
  }
}
