import { formatDate } from '../utils/formatDate'
import { formatCurrency } from '../utils/formatCurrency'

function ExpenseCard({ expense, onEdit, onDelete }) {
  const canEdit = typeof onEdit === 'function'
  const canDelete = typeof onDelete === 'function'

  return (
    <article className="expense-card">
      <div>
        <h3>{expense.title}</h3>
        <p className="expense-note">{expense.note || 'No note added'}</p>
      </div>

      <div className="expense-meta">
        <span className="tag">{expense.category}</span>
        <span>{formatDate(expense.date)}</span>
        <strong>{formatCurrency(expense.amount)}</strong>
      </div>

      {(canEdit || canDelete) && (
        <div className="expense-actions">
          {canEdit && (
            <button className="btn btn-secondary" type="button" onClick={() => onEdit(expense)}>
              Edit
            </button>
          )}
          {canDelete && (
            <button className="btn btn-danger" type="button" onClick={() => onDelete(expense.id)}>
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  )
}

export default ExpenseCard
