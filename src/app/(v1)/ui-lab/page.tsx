"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui-lab/components/ui/tabs";
import DashboardScreen from "@/ui-lab/screens/dashboard-screen";
import ComponentGallery from "@/ui-lab/screens/component-gallery";

export default function UILabPage() {
  return (
    <div className="p-4">
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard" className="px-4">
            Kontrolna tabla
          </TabsTrigger>
          <TabsTrigger value="components" className="px-4">
            Komponente
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <DashboardScreen />
        </TabsContent>
        <TabsContent value="components">
          <ComponentGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
}
