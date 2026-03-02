import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useGetCephalometric } from "@/hooks/orthoCard/useGetCephalometric";
import { useUpdateCephalometric } from "@/hooks/orthoCard/useUpdateCephalometric";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { get } from "lodash";
import OrthoCardSubHeader from "@/components/patients/OrthoCardSubHeader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cephalometricAnalysisSchema, type CephalometricAnalysisFormData } from "@/lib/schemas/cephalometricAnalysis";
import { Loading } from "@/components/ui/loading";
import { CalendarIcon } from "lucide-react";
import { useAnalysisEditingMode } from "@/hooks/store/useAnalysisEditingMode";
import { StickyActions } from "@/components/sticky-actions";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/utils";

interface MeasurementField {
  key: keyof CephalometricAnalysisFormData["measurements"];
  labelKey: string;
  averageValue: string;
}

const getMeasurements = (t: (key: string) => string): MeasurementField[] => [
  { key: "snaAngle", labelKey: "SNA", averageValue: "82°" },
  { key: "snbAngle", labelKey: "SNB", averageValue: "80°" },
  { key: "anbAngle", labelKey: "ANB", averageValue: "2°" },
  { key: "snSppAngle", labelKey: "SN/SpP", averageValue: "12°" },
  { key: "snMpAngle", labelKey: "SN/MP", averageValue: "32°" },
  { key: "sppMpAngle", labelKey: "SpP/MP", averageValue: "20°" },
  { key: "nsarAngle", labelKey: "NSAr", averageValue: "123°" },
  { key: "sargoAngle", labelKey: "SArGo", averageValue: "143°" },
  { key: "argomeAngle", labelKey: "ArGoMe", averageValue: "130°" },
  {
    key: "bjorkPolygonSum",
    labelKey: t("orthoCard.cephalometricAnalysis.bjorkPolygonSum"),
    averageValue: "396°",
  },
  { key: "sgoLength", labelKey: "SGo", averageValue: "" },
  { key: "nmeLength", labelKey: "NMe", averageValue: "" },
  { key: "sgoNmeRatio", labelKey: "SGo:NMe x 100", averageValue: "62 - 65%" },
  { key: "iSppAngle", labelKey: "I/SpP", averageValue: "70° ± 5°" },
  { key: "iMpAngle", labelKey: "i/Mp", averageValue: "90° ± 3°" },
  { key: "iiAngle", labelKey: "I/i", averageValue: "135°" },
  { key: "nseLength", labelKey: "NSe", averageValue: "" },
  {
    key: "corpusMaxillaLength",
    labelKey: t("orthoCard.cephalometricAnalysis.corpusMaxilla"),
    averageValue: "70.0 NSe",
  },
  {
    key: "corpusMandibleLength",
    labelKey: t("orthoCard.cephalometricAnalysis.corpusMandible"),
    averageValue: "21.00 NSe",
  },
  {
    key: "ramusMandibleLength",
    labelKey: t("orthoCard.cephalometricAnalysis.ramusMandible"),
    averageValue: "47.7 Co-Po",
  },
];

