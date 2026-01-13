'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600">Manage all system users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Users management page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}