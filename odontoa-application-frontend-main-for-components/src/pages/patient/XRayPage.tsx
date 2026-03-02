import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useGetXrayImages } from "@/hooks/orthoCard/useGetXrayImages";
import { useCreateXrayImages } from "@/hooks/orthoCard/useCreateXrayImages";
import { useDeleteXrayImages } from "@/hooks/orthoCard/useDeleteXrayImages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { X, Trash2 } from "lucide-react";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { xrayImageSchema, type XrayImageFormData } from "@/lib/schemas";
import { useTranslation } from "react-i18next";

export default function XRayPage() {
  const { t, i18n } = useTranslation();
  const form = useForm<XrayImageFormData>({
    resolver: zodResolver(xrayImageSchema),
    defaultValues: {
      xrayType: "",
      description: "",
      imageFile: undefined,
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: xrayImages } = useGetXrayImages();
  const { mutate: createXrayImages, isPending } = useCreateXrayImages();
  const { mutate: deleteXrayImage, isPending: isDeleting } = useDeleteXrayImages();

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    form.setValue("imageFile", file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const clearSelectedImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    form.setValue("imageFile", undefined as any);
  };

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const handleDeleteClick = (imageId: number) => {
    setDeleteConfirmId(imageId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteXrayImage(deleteConfirmId, {
        onSuccess: () => {
          setDeleteConfirmId(null);
          if (selectedImage?.id === deleteConfirmId) {
            closeImageModal();
          }
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const onSubmit = async (data: XrayImageFormData) => {
    if (!data.imageFile) {
      toast.warning(t("xray.noXrays")); // This should be a different key, but using existing
      return;
    }

    try {
      createXrayImages({ ...data, imageFile: data.imageFile });
      form.reset({
        xrayType: "",
        description: "",
        imageFile: undefined
      });
      clearSelectedImage();
    } catch (error) {
      toast.error(t("errors.generic"));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>

        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-4 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 bg-purple-600 rounded-xl shadow-lg">
              <X className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {t("xray.title")}
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1 flex items-center gap-2">
                <X className="h-4 w-4" />
                {t("xray.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-800">
              {t("xray.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 p-4 border rounded-lg space-y-4">
                <h3 className="text-lg font-medium">{t("xray.addXray")}</h3>

                <FormField
                  control={form.control}
                  name="xrayType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        {t("xray.xrayType")}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("common.select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Panoramski">Panoramski</SelectItem>
                          <SelectItem value="Retroalveolarni">
                            Retroalveolarni
                          </SelectItem>
                          <SelectItem value="Bite-wing">Bite-wing</SelectItem>
                          <SelectItem value="CBCT">CBCT</SelectItem>
                          <SelectItem value="Drugi">Drugi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        {t("xray.description")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          className="w-full p-2 border rounded"
                          rows={3}
                          placeholder={t("xray.description")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileSelection(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => document.getElementById("xray-upload")?.click()}
                >
                  <p className="text-gray-500">
                    {selectedFile ? (
                      <div>
                        {previewUrl && (
                          <div className="relative mt-4 flex flex-col items-center">
                            <img
                              src={previewUrl}
                              alt="Pregled snimka"
                              className="rounded border max-w-[600px] object-center object-cover"
                            />
                            <Button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearSelectedImage();
                              }}
                              className=" cursor-pointer absolute top-0 right-0 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              &times;
                            </Button>
                          </div>
                        )}
                        {`Izabrani fajl: ${selectedFile.name}`}
                      </div>
                    ) : (
                      "Kliknite da otpremite snimak ili prevucite fajl ovde"
                    )}
                  </p>
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
                        {t("xray.uploading")}
                      </p>
                      <p className="text-xs text-blue-500 mt-1">
                        {t("common.loading")}
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
                <FormField
                  control={form.control}
                  name="imageFile"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="xray-upload"
                          className="hidden"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileSelection(e.target.files[0]);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isPending}
                >
                  {isPending ? t("common.loading") : t("xray.upload")}
                </Button>
              </form>
            </Form>

            {/* Galerija snimaka */}
            {!xrayImages ? (
              <div className="text-center py-8 text-gray-500">
                {t("xray.noXrays")}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {xrayImages.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="aspect-square relative bg-gray-100 group">
                      <img
                        src={image.imageUrl}
                        alt={`X-Ray ${image.xrayType}`}
                        className={`w-full h-full object-cover transition-opacity duration-200`}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-medium">{image.xrayType}</p>
                      <p className="text-xs text-gray-400">
                        {image.createdAt ? new Date(image.createdAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS', { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}
                      </p>
                      <p className="text-sm mt-1 truncate text-gray-600">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl" showCloseButton={false}>
          <div className="relative w-full h-full">
            {/* Header with close button */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2 backdrop-blur-sm rounded-lg p-2 bg-black/50">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{selectedImage?.xrayType}</h3>
                <p className="text-sm opacity-90">X-Ray Snimak</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteClick(selectedImage?.id)}
                  className="p-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                  title={t("xray.deleteXray")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={closeImageModal}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 hover:scale-110"
                  title={t("common.close")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Image container */}
            <div className="w-full h-full">
              {selectedImage?.imageUrl ? (
                <ZoomableImage
                  src={selectedImage.imageUrl}
                  alt={`X-Ray ${selectedImage.xrayType}`}
                  showControls={true}
                />
              ) : null}
            </div>

            {/* Footer with image info */}
            {selectedImage?.description && (
              <div className="absolute bottom-4 left-4 z-50 flex items-center gap-1 backdrop-blur-sm rounded-lg p-1 bg-black/50">
                <div className="text-white text-sm opacity-90 max-w-2xl px-2 py-1">
                  {selectedImage.description}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && handleCancelDelete()}
        title={t("xray.deleteXray")}
        description={t("xray.deleteXrayConfirm")}
        variant="destructive"
        confirmText={t("xray.deleteXray")}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}
