import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Activity, Zap, Database } from 'lucide-react'

function Analytics({ metrics, dataSources }) {
  const throughputMetrics = metrics
    .filter(m => m.metric_name === 'throughput')
    .slice(0, 24)
    .reverse()

  const qualityMetrics = metrics
    .filter(m => m.metric_name === 'data_quality_score')
    .slice(0, 24)
    .reverse()

  const chartData = throughputMetrics.map((m, i) => ({
    time: `${23 - i}h`,
    throughput: Math.round(m.metric_value),
    quality: qualityMetrics[i] ? Math.round(qualityMetrics[i].metric_value) : 0
  }))

  const sourceMetrics = dataSources.map(source => ({
    name: source.name,
    records: source.records_count / 1000000,
    size: source.size_bytes / 1073741824
  }))

  const statusData = dataSources.reduce((acc, source) => {
    const existing = acc.find(item => item.name === source.status)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: source.status, value: 1 })
    }
    return acc
  }, [])

  const COLORS = {
    active: '#10b981',
    inactive: '#64748b',
    error: '#ef4444'
  }

  const avgThroughput = throughputMetrics.reduce((sum, m) => sum + m.metric_value, 0) / throughputMetrics.length
  const avgQuality = qualityMetrics.reduce((sum, m) => sum + m.metric_value, 0) / qualityMetrics.length
  const totalRecords = dataSources.reduce((sum, s) => sum + s.records_count, 0)

  const kpis = [
    {
      label: 'Avg Throughput',
      value: Math.round(avgThroughput) + '/s',
      icon: Zap,
      color: 'blue'
    },
    {
      label: 'Data Quality',
      value: Math.round(avgQuality) + '%',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Processing Rate',
      value: '98.7%',
      icon: Activity,
      color: 'cyan'
    },
    {
      label: 'Total Records',
      value: (totalRecords / 1000000).toFixed(1) + 'M',
      icon: Database,
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analytics Dashboard</h2>
        <p className="text-slate-600">Deep insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className={`w-12 h-12 rounded-lg bg-${kpi.color}-100 flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 text-${kpi.color}-600`} />
              </div>
              <p className="text-slate-600 text-sm mb-1">{kpi.label}</p>
              <p className="text-3xl font-bold text-slate-800">{kpi.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#475569', fontWeight: 600 }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="throughput" stroke="#3b82f6" strokeWidth={2} name="Throughput" dot={{ fill: '#3b82f6', r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={2} name="Quality Score" dot={{ fill: '#10b981', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Source Status</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Volume by Source</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={sourceMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              labelStyle={{ color: '#475569', fontWeight: 600 }}
            />
            <Legend />
            <Bar dataKey="records" fill="#3b82f6" name="Records (M)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="size" fill="#06b6d4" name="Size (GB)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics
