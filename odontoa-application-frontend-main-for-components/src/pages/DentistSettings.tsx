import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingPage } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useGetDentistById } from "@/hooks/dentists/useGetDentistById";
import { useChangePassword, useUpdateDentist } from "@/hooks/dentists/useUpdateDentist";
import { useGetClinicById } from "@/hooks/clinics/useGetClinicById";
import { useDefaultChair } from "@/hooks/useDefaultChair";
import { useTranslation } from "react-i18next";

export const DentistSettings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: dentist, isLoading } = useGetDentistById(user?.sub || 0);
  const { mutate: updateDentist, isPending: isUpdating } = useUpdateDentist();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { data: clinic } = useGetClinicById();
  const { defaultChair, setDefaultChair } = useDefaultChair();

  // Basic info state
  const [basicInfo, setBasicInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Email state
  const [email, setEmail] = useState("");

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Chair selection state
  const [selectedChair, setSelectedChair] = useState<string>(defaultChair);

  // Initialize form data when dentist data loads
  useEffect(() => {
    if (dentist && !basicInfo.firstName) {
      setBasicInfo({
        firstName: dentist.firstName || "",
        lastName: dentist.lastName || "",
        phone: dentist.phone || "",
      });
      setEmail(dentist.email || "");
    }
  }, [dentist]);

  // Initialize chair selection from saved preference
  useEffect(() => {
    setSelectedChair(defaultChair);
  }, [defaultChair]);

  const handleApplyChanges = () => {
    // Validate password if it's being changed
    if (passwordData.newPassword || passwordData.currentPassword || passwordData.confirmPassword) {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error(t("settings.fillAllPasswordFields"));
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error(t("settings.passwordsDontMatch"));
        return;
      }
      if (passwordData.newPassword.length < 8) {
        toast.error(t("settings.passwordTooShort"));
        return;
      }
    }

    // Update basic info and email
    if (user?.sub) {
      updateDentist({
        id: user.sub,
        data: {
          firstName: basicInfo.firstName,
          lastName: basicInfo.lastName,
          phone: basicInfo.phone,
          email: email,
        },
      });
    }

    // Change password if provided
    if (passwordData.newPassword && passwordData.currentPassword) {
      changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }

    // Save default chair preference
    setDefaultChair(selectedChair);

    toast.success(t("settings.changesSaved"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingPage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t("settings.title")}</h1>
            <p className="text-gray-600">{t("settings.subtitle")}</p>
          </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.basicInfo")}</CardTitle>
              <CardDescription>{t("settings.basicInfoDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("common.firstName")}</Label>
                  <Input
                    id="firstName"
                    value={basicInfo.firstName}
                    onChange={(e) => setBasicInfo({ ...basicInfo, firstName: e.target.value })}
                    placeholder={t("settings.enterFirstName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("common.lastName")}</Label>
                  <Input
                    id="lastName"
                    value={basicInfo.lastName}
                    onChange={(e) => setBasicInfo({ ...basicInfo, lastName: e.target.value })}
                    placeholder={t("settings.enterLastName")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("common.phone")}</Label>
                <Input
                  id="phone"
                  value={basicInfo.phone}
                  onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                  placeholder="+381 60 123 4567"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.emailTitle")}</CardTitle>
              <CardDescription>{t("settings.emailDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("common.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Chair Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.defaultChair")}</CardTitle>
              <CardDescription>{t("settings.defaultChairDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chair">{t("settings.selectDefaultChair")}</Label>
                <Select
                  value={selectedChair}
                  onValueChange={setSelectedChair}
                  disabled={!clinic?.chairNumber || clinic.chairNumber === 0}
                >
                  <SelectTrigger id="chair" className="w-full">
                    <SelectValue placeholder={t("settings.selectChairPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {clinic?.chairNumber && clinic.chairNumber > 0
                      ? Array.from({ length: clinic.chairNumber }, (_, index) => {
                          const value = String(index + 1);
                          return (
                            <SelectItem key={value} value={value}>
                              {t("appointments.chair")} {value}
                            </SelectItem>
                          );
                        })
                      : (
                        <SelectItem value="1" disabled>
                          {t("settings.noChairsAvailable")}
                        </SelectItem>
                      )}
                  </SelectContent>
                </Select>
                {(!clinic?.chairNumber || clinic.chairNumber === 0) && (
                  <p className="text-sm text-gray-500">{t("settings.noChairsConfigured")}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.changePassword")}</CardTitle>
              <CardDescription>{t("settings.changePasswordDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t("settings.currentPassword")}</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder={t("settings.enterCurrentPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("settings.newPassword")}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder={t("settings.enterNewPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("settings.confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder={t("settings.confirmNewPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apply Changes Button */}
          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleApplyChanges} 
              disabled={isUpdating || isChangingPassword}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md font-semibold flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              {isUpdating || isChangingPassword ? t("settings.saving") : t("settings.applyChanges")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};