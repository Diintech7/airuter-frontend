
// PartnerOverview.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../UI/Card';
import { BarChart3, Users, Briefcase, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const PartnerOverview = () => {
  const [stats, setStats] = useState({
    totalJobListings: 0,
    activeApplications: 0,
    coursesOffered: 0,
    studentsPlaced: 0,
    upcomingInterviews: 0,
    placementRate: 0
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partner Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to your partner portal dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Listings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobListings}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Applications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeApplications}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses Offered</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.coursesOffered}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Students Placed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.studentsPlaced}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Interviews</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingInterviews}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Placement Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.placementRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Job Listings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Software Engineer - Tech Corp</span>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Data Analyst - DataCo</span>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Product Manager - StartupX</span>
                <span className="text-xs text-gray-500">5 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Interviews</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">John Doe - Software Engineer</span>
                <span className="text-xs text-gray-500">Tomorrow 2:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">Jane Smith - Data Analyst</span>
                <span className="text-xs text-gray-500">Dec 15, 10:00 AM</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Mike Johnson - Product Manager</span>
                <span className="text-xs text-gray-500">Dec 16, 3:30 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default
    PartnerOverview
  ;