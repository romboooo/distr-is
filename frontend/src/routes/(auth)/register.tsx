import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Headphones, AudioLines, Waves, Music } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { registerUser } from '@/services/register';
import { createArtistProfile } from '@/services/artists';
import { createLabelProfile } from '@/services/labels';
import { registerSchema, type RegisterFormValues } from '@/services/schemas';
import { AccountTypeField } from '@/components/forms/account-type-field';
import { UserCredentialsFields } from '@/components/forms/user-credentials-fields';
import { LabelFields } from '@/components/forms/label-fields';
import { ArtistFields } from '@/components/forms/artist-fields';

const registerSearchSchema = z.object({
  next: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/register')({
  validateSearch: (search) => registerSearchSchema.parse(search),
  component: RegisterPage,
});


function RegisterForm() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const next = search?.next || "/dashboard";
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"ARTIST" | "LABEL">("ARTIST");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      type: "ARTIST",
      name: "",
      country: "",
      realName: "",
      login: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Watch for type changes to show/hide conditional fields
  const userType = form.watch("type");
  useEffect(() => {
    setAccountType(userType);
  }, [userType]);

  useEffect(() => {
    form.clearErrors();
    setFormError(null);
  }, [form]);

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    setIsLoading(true);

    try {
      // Step 1: Register user
      const userPayload = {
        login: values.login,
        password: values.password,
        type: values.type
      };

      const userResponse = await registerUser(userPayload);

      // Step 2: Create profile based on account type
      if (values.type === "ARTIST") {
        await createArtistProfile({
          name: values.name,
          country: values.country,
          realName: values.realName || null,
          userId: userResponse.id
        });
      } else if (values.type === "LABEL") {
        await createLabelProfile({
          contactName: values.contactName,
          country: values.country,
          phone: values.phone,
          userId: userResponse.id
        });
      }

      // Redirect to login after successful registration
      navigate({
        to: "/login",
        search: { next }
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-screen min-h-screen">
      {/* Registration Form Side */}
      <div className="flex justify-center items-center px-4 sm:px-6 py-8 sm:py-12 w-full lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-primary/10 rounded-full" />
              <div className="relative flex justify-center items-center bg-muted rounded-full w-full h-full">
                <Music className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h1 className="mb-2 font-bold text-3xl text-center">
            distr-is
          </h1>
          <p className="mb-6 text-muted-foreground text-sm text-center">
            Join the global music distribution platform
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Create your account</CardTitle>
              <CardDescription className="text-center">
                Start distributing your music worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <AccountTypeField control={form.control} />

                  <UserCredentialsFields
                    control={form.control}
                    isSubmitting={isLoading}
                  />

                  {/* Conditional Profile Fields */}
                  {accountType === "ARTIST" && (
                    <ArtistFields
                      control={form.control}
                      isSubmitting={isLoading}
                    />
                  )}

                  {accountType === "LABEL" && (
                    <LabelFields
                      control={form.control}
                      isSubmitting={isLoading}
                    />
                  )}

                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="mt-2 py-6 w-full font-medium text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex justify-center items-center">
                        <span className="mr-2 border-2 border-primary-foreground border-t-transparent rounded-full w-4 h-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <Separator />
                <div className="mt-4 text-sm text-center">
                  <span className="text-muted-foreground">Already have an account?</span>{" "}
                  <Link
                    to="/login"
                    search={{ next }}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 pt-6 border-t text-muted-foreground text-xs text-center">
            © {new Date().getFullYear()} distr-is Music Distribution. All rights reserved.
          </div>
        </div>
      </div>

      {/* Branding/Image Side */}
      <div className="hidden lg:flex flex-col justify-start items-center bg-muted p-12 lg:w-1/2">
        {/* Logo and tagline */}
        <div className="mb-12 text-center">
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div className="absolute inset-0 bg-primary/10 rounded-full" />
            <div className="relative flex justify-center items-center bg-background border rounded-full w-full h-full">
              <Music className="w-12 h-12 text-primary" strokeWidth={1.2} />
            </div>
          </div>
          <h1 className="mb-2 font-bold text-4xl md:text-5xl">
            distr-is
          </h1>
          <p className="max-w-md text-muted-foreground text-lg">
            Professional Music Distribution Platform
          </p>
        </div>

        {/* Features list */}
        <div className="space-y-4 mb-12 w-full max-w-md">
          <FeatureItem
            icon={<Headphones className="w-5 h-5 text-primary" />}
            title="Global Distribution"
            description="Release to 150+ platforms including Spotify, Apple Music, and TikTok"
          />
          <FeatureItem
            icon={<AudioLines className="w-5 h-5 text-primary" />}
            title="Real-time Analytics"
            description="Track streams, demographics and engagement across all platforms"
          />
          <FeatureItem
            icon={<Waves className="w-5 h-5 text-primary" />}
            title="Royalty Management"
            description="Automated revenue splits and transparent payment tracking"
          />
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string
}) => (
  <Card className="hover:bg-muted/50 transition-colors">
    <CardContent className="flex items-start gap-4">
      <div className="bg-primary/10 mt-1 p-2 rounded-lg text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      </div>
    </CardContent>
  </Card>
);

function RegisterPage() {
  return (
    <div className="flex justify-center items-center bg-background min-h-dvh">
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
