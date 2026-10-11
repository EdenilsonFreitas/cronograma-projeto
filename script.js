// Dados Iniciais mapeados a partir da Imagem
const initialData = [
    {
        id: 1,
        fase: "FASE 1: INFRAESTRUTURA FÍSICA (CAD) & ARQUITETURA LÓGICA DE REDE",
        titulo: "Modelagem do prédio da Matriz em AutoCAD",
        responsavel: "Emmanuel",
        semanas: [1, 2],
        cor: "green",
        status: "Concluído"
    },
    {
        id: 2,
        fase: "FASE 1: INFRAESTRUTURA FÍSICA (CAD) & ARQUITETURA LÓGICA DE REDE",
        titulo: "Locação de pontos, racks, patch panels e eletrocalhas",
        responsavel: "Emmanuel",
        semanas: [2, 3],
        cor: "green",
        status: "Andamento"
    },
    {
        id: 3,
        fase: "FASE 1: INFRAESTRUTURA FÍSICA (CAD) & ARQUITETURA LÓGICA DE REDE",
        titulo: "Planejamento de sub-redes IP, VLANs e DMZ",
        responsavel: "Arialyson",
        semanas: [1, 2],
        cor: "yellow",
        status: "Andamento"
    },
    {
        id: 4,
        fase: "FASE 2: SERVIÇOS DE REDE NA VM UBUNTU SERVER & SEGURANÇA",
        titulo: "Estruturação e subida da VM Ubuntu Server",
        responsavel: "Arialyson",
        semanas: [3, 4],
        cor: "yellow",
        status: "Pendente"
    },
    {
        id: 5,
        fase: "FASE 2: SERVIÇOS DE REDE NA VM UBUNTU SERVER & SEGURANÇA",
        titulo: "Instalação e testes de DHCP, DNS e Servidor Web",
        responsavel: "Arialyson",
        semanas: [5, 6],
        cor: "yellow",
        status: "Pendente"
    },
    {
        id: 6,
        fase: "FASE 2: SERVIÇOS DE REDE NA VM UBUNTU SERVER & SEGURANÇA",
        titulo: "Configuração do Proxy, Firewall e regras na DMZ",
        responsavel: "Arialyson",
        semanas: [6, 7],
        cor: "yellow",
        status: "Pendente"
    },
    {
        id: 7,
        fase: "FASE 2: SERVIÇOS DE REDE NA VM UBUNTU SERVER & SEGURANÇA",
        titulo: "Implementação da VPN e scripts de automação",
        responsavel: "Arialyson",
        semanas: [7, 8],
        cor: "yellow",
        status: "Pendente"
    },
    {
        id: 8,
        fase: "FASE 3: GESTÃO FINANCEIRA & COTAÇÃO DE EQUIPAMENTOS",
        titulo: "Cotação de mercado para ativos e passivos de rede",
        responsavel: "Leonardo",
        semanas: [3, 4],
        cor: "green",
        status: "Andamento"
    },
    {
        id: 9,
        fase: "FASE 3: GESTÃO FINANCEIRA & COTAÇÃO DE EQUIPAMENTOS",
        titulo: "Fechamento do orçamento (< R$ 150.000,00)",
        responsavel: "Leonardo",
        semanas: [6, 7, 8],
        cor: "green",
        status: "Pendente"
    },
    {
        id: 10,
        fase: "FASE 4: DOCUMENTAÇÃO TÉCNICA, SUBMISSÃO E DEFESA ORAL",
        titulo: "Redação do Memorial Descritivo e consolidação",
        responsavel: "Edenilson",
        semanas: [5, 6, 7, 8, 9, 10, 11],
        cor: "blue",
        status: "Pendente"
    },
    {
        id: 11,
        fase: "FASE 4: DOCUMENTAÇÃO TÉCNICA, SUBMISSÃO E DEFESA ORAL",
        titulo: "Testes integrados da VM e revisão técnica geral",
        responsavel: "Toda Equipe",
        semanas: [10, 11],
        cor: "blue",
        status: "Pendente"
    },
    {
        id: 12,
        fase: "FASE 4: DOCUMENTAÇÃO TÉCNICA, SUBMISSÃO E DEFESA ORAL",
        titulo: "Protocolo e envio do projeto à Banca (48h antes)",
        responsavel: "Edenilson",
        semanas: [12, 13],
        cor: "blue",
        status: "Pendente"
    },
    {
        id: 13,
        fase: "FASE 4: DOCUMENTAÇÃO TÉCNICA, SUBMISSÃO E DEFESA ORAL",
        titulo: "Criação dos slides e ensaio da apresentação (20 min)",
        responsavel: "Toda Equipe",
        semanas: [13, 14],
        cor: "blue",
        status: "Pendente"
    }
];

