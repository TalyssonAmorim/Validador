chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "validate_cpf_cnpj",
        title: "Validar CPF/CNPJ",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "validate_cpf_cnpj") {
        const textoSelecionado = info.selectionText.trim();
        const resultado = validarTextoSelecionado(textoSelecionado);
        mostrarNotificacao(resultado);
    }
});

function validarTextoSelecionado(texto) {
    const numeroTratado = texto.replace(/[^0-9]/g, "");
    let resultado = "";

    const tipo = identificarTipo(numeroTratado);
    if (tipo === "CPF") {
        resultado = validarCPF(numeroTratado) ? "CPF válido" : "CPF inválido";
    } else if (tipo === "CNPJ") {
        resultado = validarCNPJ(numeroTratado) ? "CNPJ válido" : "CNPJ inválido";
    } else {
        resultado = "Número inválido.";
    }

    return resultado;
}

function mostrarNotificacao(mensagem) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon48.png", // Verifique se esse ícone existe
        title: "Resultado da Validação",
        message: mensagem,
        priority: 2
    });
}

function identificarTipo(numero) {
    switch (numero.length) {
        case 11: return "CPF";
        case 14: return "CNPJ";
        default: return "Inválido";
    }
}

function validarCPF(cpf) {
    if (cpf.length !== 11 || cpf.split('').every(c => c === cpf[0])) {
        return false; // Verifica se todos os dígitos são iguais
    }

    const calcularDigito = (dados, multiplicador) => {
        let soma = 0;
        for (let i = 0; i < dados.length; i++) {
            soma += parseInt(dados.charAt(i)) * multiplicador--;
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const primeiroDigito = calcularDigito(cpf.substring(0, 9), 10);
    const segundoDigito = calcularDigito(cpf.substring(0, 10), 11);

    return cpf.charAt(9) == primeiroDigito && cpf.charAt(10) == segundoDigito;
}

function validarCNPJ(cnpj) {
    if (cnpj.length !== 14 || cnpj.split('').every(c => c === cnpj[0])) {
        return false; // Verifica se todos os dígitos são iguais
    }

    const calcularDigito = (dados, multiplicador) => {
        let soma = 0;
        for (let i = 0; i < dados.length; i++) {
            soma += parseInt(dados.charAt(i)) * multiplicador--;
            if (multiplicador < 2) multiplicador = 9; // Reinicia multiplicador para CNPJ
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const primeiroDigito = calcularDigito(cnpj.substring(0, 12), 5);
    const segundoDigito = calcularDigito(cnpj.substring(0, 13), 6);

    return cnpj.charAt(12) == primeiroDigito && cnpj.charAt(13) == segundoDigito;
}
