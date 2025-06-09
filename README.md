# Editor de Recibos de Honorários Cirúrgicos

Um aplicativo web moderno para gerar recibos de honorários cirúrgicos em formato PDF. Este projeto permite preencher formulários intuitivos e gerar documentos profissionais automaticamente.

## 🚀 Funcionalidades

- **Interface intuitiva**: Formulário organizado em seções para facilitar o preenchimento
- **Geração de PDF**: Cria documentos PDF profissionais automaticamente
- **Substituição de variáveis**: Substitui automaticamente as variáveis do template pelos valores inseridos
- **Conversão automática**: Converte valores numéricos para extenso automaticamente
- **Validação de campos**: Campos obrigatórios marcados e validação em tempo real
- **Data automática**: Botão para preencher automaticamente com a data atual
- **Preview em tempo real**: Mostra o valor por extenso enquanto digita
- **Design responsivo**: Interface que funciona em dispositivos móveis e desktop
- **Download automático**: Arquivo gerado é baixado automaticamente pelo navegador

## 📋 Campos do Formulário

### Dados do Profissional

- **Nome do Titular** (obrigatório)
- **CPF do Titular** (obrigatório)

### Dados Financeiros

- **Valor** (obrigatório) - convertido automaticamente para extenso

### Dados do Paciente

- **Nome do Paciente** (obrigatório)
- **CPF do Paciente** (opcional)

### Serviços

- **Descrição dos Serviços** (opcional)

### Data

- **Dia, Mês e Ano** (com botão para data atual)

## 🛠️ Template do Documento

O documento gerado segue o seguinte formato:

```
RECIBO DE HONORÁRIOS CIRÚRGICOS

Pelo presente, eu [NOME DO TITULAR], inscrito no CPF sob nº [CPF DO TITULAR],
declaro que RECEBI o valor de R$ [VALOR], ([VALOR POR EXTENSO]), referente aos
serviços prestados ao paciente [NOME DO PACIENTE], inscrito no CPF sob nº
[CPF DO PACIENTE]. Descrição dos serviços: [DESCRIÇÃO DOS SERVIÇOS]

Recife, [DIA] de [MÊS] de [ANO]

_________________________________________________
[NOME DO TITULAR]
```

## 🚀 Como Usar

1. **Instalar dependências**:

   ```bash
   npm install
   ```

2. **Executar o projeto**:

   ```bash
   npm run dev
   ```

3. **Acessar a aplicação**:

   - Abra o navegador em `http://localhost:5173`

4. **Preencher o formulário**:

   - Complete os campos obrigatórios (marcados com \*)
   - Use o botão "Usar Data Atual" para preencher automaticamente a data
   - Adicione descrição dos serviços se necessário

5. **Gerar documento**:
   - Clique em "Gerar Documento PDF"
   - O arquivo será baixado automaticamente
   - Nome do arquivo: `Recibo_Honorarios_[NomeDoPaciente].pdf`

## 🛠️ Tecnologias Utilizadas

- **React 19**: Framework frontend
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e servidor de desenvolvimento
- **jsPDF**: Biblioteca para gerar documentos PDF
- **CSS3**: Estilização moderna com gradientes e animações

## 📱 Interface

- **Design moderno**: Interface com gradientes e sombras
- **Campos organizados**: Agrupados por categoria (Profissional, Financeiro, Paciente, etc.)
- **Animações suaves**: Transições e efeitos visuais
- **Validação visual**: Bordas coloridas para campos válidos/inválidos
- **Responsivo**: Funciona em smartphones, tablets e desktop

## ⚙️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run preview`: Visualiza o build de produção
- `npm run lint`: Executa o linter

## 📁 Estrutura do Projeto

```
src/
├── App.tsx          # Componente principal
├── App.css          # Estilos da aplicação
├── main.tsx         # Ponto de entrada
└── index.css        # Estilos globais
```

## 🎨 Personalização

Para personalizar o template do documento, edite a função `generateDocument` no arquivo `src/App.tsx`. Você pode:

- Alterar o formato do texto
- Modificar o layout do documento
- Adicionar novos campos
- Mudar a formatação (negrito, tamanho da fonte, etc.)

## 📝 Observações

- Os documentos são gerados no lado do cliente (browser)
- Não há armazenamento de dados - tudo é processado localmente
- O formato PDF é compatível com qualquer leitor de PDF
