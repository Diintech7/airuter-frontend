import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../UI/Card';
import { BarChart3, Users, Briefcase, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const PartnerJobListings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
  
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Listings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage job listings assigned by admin
          </p>
        </div>
  
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No job listings available at the moment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default
    PartnerJobListings
  ;