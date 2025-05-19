import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // return (
  //   <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
  //     <div className="px-3 py-3 lg:px-5 lg:pl-3">
  //       <div className="flex items-center justify-between">
  //         <div className="flex items-center justify-start">
  //           {/* <button
  //             onClick={toggleSidebar}
  //             className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
  //           >
  //             <FiMenu className="w-6 h-6" />
  //           </button>
  //           <Link to="/dashboard" className="flex items-center">
  //             <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary-700">
  //               Park<span className="text-success-600">Smart</span>
  //             </span>
  //           </Link> */}
  //         </div>
  //         <div className="flex items-center">
  //           <div className="hidden md:flex mr-4">
  //             <button className="p-1 relative text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
  //               <FiBell className="w-6 h-6" />
  //               <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
  //             </button>
  //           </div>
            
  //           <div className="relative" ref={dropdownRef}>
  //             <button
  //               onClick={toggleDropdown}
  //               className="flex items-center space-x-3 focus:outline-none"
  //             >
  //               <div className="hidden md:block">
  //                 <div className="text-sm font-medium text-gray-900">{currentUser?.name || 'User'}</div>
  //                 <div className="text-xs text-gray-500">{currentUser?.email || 'user@example.com'}</div>
  //               </div>
  //               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
  //                 <FiUser className="w-5 h-5" />
  //               </div>
  //             </button>
              
  //             {dropdownOpen && (
  //               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
  //                 <Link
  //                   to="/dashboard/profile"
  //                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  //                 >
  //                   Profile
  //                 </Link>
  //                 <Link
  //                   to="/dashboard/settings"
  //                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  //                 >
  //                   Settings
  //                 </Link>
  //                 <button
  //                   onClick={logout}
  //                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
  //                 >
  //                   <FiLogOut className="mr-2" /> Logout
  //                 </button>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </nav>
  // )
}

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
}

export default Navbar