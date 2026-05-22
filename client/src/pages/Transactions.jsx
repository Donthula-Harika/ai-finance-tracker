import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactions,
  removeTransactionById,
  saveTransaction
} from '../redux/slices/transactionSlice'

import {
  categories,
  formatCurrency,
  formatDate,
  paymentMethods
} from '../utils/format'

const emptyForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'upi',
  description: '',
  transactionDate: new Date().toISOString().slice(0, 10)
}

function Transactions() {
  const dispatch = useDispatch()

  const {
    transactions,
    pagination,
    loading,
    error
  } = useSelector((state) => state.transactions)

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    sort: 'latest',
    page: 1
  })

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const query = useMemo(() => ({
    ...filters,
    limit: 10
  }), [filters])

  useEffect(() => {
    dispatch(fetchTransactions(query))
  }, [dispatch, query])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      sort: 'latest',
      page: 1
    })
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditingId(item._id)

    setForm({
      type: item.type,
      title: item.title,
      amount: item.amount,
      category: item.category,
      paymentMethod: item.paymentMethod,
      description: item.description || '',
      transactionDate: item.transactionDate?.slice(0, 10)
    })

    setShowForm(true)
  }

  const closeModal = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const submitForm = async (event) => {
    event.preventDefault()

    try {
      const payload = editingId
        ? { id: editingId, data: form }
        : { data: form }

      await dispatch(saveTransaction(payload)).unwrap()

      setMessage(
        editingId
          ? 'Transaction updated successfully.'
          : 'Transaction added successfully.'
      )

      closeModal()

      dispatch(fetchTransactions(query))
    } catch (err) {
      setMessage(err || 'Something went wrong.')
    }
  }

  const deleteItem = async (item) => {
    const confirmDelete = window.confirm(
      `Delete "${item.title}" transaction?`
    )

    if (!confirmDelete) return

    try {
      await dispatch(removeTransactionById(item._id)).unwrap()

      setMessage('Transaction deleted successfully.')

      dispatch(fetchTransactions(query))
    } catch (err) {
      setMessage(err || 'Unable to delete transaction.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your income and expenses.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Add Transaction
        </button>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
          />

          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="amount_desc">Amount High → Low</option>
            <option value="amount_asc">Amount Low → High</option>
          </select>

          <button
            onClick={resetFilters}
            className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
          >
            Reset Filters
          </button>
        </div>
      </section>

      {(error || message) && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            error
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions?.length ? (
                transactions.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {item.title}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          item.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="px-4 py-4">{item.category}</td>

                    <td className="px-4 py-4">
                      {formatDate(item.transactionDate)}
                    </td>

                    <td className="px-4 py-4 capitalize">
                      {item.paymentMethod}
                    </td>

                    <td
                      className={`px-4 py-4 font-semibold ${
                        item.type === 'income'
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'}
                      {formatCurrency(item.amount)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg border px-3 py-1 text-xs font-medium transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteItem(item)}
                          className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
          <p className="text-slate-600">
            Page {pagination?.page || 1} of {pagination?.pages || 1}
          </p>

          <div className="flex gap-2">
            <button
              disabled={pagination?.page <= 1}
              onClick={() =>
                updateFilter('page', filters.page - 1)
              }
              className="rounded-lg border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={pagination?.page >= pagination?.pages}
              onClick={() =>
                updateFilter('page', filters.page + 1)
              }
              className="rounded-lg border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h3>

              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="rounded-lg border px-3 py-2"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>

                <input
                  type="text"
                  placeholder="Title"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="rounded-lg border px-3 py-2"
                />

                <input
                  type="number"
                  placeholder="Amount"
                  required
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  className="rounded-lg border px-3 py-2"
                />

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="rounded-lg border px-3 py-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentMethod: e.target.value
                    })
                  }
                  className="rounded-lg border px-3 py-2"
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={form.transactionDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      transactionDate: e.target.value
                    })
                  }
                  className="rounded-lg border px-3 py-2"
                />
              </div>

              <textarea
                rows="4"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                {loading
                  ? 'Saving...'
                  : editingId
                  ? 'Update Transaction'
                  : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions