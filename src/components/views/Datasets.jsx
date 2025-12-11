import { useState } from 'react'
import { FileText, Search, Tag } from 'lucide-react'

function Datasets({ datasets, refreshData }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || dataset.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(datasets.map(d => d.category))]

  const getCategoryColor = (category) => {
    const colors = {
      'structured': 'bg-blue-100 text-blue-700',
      'semi-structured': 'bg-green-100 text-green-700',
      'unstructured': 'bg-orange-100 text-orange-700',
      'real-time': 'bg-cyan-100 text-cyan-700',
      'general': 'bg-slate-100 text-slate-700'
    }
    return colors[category] || colors.general
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Datasets</h2>
        <p className="text-slate-600">Browse and manage your data collections</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(dataset.category)}`}>
                  {dataset.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{dataset.name}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{dataset.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Records</p>
                  <p className="text-sm font-semibold text-slate-800">{formatNumber(dataset.records_count)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Source</p>
                  <p className="text-sm font-semibold text-slate-800">{dataset.data_sources?.name || 'Unknown'}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">Created {formatDate(dataset.created_at)}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No datasets found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Datasets
