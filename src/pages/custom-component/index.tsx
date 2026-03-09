import { useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ─────────────────────────────────────────────
// COMPONENT REGISTRY
// Add new components here to show them on the page
// ─────────────────────────────────────────────

const componentRegistry = [
  {
    key: "button",
    label: "Button",
    description: "All button variants",
    preview: (
      <div className="flex flex-wrap gap-2 justify-center">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    ),
    full: (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Variants</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">States</h3>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "badge",
    label: "Badge",
    description: "Status & label badges",
    preview: (
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    ),
    full: (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>
    ),
  },
  {
    key: "card",
    label: "Card",
    description: "Content container card",
    preview: (
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle className="text-sm">Card Title</CardTitle>
          <CardDescription>A simple card preview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Card body content goes here.</p>
        </CardContent>
      </Card>
    ),
    full: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Card</CardTitle>
            <CardDescription>Card with header and content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This is the main card content area.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card with Footer</CardTitle>
            <CardDescription>Includes action buttons</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Content with footer actions.</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Confirm</Button>
            <Button size="sm" variant="outline">Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    ),
  },
  {
    key: "input",
    label: "Input",
    description: "Form input fields",
    preview: (
      <div className="w-full max-w-xs space-y-2">
        <Input placeholder="Default input..." />
        <Input placeholder="Disabled input" disabled />
      </div>
    ),
    full: (
      <div className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="demo-input">Default</Label>
          <Input id="demo-input" placeholder="Enter value..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="demo-disabled">Disabled</Label>
          <Input id="demo-disabled" placeholder="Cannot edit" disabled />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="demo-type">Password</Label>
          <Input id="demo-type" type="password" placeholder="••••••••" />
        </div>
      </div>
    ),
  },
  {
    key: "select",
    label: "Select",
    description: "Dropdown select component",
    preview: (
      <Select>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
    ),
    full: (
      <div className="space-y-4 max-w-sm">
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
  },
  {
    key: "alert-dialog",
    label: "Alert Dialog",
    description: "Confirmation dialogs",
    preview: (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">Open Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    full: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Click the button below to open the alert dialog.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Record</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Record?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the record. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  },
];

// ─────────────────────────────────────────────
// COMPONENTS PAGE
// ─────────────────────────────────────────────

export default function ComponentsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const activeComponent = componentRegistry.find((c) => c.key === selected);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl   font-bold text-foreground">Components</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Click any component card to see the full interactive preview.
        </p>
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {componentRegistry.map((comp) => (
          <button
            key={comp.key}
            onClick={() => setSelected(comp.key)}
            className="group flex flex-col gap-3 text-left focus:outline-none"
          >
            {/* Square Preview Tile */}
            <div
              className={`
                w-full aspect-square rounded-lg border flex items-center justify-center p-3 overflow-hidden
                transition-all duration-200 cursor-pointer
                ${selected === comp.key
                  ? "border-primary bg-accent shadow-md"
                  : "border-border bg-card hover:border-primary hover:bg-accent hover:shadow-sm"
                }
              `}
            >
              <div className="pointer-events-none scale-90 w-full flex items-center justify-center">
                {comp.preview}
              </div>
            </div>
            {/* Label */}
            <div>
              <p className="text-xs font-semibold text-foreground">{comp.label}</p>
              <p className="text-xs text-muted-foreground leading-tight">{comp.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Full Preview Modal */}
      {activeComponent && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="  font-bold text-lg text-foreground">
                  {activeComponent.label}
                </h3>
                <p className="text-sm text-muted-foreground">{activeComponent.description}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6">
              {activeComponent.full}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}