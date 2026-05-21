import { formatCurrency } from './formatCurrency'

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function exportReportsCSV(expenses) {
  const headers = ['Title', 'Category', 'Amount', 'Date', 'Note']
  const rows = expenses.map((expense) => [
    expense.title,
    expense.category,
    String(expense.amount),
    expense.date,
    expense.note || '',
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, 'expense-report.csv')
}

export async function exportReportsPDF(expenses) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const autoTable = autoTableModule.default

  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('Digital Ledger Report', 14, 16)

  const rows = expenses.map((expense) => [
    expense.title,
    expense.category,
    formatCurrency(expense.amount),
    expense.date,
    expense.note || '-',
  ])

  autoTable(doc, {
    startY: 24,
    head: [['Title', 'Category', 'Amount', 'Date', 'Note']],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [234, 88, 12] },
  })

  doc.save('expense-report.pdf')
}
