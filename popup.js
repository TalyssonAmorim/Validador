document.getElementById("validateButton").addEventListener("click", () => {
    // Obter texto selecionado na página atual
    const textoSelecionado = window.getSelection().toString().trim();

    // Verifica se há texto selecionado
    if (!textoSelecionado) {
        document.getElementById("result").textContent = "Por favor, selecione um CPF ou CNPJ na página.";
        return;
    }

    const numeroTratado = tratarEntrada(textoSelecionado);
    const tipo = identificarTipo(numeroTratado);
    let resultado = "";

    if (tipo === "CPF") {
        resultado = validarCPF(numeroTratado) ? "CPF válido" : "CPF inválido";
    } else if (tipo === "CNPJ") {
        resultado = validarCNPJ(numeroTratado) ? "CNPJ válido" : "CNPJ inválido";
    } else {
        resultado = "Número inválido.";
    }

    document.getElementById("result").textContent = resultado;
});
