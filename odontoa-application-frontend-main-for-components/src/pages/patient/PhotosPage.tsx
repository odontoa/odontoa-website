import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useGetPhotos } from "@/hooks/orthoCard/useGetPhotos";
import { useCreatePhotos } from "@/hooks/orthoCard/useCreatePhotos";
import { useDeletePhotos } from "@/hooks/orthoCard/useDeletePhotos";
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
import { Image, X, Trash2 } from "lucide-react";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { photoSchema, type PhotoFormData } from "@/lib/schemas";
import { useTranslation } from "react-i18next";

export default function PhotosPage() {
  const { t, i18n } = useTranslation();
  const form = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      photoType: "",
      category: "",
      description: "",
      imageFile: undefined,
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: photos } = useGetPhotos();
  const { mutate: createPhotos, isPending } = useCreatePhotos();
  const { mutate: deletePhoto, isPending: isDeleting } = useDeletePhotos();

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

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleDeleteClick = (photoId: number) => {
    setDeleteConfirmId(photoId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deletePhoto(deleteConfirmId, {
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

  const onSubmit = async (data: PhotoFormData) => {
    if (!data.imageFile) {
      toast.warning(t("photos.noPhotos")); // This should be a different key, but using existing
      return;
    }

    try {
      createPhotos({ ...data, imageFile: data.imageFile });
      form.reset({
        photoType: "",
        category: "",
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
            <div className="p-2 lg:p-3 bg-pink-600 rounded-xl shadow-lg">
              <Image className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {t("photos.title")}
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1 flex items-center gap-2">
                <Image className="h-4 w-4" />
                {t("photos.subtitle")}
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
              {t("photos.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 p-4 border rounded-lg space-y-4">
                <h3 className="text-lg font-medium">{t("photos.addPhoto")}</h3>

                <FormField
                  control={form.control}
                  name="photoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        {t("photos.photoType")}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("common.select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Intraoralna">Intraoralna</SelectItem>
                          <SelectItem value="Ekstraoralna">Ekstraoralna</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        {t("photos.category")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="npr. Frontalni prikaz, Bukalni prikaz, Okluzija..."
                        />
                      </FormControl>
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
                        {t("photos.description")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          className="w-full p-2 border rounded"
                          rows={3}
                          placeholder={t("photos.description")}
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
                  onClick={() => document.getElementById("photo-upload")?.click()}
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
                  <div className="w-full flex flex-col justify-center items-center mt-4 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                    <div className="relative">
                      {/* Pulsing circle background */}
                      <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-2 bg-pink-300 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.2s' }}></div>

                      {/* Main spinner */}
                      <div className="relative w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>

                      {/* Inner pulse */}
                      <div className="absolute inset-3 bg-pink-500 rounded-full animate-pulse"></div>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-sm font-medium text-pink-700 animate-pulse">
                        {t("photos.uploading")}
                      </p>
                      <p className="text-xs text-pink-500 mt-1">
                        {t("common.loading")}
                      </p>
                    </div>

                    {/* Animated dots */}
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {t("photos.addPhoto")}
                </Button>
              </form>
            </Form>

            {/* Galerija snimaka */}
            {!photos ? (
              <div className="text-center py-8 text-gray-500">
                {t("photos.noPhotos")}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="aspect-square relative bg-gray-100 group">
                      <img
                        src={image.imageUrl}
                        alt={`Fotografija ${image.photoType}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-medium">{image.photoType}</p>
                      <p className="text-xs text-gray-400">
                        {image.createdAt ? new Date(image.createdAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'sr-RS', { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}
                      </p>
                      <p className="text-sm mt-1 truncate text-gray-600">{image.category}</p>
                      <p className="text-sm mt-1 truncate text-gray-500">{image.description}</p>
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
        <DialogContent className="max-w-7xl maxh-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl" showCloseButton={false}>
          <div className="relative w-full h-full">
            {/* Header with close button */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2 backdrop-blur-sm rounded-lg p-2 bg-black/50">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{selectedImage?.photoType}</h3>
                <p className="text-sm opacity-90">{selectedImage?.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteClick(selectedImage?.id)}
                  className="p-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                  title={t("photos.deletePhoto")}
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
            <div className="w-full h-full bg-gray-50">
              {selectedImage?.imageUrl ? (
                <ZoomableImage
                  src={selectedImage.imageUrl}
                  alt={`Fotografija ${selectedImage.photoType}`}
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
        title={t("photos.deletePhoto")}
        description={t("photos.deletePhotoConfirm")}
        variant="destructive"
        confirmText={t("photos.deletePhoto")}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}

