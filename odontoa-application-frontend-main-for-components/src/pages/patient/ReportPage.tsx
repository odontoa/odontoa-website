import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { useGetPatientById } from "@/hooks/patients/useGetPatientById";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { useCreateReport } from "@/hooks/reports/useCreateReport";
import { useGetReportsByPatientId } from "@/hooks/reports/useGetReportsByPatientId";
import { FileText, Printer, Save, Plus, FileDown } from "lucide-react";
import { toast } from "sonner";
import { calculateAge } from "@/lib/utils";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";

const ReportPage = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const patientId = parseInt(id!);

    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [reportTitle, setReportTitle] = useState("");
    const [reportContent, setReportContent] = useState("");

    const { data: patient, isLoading: patientLoading } = useGetPatientById();
    const { data: clinic, isLoading: clinicLoading } = useGetClinicById();
    const { data: reports, isLoading: reportsLoading } = useGetReportsByPatientId(patientId);
    const createReportMutation = useCreateReport();

    const handleCreateReport = async () => {
        if (!reportTitle.trim() || !reportContent.trim()) {
            toast.error(t("reports.enterTitleAndContent"));
            return;
        }

        try {
            await createReportMutation.mutateAsync({
                title: reportTitle,
                content: reportContent,
            });

            // Reset form
            setReportTitle("");
            setReportContent("");
            setIsCreatingNew(false);
        } catch (error) {
            console.error("Error creating report:", error);
        }
    };
      const handlePrint = (content: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            @page { size: A4; margin: 2cm; }
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .clinic-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .patient-info { margin-bottom: 30px; }
            .patient-info h2 { font-size: 18px; margin-bottom: 15px; }
            .info-item { margin-bottom: 8px; }
            .info-label { font-weight: bold; display: inline-block; width: 120px; }
            .report-title { font-size: 20px; font-weight: bold; text-align: center; margin: 30px 0 20px 0; }
            .report-content { white-space: pre-wrap; font-size: 14px; line-height: 1.8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">${clinic?.name || t("reports.defaultClinicName")}</div>
            <div>${clinic?.address || ''}</div>
            <div>${clinic?.city || ''}, ${clinic?.country || ''}</div>
            <div>${t("reports.phone")}: ${clinic?.phone || ''}</div>
          </div>
          
          <div class="patient-info">
            <h2>${t("reports.patientInfo")}</h2>
            <div class="info-item"><span class="info-label">${t("reports.fullName")}:</span> ${patient?.firstName} ${patient?.lastName}</div>
            <div class="info-item"><span class="info-label">${t("reports.cardNumber")}:</span> #${patient?.id}</div>
            <div class="info-item"><span class="info-label">${t("reports.birthDate")}:</span> ${patient?.birthDate ? new Date(patient.birthDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS') : ''}</div>
            <div class="info-item"><span class="info-label">${t("reports.age")}:</span> ${patient?.birthDate ? calculateAge(patient.birthDate) + ' ' + t("reports.years") : ''}</div>
            <div class="info-item"><span class="info-label">${t("reports.reportDate")}:</span> ${new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS')}</div>
          </div>
          
          <div class="report-title">${title}</div>
          <div class="report-content">${content}</div>
        </body>
        </html>
      `;
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Čekaj da se učita, zatim pokreni print i zatvori prozor
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
  };

    const handleSavePDF = async (content: string, title: string) => {
        try {
            // Kreiraj PDF direktno sa jsPDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const margin = 20;
            const maxWidth = pageWidth - 2 * margin;

            let yPosition = margin;

            // Header - Naziv klinike
            pdf.setFontSize(18);
            pdf.setFont("helvetica", "bold");
            const clinicName = clinic?.name || t("reports.defaultClinicName");
            pdf.text(clinicName, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;

            // Podaci o klinici
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            if (clinic?.address) {
                pdf.text(clinic.address, pageWidth / 2, yPosition, { align: 'center' });
                yPosition += 5;
            }
            if (clinic?.city && clinic?.country) {
                pdf.text(`${clinic.city}, ${clinic.country}`, pageWidth / 2, yPosition, { align: 'center' });
                yPosition += 5;
            }
            if (clinic?.phone) {
                pdf.text(`${t("reports.phone")}: ${clinic.phone}`, pageWidth / 2, yPosition, { align: 'center' });
                yPosition += 5;
            }

            // Linija ispod header-a
            yPosition += 10;
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 15;

            // Podaci o pacijentu
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(t("reports.patientInfo").toUpperCase(), margin, yPosition);
            yPosition += 10;

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");

            const dateLocale = i18n.language === 'en' ? 'en-US' : 'sr-RS';
            const patientData = [
                { label: `${t("reports.fullName")}:`, value: `${patient?.firstName || ''} ${patient?.lastName || ''}` },
                { label: `${t("reports.cardNumber")}:`, value: `#${patient?.id || ''}` },
                { label: `${t("reports.birthDate")}:`, value: patient?.birthDate ? new Date(patient.birthDate).toLocaleDateString(dateLocale) : '' },
                { label: `${t("reports.age")}:`, value: patient?.birthDate ? `${calculateAge(patient.birthDate)} ${t("reports.years")}` : '' },
                { label: `${t("reports.reportDate")}:`, value: new Date().toLocaleDateString(dateLocale) }
            ];

            patientData.forEach(item => {
                pdf.setFont("helvetica", "bold");
                pdf.text(item.label, margin, yPosition);
                pdf.setFont("helvetica", "normal");
                pdf.text(item.value, margin + 40, yPosition);
                yPosition += 6;
            });

            yPosition += 10;

            // Naslov izveštaja
            pdf.setFontSize(16);
            pdf.setFont("helvetica", "bold");
            pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            // Sadržaj izveštaja
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "normal");

            // Podeli sadržaj na redove i stranice
            const lines = content.split('\n');

            lines.forEach(line => {
                if (yPosition > pageHeight - margin - 20) {
                    pdf.addPage();
                    yPosition = margin;
                }

                if (line.trim()) {
                    const wrappedLines = pdf.splitTextToSize(line, maxWidth);
                    wrappedLines.forEach((wrappedLine: string) => {
                        if (yPosition > pageHeight - margin - 20) {
                            pdf.addPage();
                            yPosition = margin;
                        }
                        pdf.text(wrappedLine, margin, yPosition);
                        yPosition += 6;
                    });
                } else {
                    yPosition += 6; // Prazan red
                }
            });

            // Footer
            const totalPages = pdf.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setFont("helvetica", "normal");
                pdf.text(
                    `${t("reports.generatedOn")} ${new Date().toLocaleDateString(dateLocale)} - ${t("reports.pageOf", { current: i, total: totalPages })}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            // Sačuvaj PDF
            const fileName = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}_${patient?.firstName}_${patient?.lastName}.pdf`;
            pdf.save(fileName);

            toast.success(t("reports.pdfDownloaded"));
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error(t("reports.pdfError"));
        }
    };


    if (patientLoading || clinicLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loading size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("reports.title")}</h1>
                    <p className="text-gray-600 mt-1">
                        {t("reports.subtitle")} {patient?.firstName} {patient?.lastName}
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreatingNew(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("reports.newReport")}
                </Button>
            </div>

            {/* Create New Report Form */}
            {isCreatingNew && (
                <Card className="shadow-lg p-0 overflow-hidden">
                    <CardHeader className="bg-blue-50 border-b">
                        <CardTitle className="text-xl text-blue-900 flex items-center pt-4">
                            <FileText className="h-5 w-5 mr-2" />
                            {t("reports.creatingNewReport")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Clinic Memorandum */}
                        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center border">
                            <div className="text-xl font-bold text-blue-900 mb-2">
                                {clinic?.name || t("reports.defaultClinicName")}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>{clinic?.address}</div>
                                <div>{clinic?.city}, {clinic?.country}</div>
                                <div>{t("reports.phone")}: {clinic?.phone}</div>
                            </div>
                        </div>

                        {/* Patient Info */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold text-blue-900 mb-3">{t("reports.patientInfo")}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">{t("reports.fullName")}:</span>
                                    <div className="text-gray-900">{patient?.firstName} {patient?.lastName}</div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">{t("reports.birthDate")}:</span>
                                    <div className="text-gray-900">
                                        {new Date(patient?.birthDate!).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS')}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">{t("reports.age")}:</span>
                                    <div className="text-gray-900">{calculateAge(patient?.birthDate)}</div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">{t("reports.cardNumber")}:</span>
                                    <div className="text-gray-900">#{patient?.id}</div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">{t("reports.reportDate")}:</span>
                                    <div className="text-gray-900">
                                        {new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Report Form */}
                        <div className="space-y-4">
                            {/* <div>
                <Label htmlFor="reportDate">Datum izveštaja</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="mt-1"
                />
              </div> */}

                            <div>
                                <Label htmlFor="reportTitle">{t("reports.reportTitle")}</Label>
                                <Input
                                    id="reportTitle"
                                    placeholder={t("reports.titlePlaceholder")}
                                    value={reportTitle}
                                    onChange={(e) => setReportTitle(e.target.value)}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="reportContent">{t("reports.reportContent")}</Label>
                                <Textarea
                                    id="reportContent"
                                    placeholder={t("reports.contentPlaceholder")}
                                    value={reportContent}
                                    onChange={(e) => setReportContent(e.target.value)}
                                    className="mt-1 min-h-[300px] resize-none"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                            <Button
                                onClick={handleCreateReport}
                                disabled={createReportMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {createReportMutation.isPending ? t("reports.saving") : t("reports.save")}
                            </Button>

                            <Button
                                onClick={() => handlePrint(reportContent, reportTitle)}
                                variant="outline"
                                disabled={!reportContent.trim() || !reportTitle.trim()}
                            >
                                <Printer className="h-4 w-4 mr-2" />
                                {t("reports.print")}
                            </Button>

                            <Button
                                onClick={() => handleSavePDF(reportContent, reportTitle)}
                                variant="outline"
                                disabled={!reportContent.trim() || !reportTitle.trim()}
                            >
                                <FileDown className="h-4 w-4 mr-2" />
                                {t("reports.downloadPDF")}
                            </Button>

                            <Button
                                onClick={() => setIsCreatingNew(false)}
                                variant="outline"
                            >
                                {t("reports.cancel")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Existing Reports */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        {t("reports.existingReports")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {reportsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loading size="md" />
                        </div>
                    ) : reports && reports.data && reports.data.length > 0 ? (
                        <div className="space-y-4">
                            {reports.data.map((report) => (
                                <div
                                    key={report.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {report.createdAt ? new Date(report.createdAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS') : ''}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handlePrint(report.content, report.title)}
                                                variant="outline"
                                                size="sm"
                                                title={t("reports.print")}
                                            >
                                                <Printer className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleSavePDF(report.content, report.title)}
                                                variant="outline"
                                                size="sm"
                                                title={t("reports.downloadPDF")}
                                            >
                                                <FileDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                                        {report.content.length > 200
                                            ? `${report.content.substring(0, 200)}...`
                                            : report.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>{t("reports.noReports")}</p>
                            <p className="text-sm mt-2">{t("reports.noReportsDescription")}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportPage;
