import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

function App() {
  const [currentView, setCurrentView] = useState('overview')
  const [dataSources, setDataSources] = useState([])
  const [datasets, setDatasets] = useState([])
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sourcesRes, datasetsRes, metricsRes] = await Promise.all([
        supabase.from('data_sources').select('*').order('created_at', { ascending: false }),
        supabase.from('datasets').select('*, data_sources(name)').order('created_at', { ascending: false }),
        supabase.from('analytics_metrics').select('*').order('timestamp', { ascending: false }).limit(100)
      ])

      if (sourcesRes.data) setDataSources(sourcesRes.data)
      if (datasetsRes.data) setDatasets(datasetsRes.data)
      if (metricsRes.data) setMetrics(metricsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Dashboard
            currentView={currentView}
            dataSources={dataSources}
            datasets={datasets}
            metrics={metrics}
            loading={loading}
            refreshData={fetchData}
          />
        </main>
      </div>
    </div>
  )
}

export default App
