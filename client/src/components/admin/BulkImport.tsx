import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileJson, FileSpreadsheet, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function BulkImport() {
  const queryClient = useQueryClient();
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [jsonData, setJsonData] = useState("");

  const handleJsonImport = async () => {
    setImporting(true);
    setResults(null);

    try {
      const tools = JSON.parse(jsonData);

      if (!Array.isArray(tools)) {
        throw new Error("JSON must be an array of tools");
      }

      const importResults = {
        total: tools.length,
        successful: 0,
        failed: 0,
        errors: [] as string[],
      };

      for (const tool of tools) {
        try {
          const response = await fetch("/api/admin/tools", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tool),
          });

          if (response.ok) {
            importResults.successful++;
          } else {
            importResults.failed++;
            const error = await response.json();
            importResults.errors.push(`${tool.name}: ${error.error}`);
          }
        } catch (error) {
          importResults.failed++;
          importResults.errors.push(
            `${tool.name}: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }

      setResults(importResults);
      queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    } catch (error) {
      setResults({
        total: 0,
        successful: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : "Invalid JSON format"],
      });
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;

      if (file.name.endsWith(".json")) {
        setJsonData(content);
      } else if (file.name.endsWith(".csv")) {
        // Simple CSV parsing (you could use a library like papaparse)
        const lines = content.split("\n");
        const headers = lines[0].split(",");

        const tools = lines.slice(1).map((line) => {
          const values = line.split(",");
          const tool: any = {};
          headers.forEach((header, index) => {
            tool[header.trim()] = values[index]?.trim();
          });
          return tool;
        });

        setJsonData(JSON.stringify(tools, null, 2));
      }
    };

    reader.readAsText(file);
  };

  const exampleJson = `[
  {
    "name": "Tool Name",
    "tagline": "Brief description",
    "description": "Detailed description...",
    "logo": "https://example.com/logo.png",
    "categoryId": "category-uuid",
    "website": "https://example.com",
    "twitter": "https://twitter.com/tool",
    "github": "https://github.com/tool/repo",
    "screenshots": ["https://example.com/screenshot1.png"],
    "pricing": {
      "model": "freemium",
      "plans": []
    }
  }
]`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Bulk Import Tools</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Import multiple tools at once using JSON or CSV format
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upload File</h3>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <span className="text-sm font-medium">
                  Click to upload JSON or CSV
                </span>
                <span className="text-xs text-gray-500">
                  Supports .json and .csv files
                </span>
              </label>
            </div>

            <div className="flex gap-2">
              <FileJson className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">JSON Format</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Array of tool objects with all required fields
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">CSV Format</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Comma-separated values with header row
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Manual JSON Input */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Manual JSON Input</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="json-data">Paste JSON Data</Label>
              <Textarea
                id="json-data"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder={exampleJson}
                rows={12}
                className="font-mono text-xs"
              />
            </div>

            <Button
              onClick={handleJsonImport}
              disabled={!jsonData || importing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Tools
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Results */}
      {results && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Import Results</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold">{results.total}</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  Successful
                </p>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {results.successful}
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {results.failed}
              </p>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Errors:</h4>
              <div className="space-y-1">
                {results.errors.map((error: string, index: number) => (
                  <p key={index} className="text-sm text-red-600 dark:text-red-400">
                    • {error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Example Format */}
      <Card className="p-6 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-semibold mb-4">Example JSON Format</h3>
        <pre className="bg-white dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs">
          {exampleJson}
        </pre>
      </Card>
    </div>
  );
}
