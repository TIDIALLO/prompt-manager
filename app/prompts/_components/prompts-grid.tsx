// app/prompts/components/prompts-grid.tsx
"use client"; // Mark as Client Component for state and interaction

import { Button } from "@/components/ui/button"; // Import Shadcn Button
import { Card, CardContent } from "@/components/ui/card"; // Import Shadcn Card
import { motion } from "framer-motion";
import { Copy, Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

// Import the Prompt type from the shared types file
import type { Prompt } from "./prompts-types";

// Define the props the component expects
interface PromptsGridProps {
  initialPrompts?: Prompt[]; // Optional - will use MOCK_PROMPTS as fallback
}

// Temporary Mock Data for UI development
const MOCK_PROMPTS: Prompt[] = [
  { id: 1, name: "Code Explainer", description: "Explains code in simple terms", content: "Please explain the following code snippet clearly and concisely, assuming I am a beginner programmer:\n\n```python\n[Your Code Here]\n```" },
  { id: 2, name: "Bug Finder", description: "Helps identify bugs", content: "Review the following code for potential bugs, logical errors, or performance bottlenecks:\n\n```javascript\n[Your Code Here]\n```" },
  { id: 3, name: "Feature Planner", description: "Helps plan new features", content: "Help me brainstorm and plan the implementation steps for the following feature: [Describe Feature]. Consider potential edge cases and user flows." },
  { id: 4, name: "SQL Helper", description: "Assists with SQL queries", content: "Generate an efficient SQL query to retrieve [Desired Data] from tables [Table Names] based on the condition: [Condition]." },
  { id: 5, name: "API Docs Writer", description: "Generates API documentation", content: "Write clear and comprehensive documentation for the following API endpoint:\n\nEndpoint: `[HTTP Method] /path/to/endpoint`\nDescription: [Brief description]\nRequest Body (if any): [Schema/Example]\nResponse Body (Success): [Schema/Example]\nError Responses: [Examples]" },
  { id: 6, name: "Code Refactoring Assistant", description: "Suggests code improvements", content: "Review the following code snippet and suggest improvements for readability, maintainability, and performance, explaining the reasoning behind each suggestion:\n\n```[language]\n[Your Code Here]\n```" }
];


export const PromptsGrid = ({ initialPrompts = MOCK_PROMPTS }: PromptsGridProps) => {
  // Initialize state with the provided initialPrompts or fallback to mock data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  // Placeholder state for copy confirmation (implement later)
  // const [copiedId, setCopiedId] = useState<number | null>(null);

   // Display message and create button if no prompts exist
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
         <Button onClick={() => { /* Add create logic */ }} className="mb-6 gap-2">
           <Plus className="w-5 h-5" /> Create First Prompt
         </Button>
        <p className="text-gray-600 dark:text-gray-300">No prompts found. Get started by creating one!</p>
      </div>
    );
  }

  return (
    <>
      {/* Button to trigger creating a new prompt */}
      <div className="mb-6 flex justify-end">
        <Button onClick={() => { /* Add create logic */ }} className="gap-2">
          <Plus className="w-5 h-5" /> Create Prompt
        </Button>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map over the prompts state array */}
        {prompts.map((prompt, index) => (
          <motion.div /* Animation wrapper */
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {/* Shadcn Card */}
            <Card className="h-full flex flex-col bg-white dark:bg-gray-800/50 shadow-sm border border-gray-200 dark:border-gray-700/50">
              <CardContent className="pt-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4 gap-2">
                   {/* Title & Description */}
                  <div className="flex-1 min-w-0"> {/* Allow text to wrap/truncate */}
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate" title={prompt.name}>
                      {prompt.name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2" title={prompt.description}>
                      {prompt.description}
                    </p>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => console.log('Edit', prompt.id)}> <Edit2 className="w-4 h-4" /> </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Delete" onClick={() => console.log('Delete', prompt.id)}> <Trash2 className="w-4 h-4" /> </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Copy" onClick={() => console.log('Copy', prompt.id)}> <Copy className="w-4 h-4" /> </Button>
                  </div>
                </div>
                {/* Prompt Content */}
                <div className="flex-grow mt-2 bg-gray-100 dark:bg-gray-700/60 rounded p-3 overflow-auto max-h-40"> {/* Limit height and allow scroll */}
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words font-mono">
                    {prompt.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
};