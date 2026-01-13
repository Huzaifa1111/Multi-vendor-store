'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">Manage all customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Orders management page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}