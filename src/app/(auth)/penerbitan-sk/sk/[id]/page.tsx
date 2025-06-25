import PenerbitanSkIdComponent from "@/components/penerbitan-sk/PenerbitanSkIdComponent";
import React from "react";

export default async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">SK</h1>
      <PenerbitanSkIdComponent />
    </div>
  );
};
