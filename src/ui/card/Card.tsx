import React from "react";

interface CardProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
  extra?: string;
}

export const cardStyle = `
  rounded-lg p-4 
  hover:shadow-md shadow-sm 
  border border-l-4 
  pb-1 transition duration-200 
  hover:scale-105 
`;

const Card: React.FC<CardProps> = ({ title, count, icon, extra }) => (
  <div
    className={`flex items-center max-w-sm ${cardStyle} bg-[#fff1f1] dark:bg-[#8b1031] border-[#f93a53] hover:border-[#e6183c]`}
  >
    <span className="w-12 h-12 flex items-center justify-center bg-[#ffe3e4] text-[#e6183c] rounded-full dark:bg-[#4e0315] dark:text-gray-50 mr-4">
      {icon}
    </span>
    <div>
      <h2 className="mb-2 text-lg font-semibold tracking-tight text-[#a30e30] dark:text-gray-50">
        {title}
      </h2>
      <p className="mb-1 text-3xl font-bold text-[#8b1031] dark:text-gray-50">
        {count}
      </p>
      {extra && (
        <p className="text-sm tracking-tight text-[#d70f37] dark:text-[#ff6d7c]">
          {extra}
        </p>
      )}
    </div>
  </div>
);

export default Card;
