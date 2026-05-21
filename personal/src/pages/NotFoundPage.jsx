import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="panel stack-sm" style={{ margin: '3rem auto', maxWidth: 560 }}>
      <h1>404 - Page Not Found</h1>
      <p>This route does not exist in your expense tracker app.</p>
      <Link className="btn btn-primary" to="/">
        Back to Dashboard
      </Link>
    </section>
  )
}

export default NotFoundPage
