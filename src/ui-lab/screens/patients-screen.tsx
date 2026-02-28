"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/ui-lab/components/ui/input";
import { Button } from "@/ui-lab/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/ui-lab/components/ui/table";
import { Avatar, AvatarFallback } from "@/ui-lab/components/ui/avatar";
import { mockPatientsList } from "@/ui-lab/mock-data";

export default function PatientsScreen() {
  const [search, setSearch] = useState("");

  const filtered = mockPatientsList.filter((p) => {
    const term = search.toLowerCase();
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return (
      fullName.includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.phone.includes(term)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacijenti</h1>
          <p className="text-gray-500">
            Upravljanje pacijentima klinike ({mockPatientsList.length})
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novi pacijent
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Pretraži pacijente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pacijent</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Lokacija</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-gray-50">
                <TableCell>
                  <Link
                    href={`/ui-lab/patients/${patient.id}`}
                    className="flex items-center gap-3 hover:text-blue-600 transition-colors"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                        {patient.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-gray-500">#{patient.id}</TableCell>
                <TableCell className="text-gray-500">{patient.phone}</TableCell>
                <TableCell className="text-gray-500">{patient.email}</TableCell>
                <TableCell className="text-gray-500">
                  {patient.location}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/ui-lab/patients/${patient.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nema rezultata za &ldquo;{search}&rdquo;
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((patient) => (
          <Link
            key={patient.id}
            href={`/ui-lab/patients/${patient.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                  {patient.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">
                  {patient.firstName} {patient.lastName}
                </div>
                <div className="text-sm text-gray-500">ID: #{patient.id}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500 space-y-0.5">
              <div>{patient.phone}</div>
              <div>{patient.email}</div>
              <div>{patient.location}</div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nema rezultata za &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
