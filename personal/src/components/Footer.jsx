function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" aria-label="Footer">
      <p className="footer-title">Digital Ledger</p>
      <p className="footer-subtitle">Personal Expense Management System</p>
      <small>© {year} Digital Ledger. All rights reserved.</small>
    </footer>
  )
}

export default Footer
