// app/prompts/components/prompts-grid.tsx
"use client";

// Import updatePrompt action
import { createPrompt, updatePrompt } from "@/actions/prompts-actions";
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Copy, Edit2, Plus, Trash2, Check } from "lucide-react";
import { useState, FormEvent } from "react";

// Type definitions
interface Prompt { id: number; name: string; description: string; content: string; }
interface PromptsGridProps { initialPrompts: Prompt[]; }

// Handler function for input changes
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setFormData: React.Dispatch<React.SetStateAction<{ name: string; description: string; content: string; }>>) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
};

export const PromptsGrid = ({ initialPrompts }: PromptsGridProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Add State for Editing ---
  const [editingId, setEditingId] = useState<number | null>(null); // null when creating, number (ID) when editing

  // --- Add Handler for Edit Button Click ---
  const handleEditClick = (promptToEdit: Prompt) => {
    setEditingId(promptToEdit.id); // Store the ID of the prompt being edited
    // Set form data to the current values of the prompt
    setFormData({
      name: promptToEdit.name,
      description: promptToEdit.description,
      content: promptToEdit.content,
    });
    setError(null); // Clear errors
    setIsFormOpen(true); // Open the dialog
  };

  // --- Update resetAndCloseForm ---
  const resetAndCloseForm = () => {
    setIsFormOpen(false);
    setFormData({ name: "", description: "", content: "" });
    setError(null);
    setIsSubmitting(false);
    setEditingId(null); // Reset editingId when closing/resetting
  };

  // --- Modify handleSubmit for Update Logic ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId !== null) {
        // --- UPDATE PATH ---
        // Call updatePrompt server action
        const updatedPrompt = await updatePrompt({ id: editingId, ...formData });
        // Update the prompts state by replacing the old version with the updated one
        setPrompts((prevPrompts) =>
          prevPrompts.map((p) => (p.id === editingId ? updatedPrompt : p))
        );
        console.log(`Prompt ${editingId} updated.`);
      } else {
        // --- CREATE PATH (No changes needed here) ---
        const newPrompt = await createPrompt(formData);
        setPrompts((prevPrompts) => [newPrompt, ...prevPrompts]);
        console.log(`Prompt created with ID ${newPrompt.id}.`);
      }
      resetAndCloseForm(); // Close and reset form on success for both paths
    } catch (err) {
      console.error("Save Prompt Error:", err);
      setError(err instanceof Error ? err.message : "Failed to save prompt.");
      setIsSubmitting(false); // Reset submitting state on error
    }
  };

  // ... (empty state rendering) ...
   if (prompts.length === 0) { /* ... */ }

  // --- Update Render Logic ---
  return (
    <>
      {/* Update Create Button onClick to reset editingId */}
      <div className="mb-6 flex justify-end">
        <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) resetAndCloseForm(); else setIsFormOpen(open); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); /* Ensure create mode */ resetAndCloseForm(); setIsFormOpen(true); }} className="gap-2">
              <Plus className="w-5 h-5" /> Create Prompt
            </Button>
          </DialogTrigger>
          <DialogContent /* ... */ onInteractOutside={(e) => { if(isSubmitting) e.preventDefault();}}>
            <DialogHeader>
               {/* Dynamic Title */}
              <DialogTitle>{editingId ? 'Edit Prompt' : 'Create New Prompt'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Make changes to your existing prompt.' : 'Enter the details for your new prompt.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
               {/* Form fields remain the same - value={formData...} handles pre-filling */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={(e) => handleInputChange(e, setFormData)} required className="col-span-3" disabled={isSubmitting} />
                </div>
                {/* ... other fields ... */}
                 <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="description" className="text-right">Description</Label>
                     <Input id="description" name="description" value={formData.description} onChange={(e) => handleInputChange(e, setFormData)} required className="col-span-3" disabled={isSubmitting} />
                 </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                     <Label htmlFor="content" className="text-right pt-2">Content</Label>
                     <Textarea id="content" name="content" value={formData.content} onChange={(e) => handleInputChange(e, setFormData)} required className="col-span-3 min-h-[120px]" disabled={isSubmitting} />
                 </div>
              {error && <p className="col-span-4 text-center text-sm text-red-500 px-6">{error}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetAndCloseForm} disabled={isSubmitting}>Cancel</Button>
                 {/* Dynamic Submit Button Text */}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (editingId ? 'Saving...' : 'Creating...') : (editingId ? 'Save Changes' : 'Create Prompt')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Update Edit button onClick in the grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
           <motion.div key={prompt.id} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
             <Card className="h-full flex flex-col bg-white dark:bg-gray-800/50 shadow-sm border border-gray-200 dark:border-gray-700/50">
               <CardContent className="pt-6 flex-grow flex flex-col">
                 <div className="flex justify-between items-start mb-4 gap-2">
                   {/* Title & Description */}
                   <div className="flex-1 min-w-0">
                     <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate" title={prompt.name}>
                       {prompt.name}
                     </h2>
                     <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2" title={prompt.description}>
                       {prompt.description}
                     </p>
                   </div>
                   {/* Action Buttons */}
                   <div className="flex gap-1">
                     {/* Attach handleEditClick to the Edit button */}
                     <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => handleEditClick(prompt)}>
                       <Edit2 className="w-4 h-4" />
                     </Button>
                     {/* ... Delete and Copy buttons */}
                     <Button variant="ghost" size="icon" className="h-7 w-7" title="Delete" onClick={() => console.log('Delete', prompt.id)}> <Trash2 className="w-4 h-4" /> </Button>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-7 w-7" 
                       title="Copy" 
                       onClick={() => {
                         // Copier dans le presse-papier et mettre à jour l'état
                         navigator.clipboard.writeText(prompt.content);
                         setCopiedId(prompt.id);
                         // Réinitialiser après 2 secondes
                         setTimeout(() => setCopiedId(null), 2000);
                       }}
                     > 
                       {copiedId === prompt.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                     </Button>
                   </div>
                 </div>
                 {/* Prompt Content */}
                 <div className="flex-grow mt-2 bg-gray-100 dark:bg-gray-700/60 rounded p-3 overflow-auto max-h-40">
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