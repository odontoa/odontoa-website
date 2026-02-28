"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Phone,
  Mail,
  Calendar,
  FileText,
  Camera,
  Image as ImageIcon,
  ClipboardList,
  Stethoscope,
  BarChart3,
  Upload,
} from "lucide-react";
import { Button } from "@/ui-lab/components/ui/button";
import { Avatar, AvatarFallback } from "@/ui-lab/components/ui/avatar";
import { Badge } from "@/ui-lab/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui-lab/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/ui-lab/components/ui/table";
import { Separator } from "@/ui-lab/components/ui/separator";
import {
  Patient,
  mockPatientsList,
  mockTherapies,
  mockUpcomingAppointments,
} from "@/ui-lab/mock-data";

interface PatientDetailScreenProps {
  patientId: number;
}

export default function PatientDetailScreen({
  patientId,
}: PatientDetailScreenProps) {
  const patient: Patient =
    mockPatientsList.find((p) => p.id === patientId) || mockPatientsList[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/ui-lab/patients"
        className="inline-flex items-center text-gray-500 hover:text-blue-600 text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Nazad na listu pacijenata
      </Link>

      {/* Patient Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-600 text-white text-xl font-semibold">
              {patient.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
              <span>
                {patient.age} godina &middot; Datum rođenja: {patient.dateOfBirth}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {patient.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {patient.email}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1.5" />
              Zakaži termin
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1.5" />
              Izveštaj
            </Button>
            <Button size="sm">Izmeni pacijenta</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="text-sm">
            Pregled pacijenta
          </TabsTrigger>
          <TabsTrigger value="therapies" className="text-sm">
            Terapije i termini
          </TabsTrigger>
          <TabsTrigger value="xray" className="text-sm">
            Rendgen snimci
          </TabsTrigger>
          <TabsTrigger value="photos" className="text-sm">
            Fotografije
          </TabsTrigger>
          <TabsTrigger value="ortho" className="text-sm">
            Orto karton
          </TabsTrigger>
          <TabsTrigger value="dental" className="text-sm">
            Stomatološki karton
          </TabsTrigger>
          <TabsTrigger value="report" className="text-sm">
            Izveštaj
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Pregled pacijenta */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Lični podaci</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Ime i prezime</dt>
                  <dd className="text-gray-900 font-medium">
                    {patient.firstName} {patient.lastName}
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-gray-500">Datum rođenja</dt>
                  <dd className="text-gray-900">{patient.dateOfBirth}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-gray-500">Telefon</dt>
                  <dd className="text-gray-900">{patient.phone}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="text-gray-900">{patient.email}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-gray-500">Lokacija</dt>
                  <dd className="text-gray-900">{patient.location}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Napomene</h3>
              <p className="text-sm text-gray-500">
                Pacijent nema alergije na lekove. Redovne kontrole na svakih 6
                meseci. Poslednji rendgen snimak: januar 2026.
              </p>
              <Separator className="my-4" />
              <h3 className="font-semibold text-gray-900 mb-3">Osiguranje</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tip</dt>
                  <dd className="text-gray-900">RFZO</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Broj kartona</dt>
                  <dd className="text-gray-900">BG-2026-{patient.id.toString().padStart(4, "0")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Terapije i termini */}
        <TabsContent value="therapies" className="mt-4 space-y-6">
          {/* Zakazani termini */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Zakazani termini
            </h3>
            <div className="space-y-3">
              {mockUpcomingAppointments.map((apt, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <div className="text-sm font-semibold text-blue-700 w-20">
                    {apt.date}
                  </div>
                  <div className="text-sm font-semibold text-blue-700 w-14">
                    {apt.time}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {apt.procedure}
                    </div>
                    <div className="text-xs text-gray-500">{apt.dentist}</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    Zakazano
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Istorija terapija */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-600" />
              Istorija terapija
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Procedura</TableHead>
                  <TableHead>Doktor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Napomena</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTherapies.map((therapy, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-gray-500">{therapy.date}</TableCell>
                    <TableCell className="font-medium">{therapy.procedure}</TableCell>
                    <TableCell className="text-gray-500">{therapy.dentist}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          therapy.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-blue-100 text-blue-800 border-blue-300"
                        }
                      >
                        {therapy.status === "completed" ? "Završeno" : "Zakazano"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 max-w-xs truncate">
                      {therapy.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 3: Rendgen snimci */}
        <TabsContent value="xray" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Rendgen snimci</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
              Ovde se prikazuju svi rendgen snimci pacijenta. Možete dodati nove
              snimke ili pregledati postojeće.
            </p>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 max-w-md mx-auto">
              <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">
                Prevucite snimke ovde ili kliknite za otpremanje
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Fotografije */}
        <TabsContent value="photos" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fotografije</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
              Galerija kliničkih fotografija pacijenta. Snimci pre i posle
              tretmana.
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center"
                >
                  <ImageIcon className="h-6 w-6 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 5: Orto karton */}
        <TabsContent value="ortho" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Stethoscope className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Ortodontski karton
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
              Ortodontski karton sadrži podatke o ortodontskom tretmanu
              pacijenta, uključujući početno stanje, plan lečenja i napredak.
            </p>
            <div className="flex justify-center gap-2 text-sm text-gray-400">
              <Badge variant="outline">Početno stanje</Badge>
              <Badge variant="outline">Plan lečenja</Badge>
              <Badge variant="outline">Napredak</Badge>
            </div>
          </div>
        </TabsContent>

        {/* Tab 6: Stomatološki karton */}
        <TabsContent value="dental" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Stomatološki karton
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
              Interaktivni dijagram zuba sa stanjem svakog zuba. Ovde se
              evidentiraju svi stomatološki nalazi i procedure po zubu.
            </p>
            <div className="border border-gray-200 rounded-xl p-6 max-w-lg mx-auto bg-gray-50">
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: 16 }, (_, i) => (
                  <div
                    key={`top-${i}`}
                    className="aspect-square rounded bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-400 font-mono"
                  >
                    {18 - i > 10 ? 18 - i : `0${18 - i}`}
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: 16 }, (_, i) => (
                  <div
                    key={`bottom-${i}`}
                    className="aspect-square rounded bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-400 font-mono"
                  >
                    {48 - i > 40 ? 48 - i : `0${48 - i}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 7: Izveštaj */}
        <TabsContent value="report" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Izveštaj</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Generišite kompletan izveštaj za pacijenta koji uključuje istoriju
              terapija, nalaze i preporuke.
            </p>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generiši izveštaj
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
