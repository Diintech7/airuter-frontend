import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../UI/Card';
import { BarChart3, Users, Briefcase, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const PartnerAccount = () => {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage organization information and user roles
          </p>
        </div>
  
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <input 
                      type="email" 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter contact email"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default
    PartnerAccount
  ;