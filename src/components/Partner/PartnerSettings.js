import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../UI/Card';
import { BarChart3, Users, Briefcase, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const PartnerSettings = () => {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize notifications, portal preferences, and system settings
          </p>
        </div>
  
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Interview Reminders</span>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Portal Customization</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Portal Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter custom portal name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  export default
    PartnerSettings
  ;