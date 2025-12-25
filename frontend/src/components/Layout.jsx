import React from 'react'
import Sidebar from './Sidebar.jsx' // Replace Sidebar import with MobileSidebar
import Navbar from './Navbar'

function Layout({ children, showSideBar = false }) {
    return (
        <div className='min-h-screen'>
            <div className='flex'>
                {/* Mobile & Desktop Sidebar */}
                {showSideBar && <Sidebar />}
                <div className='flex-1 flex flex-col'>
                    <Navbar />
                    <main className='flex-1 overflow-y-auto'>
                        {/* Add padding-top on mobile to account for hamburger button */}
                        <div className="lg:pt-0 pt-16">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Layout