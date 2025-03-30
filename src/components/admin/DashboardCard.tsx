import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  color: string;
  delay?: number;
}

const DashboardCard = ({ title, value, icon, change, color, delay = 0 }: DashboardCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full text-white mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {change && <span className="text-green-500 text-sm ml-2">{change}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
