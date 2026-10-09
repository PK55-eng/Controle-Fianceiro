const $ = (seletor) => document.querySelector(seletor);

let chart;


// ========================================
// FORMATAÇÃO
// ========================================

function money(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarDataInput(data) {
    if (!data) return "";

    return String(data).slice(0, 10);
}

function formatarDataTabela(data) {
    if (!data) return "";

    const somenteData = String(data).slice(0, 10);
    const partes = somenteData.split("-");

    if (partes.length !== 3) {
        return somenteData;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ========================================
// API
// ========================================

async function api(url, opcoes) {
    const resposta = await fetch(url, opcoes);

    if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));

        throw new Error(
            erro.erro ||
            erro.message ||
            "Erro ao acessar a API"
        );
    }

    if (resposta.status === 204) {
        return null;
    }

    return resposta.json();
}


// ========================================
// CATÁLOGOS DA NOVA TRANSAÇÃO
// ========================================

async function catalogos() {
    const [contas, categorias] = await Promise.all([
        api("/api/contas"),
        api("/api/categorias")
    ]);

    if (contas.length === 0) {
        $("#conta").replaceChildren(
            new Option("Nenhuma conta cadastrada", "")
        );
    } else {
        $("#conta").replaceChildren(
            ...contas.map(
                (conta) => new Option(conta.nome, conta.id)
            )
        );
    }

    const categoriasFiltradas = categorias.filter(
        (categoria) => categoria.tipo === $("#tipo").value
    );

    if (categoriasFiltradas.length === 0) {
        $("#categoria").replaceChildren(
            new Option("Nenhuma categoria disponível", "")
        );
    } else {
        $("#categoria").replaceChildren(
            ...categoriasFiltradas.map(
                (categoria) => new Option(categoria.nome, categoria.id)
            )
        );
    }
}


// ========================================
// CATEGORIAS DOS FILTROS
// ========================================

async function carregarCategoriasFiltro() {
    const categorias = await api("/api/categorias");

    const tipoSelecionado = $("#filtroTipo").value;
    const categoriaAtual = $("#filtroCategoria").value;

    let categoriasDisponiveis = categorias;

    if (tipoSelecionado) {
        categoriasDisponiveis = categorias.filter(
            (categoria) => categoria.tipo === tipoSelecionado
        );
    }

    const opcoes = [
        new Option("Todas as categorias", "")
    ];

    categoriasDisponiveis.forEach((categoria) => {
        opcoes.push(
            new Option(
                categoria.nome,
                categoria.id
            )
        );
    });

    $("#filtroCategoria").replaceChildren(...opcoes);

    const categoriaAindaExiste =
        categoriasDisponiveis.some(
            (categoria) =>
                String(categoria.id) ===
                String(categoriaAtual)
        );

    if (categoriaAindaExiste) {
        $("#filtroCategoria").value = categoriaAtual;
    }
}


// ========================================
// CATÁLOGOS DA EDIÇÃO
// ========================================

async function catalogosEdicao(categoriaSelecionada = null) {
    const [contas, categorias] = await Promise.all([
        api("/api/contas"),
        api("/api/categorias")
    ]);

    const contaSelecionada = $("#editarConta").value;

    $("#editarConta").replaceChildren(
        ...contas.map(
            (conta) => new Option(conta.nome, conta.id)
        )
    );

    if (contaSelecionada) {
        $("#editarConta").value = contaSelecionada;
    }

    const categoriasFiltradas = categorias.filter(
        (categoria) =>
            categoria.tipo === $("#editarTipo").value
    );

    $("#editarCategoria").replaceChildren(
        ...categoriasFiltradas.map(
            (categoria) =>
                new Option(
                    categoria.nome,
                    categoria.id
                )
        )
    );

    if (categoriaSelecionada) {
        $("#editarCategoria").value =
            String(categoriaSelecionada);
    }
}


// ========================================
// MONTAR URL DOS FILTROS
// ========================================

function montarUrlTransacoes() {
    const parametros = new URLSearchParams();

    const tipo = $("#filtroTipo").value;
    const categoriaId = $("#filtroCategoria").value;
    const dataInicial = $("#filtroDataInicial").value;
    const dataFinal = $("#filtroDataFinal").value;

    if (tipo) {
        parametros.set("tipo", tipo);
    }

    if (categoriaId) {
        parametros.set(
            "categoriaId",
            categoriaId
        );
    }

    if (dataInicial) {
        parametros.set(
            "dataInicial",
            dataInicial
        );
    }

    if (dataFinal) {
        parametros.set(
            "dataFinal",
            dataFinal
        );
    }

    const query = parametros.toString();

    if (!query) {
        return "/api/transacoes";
    }

    return `/api/transacoes?${query}`;
}


