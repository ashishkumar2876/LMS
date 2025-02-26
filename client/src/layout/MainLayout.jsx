import React from 'react'
import Navbar from '@/components/ui/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
        <Navbar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout