import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../ui/Sidebar';
import Header from '../ui/Header';
import { toggleSidebar } from '../../store/slices/uiSlice';

const MainLayout = () => {
    const { sidebarCollapsed } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen bg-background">
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => dispatch(toggleSidebar())}
            />

            <Header
                sidebarCollapsed={sidebarCollapsed}
            />

            <main
                className={`
          transition-all duration-300 ease-in-out
          pt-16 pb-20 lg:pb-8
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}
          min-h-screen flex flex-col
        `}
            >
                <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