// ========================================
// VALIDAR PERÍODO
// ========================================

function periodoValido() {
    const dataInicial =
        $("#filtroDataInicial").value;

    const dataFinal =
        $("#filtroDataFinal").value;

    if (
        dataInicial &&
        dataFinal &&
        dataInicial > dataFinal
    ) {
        alert(
            "A data inicial não pode ser maior que a data final."
        );

        return false;
    }

    return true;
}


// ========================================
// DASHBOARD
// ========================================

async function carregar() {
    if (!periodoValido()) {
        return;
    }

    const urlTransacoes =
        montarUrlTransacoes();

    const [dashboard, transacoes] =
        await Promise.all([
            api("/api/dashboard"),
            api(urlTransacoes)
        ]);

    atualizarCards(dashboard);
    atualizarCategoriasDashboard(
        dashboard.categorias
    );
    atualizarTabela(transacoes);
    atualizarGrafico(dashboard.meses);
}


// ========================================
// CARDS
// ========================================

function atualizarCards(dashboard) {
    const receitas =
        Number(dashboard.receitas || 0);

    const despesas =
        Number(dashboard.despesas || 0);

    const saldo =
        Number(dashboard.saldo || 0);

    const economia =
        receitas - despesas;

    $("#saldo").textContent =
        money(saldo);

    $("#receitas").textContent =
        money(receitas);

    $("#despesas").textContent =
        money(despesas);

    $("#economia").textContent =
        money(economia);
}


// ========================================
// GASTOS POR CATEGORIA
// ========================================

function atualizarCategoriasDashboard(categorias) {
    const area = $("#categorias");

    const dados =
        Object.entries(categorias || {});

    if (dados.length === 0) {
        area.innerHTML =
            '<div class="mensagem-vazia">Nenhum gasto registrado.</div>';

        return;
    }

    const elementos =
        dados.map(([nome, valor]) => {

            const div =
                document.createElement("div");

            div.className = "categoria";

            const span =
                document.createElement("span");

            span.textContent = nome;

            const strong =
                document.createElement("strong");

            strong.textContent =
                money(valor);

            div.append(
                span,
                strong
            );

            return div;
        });

    area.replaceChildren(...elementos);
}


// ========================================
// TABELA
// ========================================

function atualizarTabela(transacoes) {
    const lista = $("#lista");

    if (!transacoes.length) {
        const linha =
            document.createElement("tr");

        const coluna =
            document.createElement("td");

        coluna.colSpan = 6;
        coluna.className =
            "mensagem-vazia";

        coluna.textContent =
            "Nenhuma transação encontrada com os filtros selecionados.";

        linha.append(coluna);

        lista.replaceChildren(linha);

        return;
    }

    const linhas =
        transacoes.map((transacao) => {

            const tr =
                document.createElement("tr");

            adicionarCelula(
                tr,
                transacao.descricao
            );

            adicionarCelula(
                tr,
                transacao.categoria.nome
            );

            adicionarCelula(
                tr,
                transacao.conta.nome
            );

            adicionarCelula(
                tr,
                formatarDataTabela(
                    transacao.data
                )
            );


            // VALOR

            const tdValor =
                document.createElement("td");

            const sinal =
                transacao.tipo === "RECEITA"
                    ? "+"
                    : "-";

            tdValor.textContent =
                sinal +
                " " +
                money(transacao.valor);

            tdValor.className =
                transacao.tipo === "RECEITA"
                    ? "receita"
                    : "despesa";

            tr.append(tdValor);


            // AÇÕES

            const tdAcao =
                document.createElement("td");

            const areaAcoes =
                document.createElement("div");

            areaAcoes.className =
                "acoes-tabela";


            // EDITAR

            const botaoEditar =
                document.createElement("button");

            botaoEditar.type = "button";
            botaoEditar.textContent = "Editar";
            botaoEditar.className =
                "botao-editar";

            botaoEditar.onclick = () => {
                abrirEdicao(transacao);
            };


            // EXCLUIR

            const botaoExcluir =
                document.createElement("button");

            botaoExcluir.type = "button";
            botaoExcluir.textContent =
                "Excluir";

            botaoExcluir.className =
                "botao-excluir";

            botaoExcluir.onclick =
                async () => {

                    const confirmar =
                        confirm(
                            `Deseja realmente excluir "${transacao.descricao}"?`
                        );

                    if (!confirmar) {
                        return;
                    }

                    try {
                        await api(
                            "/api/transacoes/" +
                            transacao.id,
                            {
                                method: "DELETE"
                            }
                        );

                        await carregar();

                    } catch (erro) {
                        alert(
                            "Não foi possível excluir a transação: " +
                            erro.message
                        );
                    }
                };

            areaAcoes.append(
                botaoEditar,
                botaoExcluir
            );

            tdAcao.append(areaAcoes);
            tr.append(tdAcao);

            return tr;
        });

    lista.replaceChildren(...linhas);
}


