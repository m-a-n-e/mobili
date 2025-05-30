import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateBudgetPDF = (budgetData) => {
  const doc = new jsPDF();
  let Y_POSITION = 20;

  // DADOS DA EMPRESA (Hardcoded)
  const companyName = "Mobili Refinatto";
  const companyContacts = "Fabiano: 9.9944-2631 / Jorge: 9.9964-3403";
  const companyAddress1 = "Rua: Av. Dos Italianos, n°355";
  const companyAddress2 = "Bairro: Santa Augusta CEP: 88.805-400";
  const companyCNPJ = "CNPJ: 97.440.259/0001-95";
  const companyIE = "Inscr. Estadual: 252.857,127";
  const companyCityState = "Criciúma - SC";

  // CABEÇALHO DA EMPRESA
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 105, Y_POSITION, { align: 'center' });
  Y_POSITION += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(companyContacts, 105, Y_POSITION, { align: 'center' });
  Y_POSITION += 4;
  doc.text(companyAddress1, 105, Y_POSITION, { align: 'center' });
  Y_POSITION += 4;
  doc.text(companyAddress2, 105, Y_POSITION, { align: 'center' });
  Y_POSITION += 4;
  const cnpjIEText = `${companyCNPJ} / ${companyIE} / ${companyCityState}`;
  doc.text(cnpjIEText, 105, Y_POSITION, { align: 'center' });
  Y_POSITION += 10;

  doc.setLineWidth(0.5);
  doc.line(14, Y_POSITION, 196, Y_POSITION);
  Y_POSITION += 10;

  // TÍTULO DO ORÇAMENTO, NÚMERO E DATA
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("Orçamento", 14, Y_POSITION);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const budgetNumber = budgetData.id ? budgetData.id.slice(-5) : 'N/D';
  doc.text(`Nº: ${budgetNumber}`, 150, Y_POSITION);
  Y_POSITION += 6;

  const createdAt = new Date(budgetData.createdAt || Date.now()).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  doc.text(`Data: ${createdAt}`, 150, Y_POSITION);
  Y_POSITION -= 6;

  // DADOS DO CLIENTE
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Cliente:", 14, Y_POSITION + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(budgetData.clientName || "Não informado", 30, Y_POSITION + 8);
  Y_POSITION += 18;

  // TABELA DE ITENS (Formato anterior restaurado)
  const tableItemColumn = ["Item", "Quantidade", "Preço Unitário (R$)", "Preço Total (R$)"]; // Colunas restauradas
  const tableItemRows = [];

  budgetData.items.forEach(item => {
    const itemData = [
      item.name,
      item.quantity,
      item.price.toFixed(2),
      (item.price * item.quantity).toFixed(2)
    ];
    tableItemRows.push(itemData);
  });

  autoTable(doc, {
    startY: Y_POSITION,
    head: [tableItemColumn], // Cabeçalho da tabela de itens
    body: tableItemRows,     // Corpo da tabela de itens
    theme: 'striped',        // Tema 'striped' como era antes
    headStyles: { 
      fillColor: [22, 160, 133], // Cor verde para o cabeçalho da tabela de itens
      fontSize: 10 
    },
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: { // Ajuste as larguras conforme necessário para 4 colunas
      0: { cellWidth: 'auto' }, // Item
      1: { cellWidth: 25, halign: 'center' }, // Quantidade
      2: { cellWidth: 40, halign: 'right' }, // Preço Unitário
      3: { cellWidth: 40, halign: 'right' }  // Preço Total
    },
    didDrawPage: function (data) {
      Y_POSITION = data.cursor.y;
    }
  });
  
  Y_POSITION = doc.lastAutoTable ? doc.lastAutoTable.finalY : Y_POSITION;
  Y_POSITION += 8;

  // TOTAL GERAL
  doc.setFontSize(12); // Aumentado um pouco para destaque
  doc.setFont('helvetica', 'bold');
  doc.text("TOTAL GERAL:", 14, Y_POSITION);
  doc.text(`R$ ${budgetData.total.toFixed(2)}`, 196, Y_POSITION, { align: 'right' });
  Y_POSITION += 15; // Mais espaço após o total

  // NOVA TABELA DE OBSERVAÇÕES
  if (budgetData.observations && budgetData.observations.trim() !== '') {
    const obsTableBody = [
      // Linha 1: Cabeçalho "OBS:" com fundo amarelo
      [{ 
        content: "OBS:", 
        styles: { 
          halign: 'left', 
          fontStyle: 'bold', 
          fillColor: [255, 255, 0], // Amarelo 
          textColor: [0,0,0], // Texto preto para contraste
          fontSize: 10
        } 
      }],
      // Linha 2: Texto da observação
      [{ 
        content: budgetData.observations, 
        styles: { 
          halign: 'left', 
          fontSize: 9 
        } 
      }]
    ];

    autoTable(doc, {
      startY: Y_POSITION,
      body: obsTableBody,
      theme: 'plain', // Tema 'plain' para não ter muitas linhas/bordas
      tableWidth: 'auto', // Para a tabela ocupar a largura necessária
      styles: { cellPadding: 2, lineWidth: 0.1, lineColor: [180,180,180] }, // Borda fina cinza
      columnStyles: { 0: { cellWidth: 182 } }, // Largura total da página (196 - 14 de margem)
      didDrawPage: function (data) {
        Y_POSITION = data.cursor.y;
      }
    });
  }

  // NOME DO ARQUIVO
  const fileName = `Orcamento_${budgetData.clientName || 'Cliente'}_${budgetNumber}.pdf`;
  doc.save(fileName);
};