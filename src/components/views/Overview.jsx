import { Database, HardDrive, TrendingUp, Activity, ArrowUp, ArrowDown } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function Overview({ dataSources, datasets, metrics }) {
  const totalRecords = dataSources.reduce((sum, source) => sum + (source.records_count || 0), 0)
  const totalSize = dataSources.reduce((sum, source) => sum + (source.size_bytes || 0), 0)
  const activeSources = dataSources.filter(s => s.status === 'active').length

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num
  }

  const throughputData = metrics
    .filter(m => m.metric_name === 'throughput')
    .slice(0, 24)
    .reverse()
    .map((m, i) => ({
      time: `${23 - i}h`,
      value: Math.round(m.metric_value)
    }))

  const qualityData = metrics
    .filter(m => m.metric_name === 'data_quality_score')
    .slice(0, 24)
    .reverse()
    .map((m, i) => ({
      time: `${23 - i}h`,
      score: Math.round(m.metric_value)
    }))

  const sourceTypeData = dataSources.reduce((acc, source) => {
    const existing = acc.find(item => item.type === source.type)
    if (existing) {
      existing.count += 1
      existing.records += source.records_count || 0
    } else {
      acc.push({
        type: source.type.charAt(0).toUpperCase() + source.type.slice(1),
        count: 1,
        records: source.records_count || 0
      })
    }
    return acc
  }, [])

  const stats = [
    {
      label: 'Total Records',
      value: formatNumber(totalRecords),
      change: '+12.5%',
      trend: 'up',
      icon: Database,
      color: 'blue'
    },
    {
      label: 'Active Sources',
      value: activeSources,
      change: '+2',
      trend: 'up',
      icon: Activity,
      color: 'green'
    },
    {
      label: 'Storage Used',
      value: formatBytes(totalSize),
      change: '+8.3%',
      trend: 'up',
      icon: HardDrive,
      color: 'orange'
    },
    {
      label: 'Avg Throughput',
      value: '847/s',
      change: '-3.2%',
      trend: 'down',
      icon: TrendingUp,
      color: 'cyan'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Overview Dashboard</h2>
        <p className="text-slate-600">Real-time insights into your data infrastructure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Throughput</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={throughputData}>
              <defs>
                <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#475569', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorThroughput)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Quality Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#475569', fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Sources by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="type" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#475569', fontWeight: 600 }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {dataSources.slice(0, 5).map((source, index) => (
              <div key={source.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{source.name}</p>
                    <p className="text-sm text-slate-500">{source.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">{formatNumber(source.records_count)} records</p>
                  <p className="text-xs text-slate-500">{formatBytes(source.size_bytes)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