function adicionarCelula(linha, texto) {
    const td =
        document.createElement("td");

    td.textContent = texto;

    linha.append(td);
}


// ========================================
// GRÁFICO
// ========================================

function atualizarGrafico(meses) {
    const dadosMeses = meses || {};

    const labels =
        Object.keys(dadosMeses);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(
        $("#grafico"),
        {
            type: "line",

            data: {
                labels,

                datasets: [
                    {
                        label: "Receitas",

                        data: labels.map(
                            (mes) =>
                                dadosMeses[mes]
                                    .receitas
                        ),

                        borderColor:
                            "#24966d",

                        backgroundColor:
                            "rgba(36, 150, 109, 0.08)",

                        tension: 0.35,
                        fill: true
                    },

                    {
                        label: "Despesas",

                        data: labels.map(
                            (mes) =>
                                dadosMeses[mes]
                                    .despesas
                        ),

                        borderColor:
                            "#d85b67",

                        backgroundColor:
                            "rgba(216, 91, 103, 0.06)",

                        tension: 0.35,
                        fill: true
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "top"
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
}


// ========================================
// CONTAS
// ========================================

async function carregarContas() {
    const contas =
        await api("/api/contas");

    const area =
        $("#listaContas");

    if (contas.length === 0) {
        area.innerHTML =
            '<div class="mensagem-vazia">Nenhuma conta cadastrada.</div>';

        return;
    }

    const elementos =
        contas.map((conta) => {

            const item =
                document.createElement("div");

            item.className =
                "item-gerenciamento";

            const info =
                document.createElement("div");

            info.className =
                "item-gerenciamento-info";

            const icone =
                document.createElement("div");

            icone.className =
                "item-gerenciamento-icone";

            icone.textContent = "▣";

            const textos =
                document.createElement("div");

            const nome =
                document.createElement("strong");

            nome.textContent =
                conta.nome;

            const tipo =
                document.createElement("small");

            tipo.textContent =
                conta.tipo;

            textos.append(
                nome,
                tipo
            );

            info.append(
                icone,
                textos
            );

            const saldo =
                document.createElement("div");

            saldo.className =
                "item-gerenciamento-valor";

            saldo.textContent =
                money(conta.saldoInicial);

            item.append(
                info,
                saldo
            );

            return item;
        });

    area.replaceChildren(...elementos);
}


// ========================================
// CATEGORIAS
// ========================================

async function carregarCategorias() {
    const categorias =
        await api("/api/categorias");

    const area =
        $("#listaCategorias");

    if (categorias.length === 0) {
        area.innerHTML =
            '<div class="mensagem-vazia">Nenhuma categoria cadastrada.</div>';

        return;
    }

    const elementos =
        categorias.map((categoria) => {

            const item =
                document.createElement("div");

            item.className =
                "item-gerenciamento";

            const info =
                document.createElement("div");

            info.className =
                "item-gerenciamento-info";

            const icone =
                document.createElement("div");

            icone.className =
                "item-gerenciamento-icone";

            icone.textContent = "◉";

            const textos =
                document.createElement("div");

            const nome =
                document.createElement("strong");

            nome.textContent =
                categoria.nome;

            const descricao =
                document.createElement("small");

            descricao.textContent =
                "Categoria financeira";

            textos.append(
                nome,
                descricao
            );

            info.append(
                icone,
                textos
            );

            const tag =
                document.createElement("span");

            tag.className =
                "tag-tipo " +
                (
                    categoria.tipo ===
                    "RECEITA"
                        ? "tag-receita"
                        : "tag-despesa"
                );

            tag.textContent =
                categoria.tipo ===
                "RECEITA"
                    ? "Receita"
                    : "Despesa";

            item.append(
                info,
                tag
            );

            return item;
        });

    area.replaceChildren(...elementos);
}


// ========================================
// NOVA TRANSAÇÃO
// ========================================

$("#novo").onclick = async () => {
    $("#form").reset();

    $("#data").value =
        new Date()
            .toISOString()
            .slice(0, 10);

    $("#modal").showModal();

    try {
        await catalogos();

    } catch (erro) {
        console.error(
            "Erro ao carregar contas e categorias:",
            erro
        );
    }
};


$("#cancelar").onclick = () => {
    $("#modal").close();
};


$("#tipo").onchange = async () => {
    try {
        await catalogos();

    } catch (erro) {
        console.error(erro);
    }
};


$("#form").onsubmit =
    async (evento) => {

        evento.preventDefault();

        if (
            !$("#conta").value ||
            !$("#categoria").value
        ) {
            alert(
                "Cadastre uma conta e uma categoria antes de registrar a transação."
            );

            return;
        }

        try {
            const novaTransacao = {
                descricao:
                    $("#descricao")
                        .value
                        .trim(),

                valor:
                    $("#valor").value,

                tipo:
                    $("#tipo").value,

                categoriaId:
                    $("#categoria").value,

                contaId:
                    $("#conta").value,

                data:
                    $("#data").value
            };

            await api(
                "/api/transacoes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            novaTransacao
                        )
                }
            );

            evento.target.reset();

            $("#modal").close();

            await carregar();

        } catch (erro) {
            alert(
                "Não foi possível cadastrar a transação: " +
                erro.message
            );
        }
    };


// ========================================
// EDITAR TRANSAÇÃO
// ========================================

async function abrirEdicao(transacao) {
    try {
        $("#editarId").value =
            transacao.id;

        $("#editarDescricao").value =
            transacao.descricao;

        $("#editarValor").value =
            transacao.valor;

        $("#editarTipo").value =
            transacao.tipo;

        $("#editarData").value =
            formatarDataInput(
                transacao.data
            );

        $("#modalEditar").showModal();

        const [contas, categorias] =
            await Promise.all([
                api("/api/contas"),
                api("/api/categorias")
            ]);

        $("#editarConta").replaceChildren(
            ...contas.map(
                (conta) =>
                    new Option(
                        conta.nome,
                        conta.id
                    )
            )
        );

        $("#editarConta").value =
            String(transacao.contaId);

        const categoriasFiltradas =
            categorias.filter(
                (categoria) =>
                    categoria.tipo ===
                    transacao.tipo
            );

        $("#editarCategoria")
            .replaceChildren(
                ...categoriasFiltradas.map(
                    (categoria) =>
                        new Option(
                            categoria.nome,
                            categoria.id
                        )
                )
            );

        $("#editarCategoria").value =
            String(
                transacao.categoriaId
            );

    } catch (erro) {
        $("#modalEditar").close();

        alert(
            "Não foi possível abrir a edição: " +
            erro.message
        );
    }
}


$("#editarTipo").onchange =
    async () => {

        try {
            await catalogosEdicao();

        } catch (erro) {
            console.error(erro);
        }
    };


$("#cancelarEdicao").onclick = () => {
    $("#modalEditar").close();
};


$("#formEditar").onsubmit =
    async (evento) => {

        evento.preventDefault();

        const id =
            $("#editarId").value;

        if (
            !$("#editarConta").value ||
            !$("#editarCategoria").value
        ) {
            alert(
                "Selecione uma conta e uma categoria."
            );

            return;
        }

        try {
            const transacaoAtualizada = {
                descricao:
                    $("#editarDescricao")
                        .value
                        .trim(),

                valor:
                    $("#editarValor").value,

                tipo:
                    $("#editarTipo").value,

                categoriaId:
                    $("#editarCategoria").value,

                contaId:
                    $("#editarConta").value,

                data:
                    $("#editarData").value
            };

            await api(
                "/api/transacoes/" + id,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            transacaoAtualizada
                        )
                }
            );

            $("#modalEditar").close();

            await carregar();

        } catch (erro) {
            alert(
                "Não foi possível editar a transação: " +
                erro.message
            );
        }
    };


// ========================================
// FILTROS
// ========================================

$("#filtroTipo").onchange =
    async () => {

        try {
            await carregarCategoriasFiltro();
            await carregar();

        } catch (erro) {
            console.error(
                "Erro ao aplicar filtro:",
                erro
            );
        }
    };


$("#filtroCategoria").onchange = () => {
    carregar().catch(
        (erro) =>
            console.error(
                "Erro ao aplicar filtro:",
                erro
            )
    );
};


$("#filtroDataInicial").onchange = () => {
    carregar().catch(
        (erro) =>
            console.error(
                "Erro ao aplicar filtro:",
                erro
            )
    );
};


$("#filtroDataFinal").onchange = () => {
    carregar().catch(
        (erro) =>
            console.error(
                "Erro ao aplicar filtro:",
                erro
            )
    );
};


$("#limparFiltros").onclick =
    async () => {

        $("#filtroTipo").value = "";
        $("#filtroCategoria").value = "";
        $("#filtroDataInicial").value = "";
        $("#filtroDataFinal").value = "";

        try {
            await carregarCategoriasFiltro();
            await carregar();

        } catch (erro) {
            console.error(
                "Erro ao limpar filtros:",
                erro
            );
        }
    };


// ========================================
// MENU
// ========================================

const itensMenu =
    document.querySelectorAll(
        ".menu-item"
    );


function ativarMenu(item) {
    itensMenu.forEach(
        (menu) => {
            menu.classList.remove(
                "ativo"
            );
        }
    );

    item.classList.add("ativo");
}


$("#menuDashboard").onclick =
    (evento) => {

        evento.preventDefault();

        ativarMenu(
            $("#menuDashboard")
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


$("#menuTransacoes").onclick =
    (evento) => {

        evento.preventDefault();

        ativarMenu(
            $("#menuTransacoes")
        );

        $("#transacoes")
            .scrollIntoView({
                behavior: "smooth"
            });
    };


// ========================================
// MENU CONTAS
// ========================================

$("#menuContas").onclick =
    async (evento) => {

        evento.preventDefault();

        ativarMenu(
            $("#menuContas")
        );

        $("#modalContas")
            .showModal();

        try {
            await carregarContas();

        } catch (erro) {
            $("#listaContas").innerHTML =
                '<div class="mensagem-vazia">Não foi possível carregar as contas.</div>';

            console.error(erro);
        }
    };


$("#fecharContas").onclick = () => {
    $("#modalContas").close();

    ativarMenu(
        $("#menuDashboard")
    );
};


$("#novaConta").onclick = () => {
    $("#modalContas").close();
    $("#modalNovaConta").showModal();
};


$("#cancelarConta").onclick = () => {
    $("#modalNovaConta").close();
    $("#modalContas").showModal();
};


$("#formConta").onsubmit =
    async (evento) => {

        evento.preventDefault();

        try {
            const novaConta = {
                nome:
                    $("#nomeConta")
                        .value
                        .trim(),

                tipo:
                    $("#tipoConta").value,

                saldoInicial:
                    Number(
                        $("#saldoInicialConta")
                            .value
                    )
            };

            await api(
                "/api/contas",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            novaConta
                        )
                }
            );

            evento.target.reset();

            $("#saldoInicialConta")
                .value = "0";

            $("#modalNovaConta")
                .close();

            $("#modalContas")
                .showModal();

            await carregarContas();
            await carregar();

        } catch (erro) {
            alert(
                "Não foi possível cadastrar a conta: " +
                erro.message
            );
        }
    };


// ========================================
// MENU CATEGORIAS
// ========================================

$("#menuCategorias").onclick =
    async (evento) => {

        evento.preventDefault();

        ativarMenu(
            $("#menuCategorias")
        );

        $("#modalCategorias")
            .showModal();

        try {
            await carregarCategorias();

        } catch (erro) {
            $("#listaCategorias").innerHTML =
                '<div class="mensagem-vazia">Não foi possível carregar as categorias.</div>';

            console.error(erro);
        }
    };


$("#fecharCategorias").onclick = () => {
    $("#modalCategorias").close();

    ativarMenu(
        $("#menuDashboard")
    );
};


$("#novaCategoria").onclick = () => {
    $("#modalCategorias").close();
    $("#modalNovaCategoria").showModal();
};


$("#cancelarCategoria").onclick = () => {
    $("#modalNovaCategoria").close();
    $("#modalCategorias").showModal();
};


$("#formCategoria").onsubmit =
    async (evento) => {

        evento.preventDefault();

        try {
            const novaCategoria = {
                nome:
                    $("#nomeCategoria")
                        .value
                        .trim(),

                tipo:
                    $("#tipoCategoria").value
            };

            await api(
                "/api/categorias",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            novaCategoria
                        )
                }
            );

            evento.target.reset();

            $("#modalNovaCategoria")
                .close();

            $("#modalCategorias")
                .showModal();

            await carregarCategorias();
            await carregarCategoriasFiltro();

        } catch (erro) {
            alert(
                "Não foi possível cadastrar a categoria: " +
                erro.message
            );
        }
    };


// ========================================
// INICIAR SISTEMA
// ========================================

async function iniciar() {
    try {
        await carregarCategoriasFiltro();
        await carregar();

    } catch (erro) {
        console.error(
            "Erro ao carregar o sistema:",
            erro
        );
    }
}

iniciar();