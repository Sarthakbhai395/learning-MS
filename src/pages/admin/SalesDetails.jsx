// src/components/SalesDetails.jsx
import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

// Animation for the details view
const detailsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

function SalesDetails({ onBack }) {
  return (
    <motion.div
      variants={detailsVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-white/90 shadow-md rounded-lg">
        <CardHeader className="p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-purple-700">Total Sales Details</h3>
            <button 
              onClick={onBack} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-200"
            >
              Back
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Breakdown of your monthly revenue</p>
            <div className="mt-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Course Sales</span>
                <span className="text-blue-600 font-semibold">$18,000</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subscription Revenue</span>
                <span className="text-blue-600 font-semibold">$4,500</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Other Income</span>
                <span className="text-blue-600 font-semibold">$2,000</span>
              </div>
              <div className="flex justify-between py-2 mt-2">
                <span className="text-gray-600 font-semibold">Total</span>
                <span className="text-blue-600 font-bold text-lg">$24,500</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export default SalesDetails;