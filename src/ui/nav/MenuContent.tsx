import React from "react";
import Home from "../../pages/dashboard";

interface MenuContentProps {
    activeTab: number;
}

const MenuContent: React.FC<MenuContentProps> = ({ activeTab }) => {
    const renderContent = () => {
        if (activeTab === 1){
            return(
                <Home />
            )
        } else if (activeTab === 2){
            return(
                <div>Course Management</div>
            )
        }
    }
    return renderContent();
}

export default MenuContent;