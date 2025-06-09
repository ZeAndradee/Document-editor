import React, { useState } from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import {
  FiUser,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import "./App.css";

interface FormData {
  nomeTitular: string;
  cpfTitular: string;
  valor: string;
  nomePaciente: string;
  cpfPaciente: string;
  descricaoServicos: string;
  dia: string;
  mes: string;
  ano: string;
}

function App() {
  // Função para obter a data atual formatada
  const getFormattedCurrentDate = () => {
    const today = new Date();
    const monthNames = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    const dia = today.getDate().toString().padStart(2, "0");
    const mes = monthNames[today.getMonth()];
    const ano = today.getFullYear().toString();

    return { dia, mes, ano };
  };

  const [formData, setFormData] = useState<FormData>(() => {
    const currentDate = getFormattedCurrentDate();
    return {
      nomeTitular: "",
      cpfTitular: "",
      valor: "",
      nomePaciente: "",
      cpfPaciente: "",
      descricaoServicos: "",
      dia: currentDate.dia,
      mes: currentDate.mes,
      ano: currentDate.ano,
    };
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Função para converter números para extenso
  const numberToWords = (num: number): string => {
    const unidades = [
      "",
      "um",
      "dois",
      "três",
      "quatro",
      "cinco",
      "seis",
      "sete",
      "oito",
      "nove",
    ];
    const teens = [
      "dez",
      "onze",
      "doze",
      "treze",
      "quatorze",
      "quinze",
      "dezesseis",
      "dezessete",
      "dezoito",
      "dezenove",
    ];
    const dezenas = [
      "",
      "",
      "vinte",
      "trinta",
      "quarenta",
      "cinquenta",
      "sessenta",
      "setenta",
      "oitenta",
      "noventa",
    ];
    const centenas = [
      "",
      "cento",
      "duzentos",
      "trezentos",
      "quatrocentos",
      "quinhentos",
      "seiscentos",
      "setecentos",
      "oitocentos",
      "novecentos",
    ];

    if (num === 0) return "zero";
    if (num === 100) return "cem";

    let result = "";

    // Milhões
    if (num >= 1000000) {
      const milhoes = Math.floor(num / 1000000);
      if (milhoes === 1) {
        result += "um milhão";
      } else {
        result += numberToWords(milhoes) + " milhões";
      }
      num %= 1000000;
      if (num > 0) result += " ";
    }

    // Milhares
    if (num >= 1000) {
      const milhares = Math.floor(num / 1000);
      if (milhares === 1) {
        result += "mil";
      } else {
        result += numberToWords(milhares) + " mil";
      }
      num %= 1000;
      if (num > 0) result += " ";
    }

    // Centenas
    if (num >= 100) {
      result += centenas[Math.floor(num / 100)];
      num %= 100;
      if (num > 0) result += " e ";
    }

    // Dezenas e unidades
    if (num >= 20) {
      result += dezenas[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) result += " e ";
    } else if (num >= 10) {
      result += teens[num - 10];
      num = 0;
    }

    if (num > 0) {
      result += unidades[num];
    }

    return result;
  };

  // Função para converter valor monetário para extenso
  const currencyToWords = (value: string): string => {
    if (!value) return "";

    // Remove formatação e converte para número
    const numericValue = parseFloat(value.replace(/\./g, "").replace(",", "."));

    if (isNaN(numericValue)) return "";

    const reais = Math.floor(numericValue);
    const centavos = Math.round((numericValue - reais) * 100);

    let result = "";

    if (reais === 0) {
      result = "zero real";
    } else if (reais === 1) {
      result = "um real";
    } else {
      result = numberToWords(reais) + " reais";
    }

    if (centavos > 0) {
      if (centavos === 1) {
        result += " e um centavo";
      } else {
        result += " e " + numberToWords(centavos) + " centavos";
      }
    }

    return result;
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const cpf = value.replace(/\D/g, "");
    if (cpf.length <= 11) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return value;
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue === "") return "";

    const integerPart = numericValue.slice(0, -2) || "0";
    const decimalPart = numericValue.slice(-2).padStart(2, "0");

    // Remove zeros à esquerda desnecessários
    const cleanIntegerPart = integerPart.replace(/^0+/, "") || "0";
    const formattedInteger = cleanIntegerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );
    return `${formattedInteger},${decimalPart}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formatação específica para cada campo
    if (name === "cpfTitular" || name === "cpfPaciente") {
      formattedValue = formatCPF(value);
    } else if (name === "valor") {
      formattedValue = formatCurrency(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // Função para processar o arquivo DOCX original convertendo variáveis
  const generateDocumentFromTemplate = async () => {
    if (
      !formData.nomeTitular ||
      !formData.cpfTitular ||
      !formData.valor ||
      !formData.nomePaciente
    ) {
      alert(
        "Por favor, preencha pelo menos os campos obrigatórios (Nome do Titular, CPF do Titular, Valor e Nome do Paciente)"
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Carregar o arquivo DOCX template da pasta public
      const response = await fetch("/template-honorario.docx");
      if (!response.ok) {
        throw new Error("Não foi possível carregar o template DOCX");
      }

      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Gerar valor por extenso automaticamente
      const valorExtenso = currencyToWords(formData.valor);

      // Definir as variáveis para substituição no template DOCX
      const templateData = {
        NOMETITULAR: formData.nomeTitular,
        CPFTITULAR: formData.cpfTitular,
        VALOR: formData.valor,
        VALOREXTENSO: valorExtenso,
        NOMEPACIENTE: formData.nomePaciente,
        CPFPACIENTE: formData.cpfPaciente || "",
        DESCRICAOSERVICOS: formData.descricaoServicos || "",
        DIA: formData.dia,
        MES: formData.mes,
        ANO: formData.ano,
      };

      // Aplicar as substituições
      doc.setData(templateData);

      try {
        doc.render();
      } catch (error: any) {
        console.error("Erro ao renderizar template:", error);
        throw new Error("Erro ao processar o template DOCX");
      }

      // Gerar o arquivo DOCX modificado mantendo formatação
      const buf = doc.getZip().generate({
        type: "arraybuffer",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Salvar o DOCX modificado
      const docxBlob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const docxFileName = `Recibo_${formData.nomePaciente.replace(
        /\s+/g,
        "_"
      )}.docx`;

      // Download do DOCX modificado
      const docxUrl = URL.createObjectURL(docxBlob);
      const docxLink = document.createElement("a");
      docxLink.href = docxUrl;
      docxLink.download = docxFileName;
      document.body.appendChild(docxLink);
      docxLink.click();
      document.body.removeChild(docxLink);
      URL.revokeObjectURL(docxUrl);

      alert(
        `✅ Documento processado com sucesso!\n\n` +
          `📁 Arquivo baixado: ${docxFileName}\n\n` +
          `💡 Para gerar PDF:\n` +
          `1. Abra o arquivo DOCX no Microsoft Word\n` +
          `2. Vá em Arquivo → Salvar Como → PDF\n` +
          `3. Isso manterá 100% da formatação original (paisagem, imagens, etc.)`
      );
    } catch (error: any) {
      console.error("Erro ao processar template:", error);
      alert(`Erro ao processar o template: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearForm = () => {
    const currentDate = getFormattedCurrentDate();
    setFormData({
      nomeTitular: "",
      cpfTitular: "",
      valor: "",
      nomePaciente: "",
      cpfPaciente: "",
      descricaoServicos: "",
      dia: currentDate.dia,
      mes: currentDate.mes,
      ano: currentDate.ano,
    });
  };

  // Mostrar preview do valor por extenso
  const valorExtensoPreview = formData.valor
    ? currencyToWords(formData.valor)
    : "";

  return (
    <div className="container">
      <header className="header">
        <h1>Editor de Recibos de Honorários</h1>
        <p>
          Gerador profissional de recibos médicos com processamento automatizado
          de templates. Mantenha a formatação original e gere documentos prontos
          para uso.
        </p>
      </header>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <div className="form-section">
            <h2>
              <FiUser className="section-icon" />
              Dados do Titular
            </h2>
            <div className="form-group">
              <label htmlFor="nomeTitular">
                Nome do Titular
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="nomeTitular"
                name="nomeTitular"
                value={formData.nomeTitular}
                onChange={handleInputChange}
                placeholder="Nome completo do Titular"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cpfTitular">
                CPF do Titular
                <span className="required-asterisk">*</span>
              </label>

              <input
                type="text"
                id="cpfTitular"
                name="cpfTitular"
                value={formData.cpfTitular}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>
              <FiDollarSign className="section-icon" />
              Dados Financeiros
            </h2>
            <div className="form-group">
              <label htmlFor="valor">
                Valor
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                placeholder="1.500,00"
                required
              />
              {valorExtensoPreview && (
                <div className="valor-extenso-preview">
                  <small>
                    Por extenso: <em>{valorExtensoPreview}</em>
                  </small>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>
              <FiUsers className="section-icon" />
              Dados do Paciente
            </h2>
            <div className="form-group">
              <label htmlFor="nomePaciente">
                Nome do Paciente
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="nomePaciente"
                name="nomePaciente"
                value={formData.nomePaciente}
                onChange={handleInputChange}
                placeholder="Nome completo do paciente"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cpfPaciente">CPF do Paciente</label>
              <input
                type="text"
                id="cpfPaciente"
                name="cpfPaciente"
                value={formData.cpfPaciente}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>
              <FiCalendar className="section-icon" />
              Data
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dia">Dia</label>
                <input
                  type="text"
                  id="dia"
                  name="dia"
                  value={formData.dia}
                  onChange={handleInputChange}
                  placeholder="01"
                  maxLength={2}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mes">Mês</label>
                <input
                  type="text"
                  id="mes"
                  name="mes"
                  value={formData.mes}
                  onChange={handleInputChange}
                  placeholder="janeiro"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ano">Ano</label>
                <input
                  type="text"
                  id="ano"
                  name="ano"
                  value={formData.ano}
                  onChange={handleInputChange}
                  placeholder="2024"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="form-section section-full-width">
            <h2>
              <FiFileText className="section-icon" />
              Descrição dos Serviços
            </h2>
            <div className="form-group">
              <label htmlFor="descricaoServicos">Descrição dos Serviços</label>
              <textarea
                id="descricaoServicos"
                name="descricaoServicos"
                value={formData.descricaoServicos}
                onChange={handleInputChange}
                placeholder="Descreva os serviços prestados..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="actions actions-wrapper">
          <button
            type="button"
            onClick={generateDocumentFromTemplate}
            disabled={isGenerating}
            className="button button-primary"
          >
            {isGenerating ? (
              <>
                <FiRefreshCw
                  className="button-icon"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Processando...
              </>
            ) : (
              <>
                <FiDownload className="button-icon" />
                Gerar Documento
              </>
            )}
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="button button-secondary"
          >
            <FiRefreshCw className="button-icon" />
            Limpar Formulário
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