export default function AnalysisPage() {
  const { t, i18n } = useTranslation();
  const { isEditing, cancelEditing } = useAnalysisEditingMode();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { data: cephalometric, isLoading, isError } = useGetCephalometric();
  const { mutate: updateCephalometric, isPending } = useUpdateCephalometric();
  
  const MEASUREMENTS = getMeasurements(t);

  const form = useForm<CephalometricAnalysisFormData>({
    resolver: zodResolver(cephalometricAnalysisSchema),
  });

  // Set default date when component mounts or data changes
  useEffect(() => {
    if (cephalometric) {
      // Set existing measurements if available
      if (cephalometric.measurements) {
        Object.entries(cephalometric.measurements).forEach(([key, value]) => {
          form.setValue(`measurements.${key}` as any, value);
        });
      }

      // Set existing finding if available
      if (cephalometric.finding) {
        form.setValue("finding", cephalometric.finding);
      }

      // Set existing image URL if available
      if (cephalometric.xrayImageUrl) {
        setPreviewUrl(cephalometric.xrayImageUrl);
      }
    } else if (!isLoading) {
      // If no data exists, set current date as default
    }
  }, [cephalometric, isLoading, form]);

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    form.setValue("xrayImage", file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const clearSelectedImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    form.setValue("xrayImage", null);
  };

  const openImageModal = () => {
    if (previewUrl) {
      setIsImageModalOpen(true);
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const onSubmit: SubmitHandler<CephalometricAnalysisFormData> = (data) => {
    const apiData = {
      measurements: data.measurements,
      finding: data.finding || null,
      xrayImage: selectedFile || null,
    };

    updateCephalometric(apiData);
    cancelEditing();
    setSelectedFile(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl && !cephalometric?.xrayImageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, cephalometric?.xrayImageUrl]);

  if (isLoading) {
    return (
      <div>
        <OrthoCardSubHeader />
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Loading size="md" showLogo={false} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <OrthoCardSubHeader />
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-red-600">{t("orthoCard.cephalometricAnalysis.errorLoading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <OrthoCardSubHeader />
      <div className="container mx-auto mt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border-0 p-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="mt-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {t("orthoCard.cephalometricAnalysis.title")}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">
                    {t("orthoCard.cephalometricAnalysis.description")}
                  </p>
                  {cephalometric?.updatedAt && (
                    <div className="flex items-center gap-2 my-4">
                      <CalendarIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {t("orthoCard.cephalometricAnalysis.lastUpdated")}: <span className="font-medium text-gray-800">
                          {format(new Date(cephalometric.updatedAt), "PPP 'u' HH:mm", { locale: getDateFnsLocale(i18n.language) })}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <StickyActions
                onSave={form.handleSubmit(onSubmit)}
              />

              <div className="grid grid-cols-1 gap-8">
                {/* Tabela merenja */}
                <div id="measurements" className="lg:col-span-2">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t("orthoCard.cephalometricAnalysis.parameter")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t("orthoCard.cephalometricAnalysis.measuredValue")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t("orthoCard.cephalometricAnalysis.averageValue")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {MEASUREMENTS.map((measurement, index) => {
                          const value = get(
                            cephalometric?.measurements,
                            measurement.key
                          );

                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {measurement.labelKey}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {isEditing ? (
                                  <FormField
                                    control={form.control}
                                    name={`measurements.${measurement.key}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            value={field.value?.toString() || ""}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              field.onChange(value === "" ? null : value);
                                            }}
                                            className="w-full p-1 border rounded"
                                            placeholder={t("orthoCard.cephalometricAnalysis.enterValue")}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ) : (
                                  value || "-"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {measurement.averageValue}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Slika i upload */}
                {selectedFile || previewUrl ? (
                  // Prikaz slike bez isprekidanog okvira
                  <div className="w-full">
                    {selectedFile ? (
                      <>
                        {previewUrl && (
                          <div className="relative mt-4 flex flex-col items-center">
                            <div
                              className="w-full max-w-2xl h-96 rounded border overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={openImageModal}
                            >
                              <img
                                src={previewUrl}
                                alt={t("orthoCard.cephalometricAnalysis.imagePreview")}
                                className="w-full h-full object-contain rounded"
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearSelectedImage();
                              }}
                              className="cursor-pointer absolute top-0 right-0 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 z-10"
                            >
                              &times;
                            </Button>
                          </div>
                        )}
                        <p className="text-center text-gray-600 mt-2">{t("orthoCard.cephalometricAnalysis.selectedFile")}: {selectedFile.name}</p>
                      </>
                    ) : previewUrl ? (
                      <div>
                        <div className="relative mt-4 flex flex-col items-center">
                          <div
                            className="w-full max-w-2xl h-96 rounded border overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={openImageModal}
                          >
                            <img
                              src={previewUrl}
                              alt={t("orthoCard.cephalometricAnalysis.analysisImage")}
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                        </div>
                        <p className="text-center text-gray-600 mt-2">{t("orthoCard.cephalometricAnalysis.existingImage")}</p>
                      </div>
                    ) : null}

                    {/* Upload opcija kada je editing mode i postoji slika */}
                    {isEditing && (
                      <div className="mt-4">
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleFileSelection(e.dataTransfer.files[0]);
                            }
                          }}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => document.getElementById("photo-upload")?.click()}
                        >
                          <div className="text-gray-500">
                            <p className="text-sm">{t("orthoCard.cephalometricAnalysis.clickToReplace")}</p>
                            <p className="text-xs text-gray-400 mt-1">{t("orthoCard.cephalometricAnalysis.newImageReplaces")}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Isprekidani okvir samo kada nema slike
                  <div
                    id="xray-image"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileSelection(e.dataTransfer.files[0]);
                      }
                    }}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => isEditing && document.getElementById("photo-upload")?.click()}
                  >
                    <div className="text-gray-500">
                      {isEditing ? t("orthoCard.cephalometricAnalysis.clickToUpload") : t("orthoCard.cephalometricAnalysis.noXrayImage")}
                    </div>
                  </div>
                )}
                <Input
                  id="photo-upload"
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                />
              </div>
              {isPending && (
                <div className="w-full flex flex-col justify-center items-center mt-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="relative">
                    {/* Pulsing circle background */}
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-2 bg-blue-300 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.2s' }}></div>

                    {/* Main spinner */}
                    <div className="relative w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

                    {/* Inner pulse */}
                    <div className="absolute inset-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-blue-700 animate-pulse">
                      {t("orthoCard.cephalometricAnalysis.uploadingImage")}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      {t("orthoCard.cephalometricAnalysis.pleaseWait")}
                    </p>
                  </div>

                  {/* Animated dots */}
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              {/* NALAZ */}
              <div id="finding" className="mt-8">
                <h3 className="text-lg font-medium mb-4">{t("orthoCard.cephalometricAnalysis.finding")}</h3>
                <FormField
                  control={form.control}
                  name="finding"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          value={field.value || ""}
                          onChange={(e) => isEditing && field.onChange(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full p-3 border rounded ${!isEditing ? "bg-gray-100" : ""}`}
                          rows={6}
                          placeholder={
                            isEditing ? t("orthoCard.cephalometricAnalysis.enterFinding") : t("orthoCard.cephalometricAnalysis.noFinding")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Image Modal with Zoom */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl" showCloseButton={false}>
          <div className="relative w-full h-full">
            {/* Header with close button */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2 backdrop-blur-sm rounded-lg p-2 bg-black/50">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{t("orthoCard.cephalometricAnalysis.xrayImage")}</h3>
                <p className="text-sm opacity-90">{t("orthoCard.cephalometricAnalysis.clickAndDrag")}</p>
              </div>
              <button
                onClick={closeImageModal}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 hover:scale-110"
                title={t("orthoCard.cephalometricAnalysis.close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Image container */}
            <div className="w-full h-full">
              {previewUrl ? (
                <ZoomableImage
                  src={previewUrl}
                  alt={t("orthoCard.cephalometricAnalysis.xrayImage")}
                  showControls={true}
                />
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
