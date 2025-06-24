import { Bell, Search } from 'lucide-react';
import React from 'react';

const AdminHeader:React.FC = () => (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <span className="font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">TuoCRM</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <span className="font-semibold text-sm">JT</span>
            </div>
            <span className="font-medium text-gray-700">Just Tran</span>
          </div>
        </div>
      </div>
    </header>
);

export default AdminHeader;