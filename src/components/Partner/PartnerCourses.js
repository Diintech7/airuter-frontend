import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../UI/Card';
import { BarChart3, Users, Briefcase, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const PartnerCourses = () => {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Courses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload and update course offerings, integrate with candidate training paths
          </p>
        </div>
  
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses available at the moment</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add New Course
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  export default
    PartnerCourses
  ;