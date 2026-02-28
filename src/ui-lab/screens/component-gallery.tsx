"use client";

import { Button } from "@/ui-lab/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/ui-lab/components/ui/card";
import { Badge } from "@/ui-lab/components/ui/badge";
import { Input } from "@/ui-lab/components/ui/input";
import { Label } from "@/ui-lab/components/ui/label";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/ui-lab/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/ui-lab/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui-lab/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui-lab/components/ui/tabs";
import { Checkbox } from "@/ui-lab/components/ui/checkbox";
import { Switch } from "@/ui-lab/components/ui/switch";
import { Separator } from "@/ui-lab/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui-lab/components/ui/tooltip";
import { Mail, Plus, Trash2 } from "lucide-react";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function ComponentGallery() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Galerija komponenti</h1>
        <p className="text-gray-500 mt-1">
          UI primitivi kopirani iz Odontoa stomatološke aplikacije. Prilagođeni
          za Tailwind v3.
        </p>
      </div>

      {/* Dugmad */}
      <Section title="Dugme (Button)">
        <div className="flex flex-wrap gap-3 items-center">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus />
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button disabled>Disabled</Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" /> With Icon
          </Button>
        </div>
      </Section>

      {/* Značka */}
      <Section title="Značka (Badge)">
        <div className="flex flex-wrap gap-3 items-center">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge className="bg-green-100 text-green-800 border-green-300">
            In Stock
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Low Stock
          </Badge>
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Out of Stock
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Scheduled
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            Orthodontic
          </Badge>
        </div>
      </Section>

      {/* Kartica */}
      <Section title="Kartica (Card)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>
                Summary of patient activity this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                128 appointments completed, 14 new patients registered.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Monthly financial summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">98.450,00 RSD</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Unos i labela */}
      <Section title="Unos i labela (Input & Label)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="name">Patient Name</Label>
            <Input id="name" placeholder="Enter patient name..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="patient@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" placeholder="Cannot edit" disabled />
          </div>
        </div>
      </Section>

      {/* Padajući meni */}
      <Section title="Padajući meni (Select)">
        <div className="max-w-xs">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select treatment type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checkup">Regular Checkup</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="filling">Filling</SelectItem>
              <SelectItem value="extraction">Extraction</SelectItem>
              <SelectItem value="root-canal">Root Canal</SelectItem>
              <SelectItem value="orthodontic">Orthodontic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* Tabela */}
      <Section title="Tabela (Table)">
        <Table>
          <TableCaption>Recent patient appointments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Marija Petrović</TableCell>
              <TableCell>Regular Checkup</TableCell>
              <TableCell>Feb 27, 2026</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="text-right">3.500 RSD</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Nikola Đorđević</TableCell>
              <TableCell>Root Canal</TableCell>
              <TableCell>Feb 27, 2026</TableCell>
              <TableCell>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  In Progress
                </Badge>
              </TableCell>
              <TableCell className="text-right">12.000 RSD</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ana Simić</TableCell>
              <TableCell>Extraction</TableCell>
              <TableCell>Feb 28, 2026</TableCell>
              <TableCell>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  Scheduled
                </Badge>
              </TableCell>
              <TableCell className="text-right">8.000 RSD</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      {/* Tabovi */}
      <Section title="Tabovi (Tabs)">
        <Tabs defaultValue="overview" className="max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4 border rounded-md mt-2">
            <p className="text-sm text-muted-foreground">
              Patient overview and general information.
            </p>
          </TabsContent>
          <TabsContent
            value="appointments"
            className="p-4 border rounded-md mt-2"
          >
            <p className="text-sm text-muted-foreground">
              Upcoming and past appointments.
            </p>
          </TabsContent>
          <TabsContent value="billing" className="p-4 border rounded-md mt-2">
            <p className="text-sm text-muted-foreground">
              Invoices and payment history.
            </p>
          </TabsContent>
        </Tabs>
      </Section>

      {/* Avatar */}
      <Section title="Avatar">
        <div className="flex gap-4 items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="Dr. Marko" />
            <AvatarFallback className="bg-blue-600 text-white">MN</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="Dr. Jelena" />
            <AvatarFallback className="bg-purple-600 text-white">
              JS
            </AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="Dr. Ana" />
            <AvatarFallback className="bg-green-600 text-white">AS</AvatarFallback>
          </Avatar>
          <Avatar className="h-12 w-12">
            <AvatarImage src="" alt="Large" />
            <AvatarFallback className="bg-gray-600 text-white text-lg">
              XL
            </AvatarFallback>
          </Avatar>
        </div>
      </Section>

      {/* Čekboks i prekidač */}
      <Section title="Čekboks i prekidač (Checkbox & Switch)">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="reminders" defaultChecked />
            <Label htmlFor="reminders">Enable appointment reminders</Label>
          </div>
          <Separator />
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications">Push notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="darkmode" />
            <Label htmlFor="darkmode">Dark mode</Label>
          </div>
        </div>
      </Section>

      {/* Separator */}
      <Section title="Separator (Separator)">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Horizontal separator below:
            </p>
            <Separator className="my-2" />
            <p className="text-sm text-muted-foreground">Content after separator.</p>
          </div>
          <div className="flex h-6 items-center gap-4">
            <span className="text-sm">Item A</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Item B</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Item C</span>
          </div>
        </div>
      </Section>

      {/* Tooltip */}
      <Section title="Tooltip (Tooltip)">
        <TooltipProvider>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete patient record</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </Section>
    </div>
  );
}
