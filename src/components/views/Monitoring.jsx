import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, CheckCircle, Clock, Server } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Monitoring({ dataSources, metrics }) {
  const [systemHealth, setSystemHealth] = useState(98.5)

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => Math.max(95, Math.min(100, prev + (Math.random() - 0.5) * 2)))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const recentMetrics = metrics.slice(0, 20).reverse().map((m, i) => ({
    time: `${i}m`,
    value: Math.round(m.metric_value)
  }))

  const alerts = [
    {
      id: 1,
      type: 'warning',
      source: 'API Gateway Logs',
      message: 'High latency detected',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      source: 'Customer Database',
      message: 'Backup completed successfully',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'success',
      source: 'Real-time Stream',
      message: 'Connection restored',
      time: '32 minutes ago'
    }
  ]

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Activity className="w-5 h-5 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">System Monitoring</h2>
        <p className="text-slate-600">Real-time system health and alerts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">System Health</p>
              <p className="text-2xl font-bold text-slate-800">{systemHealth.toFixed(1)}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${systemHealth}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Services</p>
              <p className="text-2xl font-bold text-slate-800">{dataSources.filter(s => s.status === 'active').length}/{dataSources.length}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">All critical services operational</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Alerts</p>
              <p className="text-2xl font-bold text-slate-800">{alerts.filter(a => a.type === 'warning').length}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Requires attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Real-time Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={recentMetrics}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#475569', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMetric)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{alert.source}</p>
                  <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Source Status Overview</h3>
        <div className="space-y-3">
          {dataSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${source.status === 'active' ? 'bg-green-500' : source.status === 'inactive' ? 'bg-slate-400' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-medium text-slate-800">{source.name}</p>
                  <p className="text-sm text-slate-600">{source.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800 capitalize">{source.status}</p>
                <p className="text-xs text-slate-500">Last sync: {new Date(source.last_sync).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Monitoring