let tasks = [...initialData];

// Inicialização da Aplicação
document.addEventListener("DOMContentLoaded", () => {
    initWeekCheckboxes();
    renderTable();
    updateDashboard();

    // Event Listeners dos Filtros
    document.getElementById("filter-responsible").addEventListener("change", renderTable);
    document.getElementById("filter-status").addEventListener("change", renderTable);
    document.getElementById("search-input").addEventListener("input", renderTable);

    // Modal Events
    document.getElementById("btn-add-task").addEventListener("click", () => openModal());
    document.getElementById("btn-cancel-modal").addEventListener("click", closeModal);
    document.getElementById("task-form").addEventListener("submit", handleFormSubmit);

    // Exportar .ics
    document.getElementById("btn-export-ics").addEventListener("click", exportToICS);
});

// Renderização da Tabela por Fases
function renderTable() {
    const tbody = document.getElementById("cronograma-body");
    tbody.innerHTML = "";

    const respFilter = document.getElementById("filter-responsible").value;
    const statusFilter = document.getElementById("filter-status").value;
    const searchText = document.getElementById("search-input").value.toLowerCase();

    // Filtragem
    const filteredTasks = tasks.filter(t => {
        const matchesResp = respFilter === "ALL" || t.responsavel === respFilter;
        const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
        const matchesSearch = t.titulo.toLowerCase().includes(searchText);
        return matchesResp && matchesStatus && matchesSearch;
    });

    // Agrupar por fase
    const phases = [...new Set(tasks.map(t => t.fase))];

    phases.forEach(phase => {
        const phaseTasks = filteredTasks.filter(t => t.fase === phase);

        if (phaseTasks.length > 0) {
            // Tr da Fase
            const phaseTr = document.createElement("tr");
            phaseTr.innerHTML = `<td colspan="18" class="phase-row">${phase}</td>`;
            tbody.appendChild(phaseTr);

            // Trs das Tarefas
            phaseTasks.forEach(task => {
                const tr = document.createElement("tr");

                // Badge do Status
                let badgeClass = "badge-pendente";
                if (task.status === "Concluído") badgeClass = "badge-concluido";
                if (task.status === "Andamento") badgeClass = "badge-andamento";

                // Montar HTML das 14 Semanas
                let weeksHtml = "";
                for (let i = 1; i <= 14; i++) {
                    const isActive = task.semanas.includes(i);
                    let cellClass = "";
                    if (isActive) {
                        if (task.cor === "green") cellClass = "cell-active-green";
                        if (task.cor === "yellow") cellClass = "cell-active-yellow";
                        if (task.cor === "blue") cellClass = "cell-active-blue";
                    }
                    weeksHtml += `<td class="${cellClass}">${isActive ? 'X' : ''}</td>`;
                }

                tr.innerHTML = `
                    <td class="col-activity">${task.titulo}</td>
                    <td class="col-responsible"><strong>${task.responsavel}</strong></td>
                    ${weeksHtml}
                    <td><span class="badge-status ${badgeClass}">${task.status}</span></td>
                    <td>
                        <button class="btn btn-edit" onclick="openModal(${task.id})">✏️</button>
                        <button class="btn btn-danger" onclick="deleteTask(${task.id})">🗑️</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        }
    });
}

// Atualizar Dashboard e Progresso
function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Concluído").length;
    const inProgress = tasks.filter(t => t.status === "Andamento").length;
    const pending = tasks.filter(t => t.status === "Pendente").length;

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById("total-tasks").innerText = total;
    document.getElementById("completed-tasks").innerText = completed;
    document.getElementById("in-progress-tasks").innerText = inProgress;
    document.getElementById("pending-tasks").innerText = pending;

    document.getElementById("progress-percent").innerText = `${percent}%`;
    document.getElementById("progress-fill").style.width = `${percent}%`;
}

// Gera checkboxes S1-S14 na Modal
function initWeekCheckboxes() {
    const container = document.getElementById("weeks-checkboxes");
    container.innerHTML = "";
    for (let i = 1; i <= 14; i++) {
        container.innerHTML += `
            <label>
                <input type="checkbox" name="weeks" value="${i}"> S${i}
            </label>
        `;
    }
}

// Modal - Abrir/Editar
function openModal(id = null) {
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("task-form");
    form.reset();

    if (id) {
        document.getElementById("modal-title").innerText = "Editar Atividade";
        const task = tasks.find(t => t.id === id);
        document.getElementById("task-id").value = task.id;
        document.getElementById("task-phase").value = task.fase;
        document.getElementById("task-title").value = task.titulo;
        document.getElementById("task-responsible").value = task.responsavel;
        document.getElementById("task-status").value = task.status;

        const checkboxes = document.querySelectorAll('input[name="weeks"]');
        checkboxes.forEach(cb => {
            cb.checked = task.semanas.includes(parseInt(cb.value));
        });
    } else {
        document.getElementById("modal-title").innerText = "Adicionar Atividade";
        document.getElementById("task-id").value = "";
    }

    modal.classList.add("active");
}

function closeModal() {
    document.getElementById("task-modal").classList.remove("active");
}

// Submeter Formulário da Modal
function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("task-id").value;
    const fase = document.getElementById("task-phase").value;
    const titulo = document.getElementById("task-title").value;
    const responsavel = document.getElementById("task-responsible").value;
    const status = document.getElementById("task-status").value;

    const checkedWeeks = Array.from(document.querySelectorAll('input[name="weeks"]:checked'))
        .map(cb => parseInt(cb.value));

    // Define a cor baseada na Fase
    let cor = "green";
    if (fase.includes("FASE 2")) cor = "yellow";
    if (fase.includes("FASE 4")) cor = "blue";

    if (id) {
        const index = tasks.findIndex(t => t.id === parseInt(id));
        tasks[index] = { id: parseInt(id), fase, titulo, responsavel, status, semanas: checkedWeeks, cor };
    } else {
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        tasks.push({ id: newId, fase, titulo, responsavel, status, semanas: checkedWeeks, cor });
    }

    closeModal();
    renderTable();
    updateDashboard();
}

// Deletar Tarefa
function deleteTask(id) {
    if (confirm("Tem certeza que deseja excluir esta atividade?")) {
        tasks = tasks.filter(t => t.id !== id);
        renderTable();
        updateDashboard();
    }
}

// Exportar Agenda em Arquivo .ICS (Google Calendar, Outlook, Apple)
function exportToICS() {
    let icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Cronograma Projeto//PT-BR"
    ];

    // Data base inicial fictícia para a Semana 1 (ex: Primeira semana de Setembro de 2026)
    const baseDate = new Date(2026, 8, 1); // 01/09/2026

    tasks.forEach(task => {
        if (task.semanas.length > 0) {
            const minWeek = Math.min(...task.semanas);
            const maxWeek = Math.max(...task.semanas);

            const startDate = new Date(baseDate);
            startDate.setDate(baseDate.getDate() + (minWeek - 1) * 7);

            const endDate = new Date(baseDate);
            endDate.setDate(baseDate.getDate() + maxWeek * 7);

            const formatDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 8);

            icsContent.push(
                "BEGIN:VEVENT",
                `SUMMARY:${task.titulo}`,
                `DESCRIPTION:Responsável: ${task.responsavel} | Status: ${task.status}`,
                `DTSTART;VALUE=DATE:${formatDate(startDate)}`,
                `DTEND;VALUE=DATE:${formatDate(endDate)}`,
                "END:VEVENT"
            );
        }
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cronograma_projeto.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}