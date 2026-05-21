import { useEffect, useState } from 'react'

const defaultValues = {
  title: '',
  amount: '',
  category: 'Food',
  date: '',
  note: '',
}

function ExpenseForm({ onSubmit, initialValues, submitLabel = 'Add Expense', onCancel }) {
  const [formValues, setFormValues] = useState(defaultValues)

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        title: initialValues.title,
        amount: String(initialValues.amount),
        category: initialValues.category,
        date: initialValues.date,
        note: initialValues.note || '',
      })
    } else {
      setFormValues(defaultValues)
    }
  }, [initialValues])

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      ...formValues,
      amount: Number(formValues.amount),
    })

    if (!initialValues) {
      setFormValues(defaultValues)
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Title
          <input
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Coffee, books, transport"
            required
          />
        </label>

        <label>
          Amount (NPR)
          <input
            name="amount"
            value={formValues.amount}
            onChange={handleChange}
            type="number"
            min="1"
            step="1"
            required
          />
        </label>

        <label>
          Category
          <select name="category" value={formValues.category} onChange={handleChange}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Education">Education</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Date
          <input
            name="date"
            value={formValues.date}
            onChange={handleChange}
            type="date"
            required
          />
        </label>
      </div>

      <label>
        Note
        <textarea
          name="note"
          value={formValues.note}
          onChange={handleChange}
          rows="3"
          placeholder="Optional details"
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>

        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ExpenseForm
