import ExcelJS from 'exceljs';

export async function downloadExcel(
  filename: string,
  title: string,
  headers: string[],
  rows: string[][],
  color: string,
  summary?: string
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(title);
  sheet.addRow([title]);
  sheet.mergeCells(1, 1, 1, headers.length);
  sheet.getRow(1).font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
  for (let column = 1; column <= headers.length; column += 1) {
    sheet.getCell(1, column).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color },
    };
  }
  const headerRow = summary ? 3 : 2;
  if (summary) {
    sheet.addRow([summary]);
    sheet.mergeCells(2, 1, 2, headers.length);
    sheet.getRow(2).font = { italic: true, color: { argb: 'FF607D8B' } };
  }
  sheet.addRow(headers);
  sheet.getRow(headerRow).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  for (let column = 1; column <= headers.length; column += 1) {
    sheet.getCell(headerRow, column).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color },
    };
  }
  rows.forEach((row) => sheet.addRow(row));
  sheet.columns.forEach((column) => {
    const index = (column.number ?? 1) - 1;
    column.width = Math.min(
      36,
      Math.max(
        14,
        ...rows.map((row) => String(row[index] ?? '').length + 2),
        (headers[index] ?? '').length + 2
      )
    );
  });
  sheet.views = [{ state: 'frozen', ySplit: headerRow }];
  sheet.autoFilter = {
    from: { row: headerRow, column: 1 },
    to: { row: rows.length + headerRow, column: headers.length },
  };
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
