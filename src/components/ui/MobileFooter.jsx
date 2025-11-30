import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const MobileFooter = ({ navigationItems }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActiveRoute = (path) => {
        return location?.pathname === path;
    };

    const isParentActive = (children) => {
        return children?.some(child => isActiveRoute(child?.path));
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-[200] lg:hidden">
            <div className="flex items-center justify-around py-2">
                {navigationItems?.slice(0, 4)?.map((item) => {
                    const isActive = item?.children ? isParentActive(item?.children) : isActiveRoute(item?.path);
                    return (
                        <button
                            key={item?.path || item?.label}
                            onClick={() => {
                                if (item?.path) {
                                    handleNavigation(item?.path);
                                } else if (item?.children) {
                                    handleNavigation(item?.children?.[0]?.path);
                                }
                            }}
                            className={`
                  flex flex-col items-center gap-1 px-3 py-2 min-w-0 transition-academic
                  ${isActive ? 'text-primary' : 'text-muted-foreground'}
                `}
                        >
                            <Icon name={item?.icon} size={20} />
                            <span className="text-xs font-medium truncate">{item?.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileFooter;
