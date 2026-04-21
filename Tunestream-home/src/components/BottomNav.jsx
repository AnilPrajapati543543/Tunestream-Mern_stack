import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'

const BottomNav = () => {
    const navigate = useNavigate()
    const location = useLocation()
    
    const navItems = [
        { name: 'Home', icon: assets.home_icon, path: '/' },
        { name: 'Search', icon: assets.search_icon, path: '/search' },
        { name: 'Your Library', icon: assets.stack_icon, path: '/library' },
    ]

    return (
        <div className='md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 flex justify-around items-center h-16 z-50'>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                    <div 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${isActive ? 'text-white scale-110' : 'text-gray-400 hover:text-white'}`}
                    >
                        <img 
                            src={item.icon} 
                            alt={item.name} 
                            className={`w-6 h-6 ${isActive ? '' : 'opacity-70'}`} 
                        />
                        <span className='text-[10px] uppercase font-bold tracking-wider'>{item.name}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default BottomNav
