import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../UI/Card';
import { BarChart3, Users, Briefcase, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const PartnerHelp = () => {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Access support resources and submit tickets
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Support Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50">
                  Partner Portal Guide
                </a>
                <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50">
                  API Documentation
                </a>
                <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50">
                  FAQ
                </a>
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Submit Ticket</h3>
              <div className="space-y-4">
                <textarea 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Describe your issue..."
                ></textarea>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Submit Ticket
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  export default
    PartnerHelp
  ;