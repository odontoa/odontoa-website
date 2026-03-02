import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuth } from "@/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import odontoaLogo from "@/assets/Full_logo_vertical_color.png";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
// import { toast } from "sonner";

export const Login = () => {
  const { mutate: loginDentist } = useLogin();
  const { login } = useAuth();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const form = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    loginDentist(data, {
      onSuccess: (data) => {
        login(data.access_token);
        navigate("/");
      },
      onError: (error) => {
        const axiosError = error as AxiosError<any>;
        const data: any = axiosError.response?.data;
        const status = axiosError.response?.status;

        // Normalize potential array of messages from backend
        const rawMessage =
          (Array.isArray(data?.message)
            ? data.message.join("\n")
            : data?.message) ||
          data?.error ||
          "";

        // Heuristics based on status code and message content
        let backendMessage = rawMessage?.toString().trim();
        if (!backendMessage) {
          if (status === 404) backendMessage = t("auth.emailNotFound");
          else if (status === 401) backendMessage = t("auth.wrongEmailOrPassword");
          else if (status === 400)
            backendMessage = t("auth.invalidData");
        }

        // Refine if backend message hints at specific field
        const msgLower = (backendMessage || "").toLowerCase();
        if (status === 401 || status === 400) {
          if (msgLower.includes("password") || msgLower.includes("loz")) {
            backendMessage = t("auth.wrongPassword");
          } else if (
            msgLower.includes("email") &&
            (msgLower.includes("ne postoji") || msgLower.includes("not found"))
          ) {
            backendMessage = t("auth.emailNotFound");
          } else if (msgLower.includes("email")) {
            backendMessage = t("auth.wrongEmail");
          }
        }

        if (axiosError.code === "ERR_NETWORK") {
          backendMessage = t("auth.serverUnavailable");
        }
        if (!backendMessage)
          backendMessage = axiosError.message || t("auth.loginFailed");

        console.error("Login error:", backendMessage, axiosError);
        // toast(backendMessage);
        // Prefer field-level errors when we can infer the field; otherwise show root error
        if (
          status === 404 ||
          (msgLower.includes("email") &&
            (msgLower.includes("ne postoji") || msgLower.includes("not found")))
        ) {
          form.setError("email", {
            type: "server",
            message: t("auth.emailNotFound"),
          });
        } else if (
          status === 401 &&
          (msgLower.includes("password") || msgLower.includes("loz"))
        ) {
          form.setError("password", {
            type: "server",
            message: t("auth.wrongPassword"),
          });
        } else {
          form.setError("root", { type: "server", message: backendMessage });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-2">
          <img src={odontoaLogo} alt="Odontoa Logo" className="p-10" />

          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-semibold text-center">
                {t("auth.welcome")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("auth.loginPrompt")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.emailAddress")}</FormLabel>
                        <FormControl>
                          <Input
                            onChange={field.onChange}
                            placeholder={t("auth.enterEmail")}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input
                            onChange={field.onChange}
                            placeholder={t("auth.enterPassword")}
                            className="h-11"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.root && (
                    <p className="text-red-500 text-sm text-center">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                  >
                    {t("auth.login")}
                  </Button>
                </form>
              </Form>

              {/* <Separator className="my-4" />

              <div className="text-center text-sm text-gray-600">
                Need help accessing your account?{" "}
                <Link
                  to="/support"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Contact IT Support
                </Link>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// import { useNavigate } from "react-router-dom";
// import api from "@/api/axios";
// import { Button } from "@/components/ui/Button";
// import { useAuth } from "@/auth/AuthContext";
// import { toast } from "sonner";

// export const Login = () => {
//   const navigate = useNavigate();
//   const { login, isAuthenticated } = useAuth();

//   const handleLogin = async () => {
//     const response = await api.post("/auth/login", {
//       email: "aleksa1@gmail.com",
//       password: "123",
//     });
//     login(response.data.access_token);
//     navigate("/", { replace: true });
//   };

//   if (isAuthenticated) {
//     toast("Vec ste ulogovani");
//     navigate("/", { replace: true });
//   }

//   return <Button onClick={handleLogin}>Login</Button>;
// };
