import { Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { VehicleProvider } from '../../contexts/VehicleContext'
import { useState } from 'react'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <VehicleProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </VehicleProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout