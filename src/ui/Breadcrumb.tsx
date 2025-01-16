import React, { ReactNode } from "react";

type BreadcrumbProps = {
    children: ReactNode;
    navigation: { label: string; href?: string }[]; // Breadcrumb navigation items
  };
  
  const Breadcrumb: React.FC<BreadcrumbProps> = ({ children, navigation }) => {
    return (
      <div className="p-2">
        <nav className="text-sm text-gray-500 mb-4">
          {navigation.map((item, index) => (
            <span key={index} className="mr-2">
              {item.href ? (
                <a href={item.href} className="text-blue-500 hover:underline">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
              {index < navigation.length - 1 && <span> / </span>}
            </span>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    );
  };

  export default Breadcrumb;