import Overview from './views/Overview'
import DataSources from './views/DataSources'
import Datasets from './views/Datasets'
import Analytics from './views/Analytics'
import Monitoring from './views/Monitoring'
import Settings from './views/Settings'

function Dashboard({ currentView, dataSources, datasets, metrics, loading, refreshData }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading data...</p>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview dataSources={dataSources} datasets={datasets} metrics={metrics} />
      case 'sources':
        return <DataSources dataSources={dataSources} refreshData={refreshData} />
      case 'datasets':
        return <Datasets datasets={datasets} refreshData={refreshData} />
      case 'analytics':
        return <Analytics metrics={metrics} dataSources={dataSources} />
      case 'monitoring':
        return <Monitoring dataSources={dataSources} metrics={metrics} />
      case 'settings':
        return <Settings />
      default:
        return <Overview dataSources={dataSources} datasets={datasets} metrics={metrics} />
    }
  }

  return <div className="p-6">{renderView()}</div>
}

export default Dashboard
