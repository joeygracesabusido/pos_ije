import React, { ReactNode } from 'react';

interface POSLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export const POSLayout: React.FC<POSLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Main Content Area (Product Grid) */}
      <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">POS Terminal</h1>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="px-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              JS
            </div>
          </div>
        </header>
        
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Sidebar (Cart/Checkout) */}
      <aside className="w-96 bg-white shadow-xl h-full flex flex-col border-l border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
          <p className="text-sm text-gray-500">Order #12345</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {sidebar || <div className="text-center text-gray-400 mt-10">Cart is empty</div>}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Tax (10%)</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
            <span>Total</span>
            <span>$0.00</span>
          </div>
          
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg transform active:scale-95 transition-all">
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
};
