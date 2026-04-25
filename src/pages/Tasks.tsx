import React from 'react';
import Layout from '../components/common/layout/layout';

export default function Tasks() {
  return (
    <Layout title="Tasks">
      <div className="flex-1 rounded-[32px] bg-[#F5F6F8] p-8 min-h-[500px] flex items-center justify-center border border-gray-100">
        <h2 className="text-xl text-gray-500 font-medium">Tasks Page Content</h2>
      </div>
    </Layout>
  );
}
