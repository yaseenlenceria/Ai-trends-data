import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Package } from "lucide-react";
import ToolForm from "@/components/admin/ToolForm";
import CategoryForm from "@/components/admin/CategoryForm";
import ToolsManager from "@/components/admin/ToolsManager";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default function AdminPanel() {
  const [showToolForm, setShowToolForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleToolEdit = (tool: any) => {
    setEditingTool(tool);
    setShowToolForm(true);
  };

  const handleCategoryEdit = (category: any) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleToolFormClose = () => {
    setShowToolForm(false);
    setEditingTool(null);
  };

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage tools and categories for AI Trends Data
          </p>
        </div>

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Manage Tools</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add, edit, or remove AI tools from the platform
                  </p>
                </div>
                <Button
                  onClick={() => setShowToolForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tool
                </Button>
              </div>

              {showToolForm ? (
                <ToolForm
                  tool={editingTool}
                  onClose={handleToolFormClose}
                />
              ) : (
                <ToolsManager onEdit={handleToolEdit} />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Manage Categories</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add, edit, or remove tool categories
                  </p>
                </div>
                <Button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {showCategoryForm ? (
                <CategoryForm
                  category={editingCategory}
                  onClose={handleCategoryFormClose}
                />
              ) : (
                <CategoriesManager onEdit={handleCategoryEdit} />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
