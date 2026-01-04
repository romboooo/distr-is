import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  Headphones,
  AudioLines,
  Waves,
  Music,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { loginUser } from '@/services/login';
import { PasswordInput } from '@/components/ui/password-input';

const loginSearchSchema = z.object({
  next: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: LoginPage,
});

const loginSchema = z.object({
  login: z.string().min(3, 'Login must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const next = search?.next || '/';
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const { login: authLogin } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
    mode: 'onSubmit',
  });

  useEffect(() => {
    // Clear errors when form fields change
    form.clearErrors();
    setFormError(null);
  }, [form]);

  async function onSubmit(values: FormValues) {
    setFormError(null);
    setIsLoading(true);

    try {
      // Use auth context instead of direct API call
      await loginUser({ login: values.login, password: values.password });
      // Redirect to next URL or dashboard
      navigate({ to: next });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex w-screen h-screen'>
      <Outlet></Outlet>
      {/* Login Form Side */}
      <div className='flex justify-center items-center px-4 sm:px-6 py-8 sm:py-12 w-full lg:w-1/2'>
        <div className='w-full max-w-sm'>
          {/* Mobile Logo */}
          <div className='lg:hidden flex justify-center mb-8'>
            <div className='relative w-16 h-16'>
              <div className='absolute inset-0 bg-primary/10 rounded-full' />
              <div className='relative flex justify-center items-center bg-muted rounded-full w-full h-full'>
                <Music className='w-8 h-8 text-primary' strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h1 className='mb-2 font-bold text-3xl text-center'>distr-is</h1>
          <p className='mb-6 text-muted-foreground text-sm text-center'>
            Your gateway to global music distribution
          </p>

          <Card>
            <CardHeader>
              <CardTitle className='text-center'>
                Sign in to your account
              </CardTitle>
              <CardDescription className='text-center'>
                Enter your credentials to access your studio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='login'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='artist_name'
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between items-center'>
                          <FormLabel>Password</FormLabel>
                          <Link
                            to='/forgot-password'
                            className='font-medium text-primary text-sm hover:underline'
                            search={{ next }}
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput
                            placeholder='••••••••'
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {formError && (
                    <Alert variant='destructive'>
                      <AlertCircle className='w-4 h-4' />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type='submit'
                    className='mt-2 py-6 w-full font-medium text-lg'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className='flex justify-center items-center'>
                        <span className='mr-2 border-2 border-primary-foreground border-t-transparent rounded-full w-4 h-4 animate-spin' />
                        Connecting...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>
              </Form>

              <div className='mt-6'>
                <Separator />
                <div className='mt-4 text-sm text-center'>
                  <span className='text-muted-foreground'>
                    New to distr-is?
                  </span>{' '}
                  <Link
                    to='/register'
                    search={{ next }}
                    className='font-medium text-primary hover:underline'
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='mt-6 pt-6 border-t text-muted-foreground text-xs text-center'>
            © {new Date().getFullYear()} distr-is Music Distribution. All rights
            reserved.
          </div>
        </div>
      </div>

      {/* Branding/Image Side */}
      <div className='hidden lg:flex flex-col justify-between items-center bg-muted p-12 lg:w-1/2'>
        {/* Logo and tagline */}
        <div className='mb-12 text-center'>
          <div className='relative mx-auto mb-6 w-24 h-24'>
            <div className='absolute inset-0 bg-primary/10 rounded-full' />
            <div className='relative flex justify-center items-center bg-background border rounded-full w-full h-full'>
              <Music className='w-12 h-12 text-primary' strokeWidth={1.2} />
            </div>
          </div>
          <h1 className='mb-2 font-bold text-4xl md:text-5xl'>distr-is</h1>
          <p className='max-w-md text-muted-foreground text-lg'>
            Professional Music Distribution Platform
          </p>
        </div>

        {/* Features list */}
        <div className='space-y-4 mb-12 w-full max-w-md'>
          <FeatureItem
            icon={<Headphones className='w-5 h-5 text-primary' />}
            title='Global Distribution'
            description='Release to 150+ platforms including Spotify, Apple Music, and TikTok'
          />
          <FeatureItem
            icon={<AudioLines className='w-5 h-5 text-primary' />}
            title='Real-time Analytics'
            description='Track streams, demographics and engagement across all platforms'
          />
          <FeatureItem
            icon={<Waves className='w-5 h-5 text-primary' />}
            title='Royalty Management'
            description='Automated revenue splits and transparent payment tracking'
          />
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className='hover:bg-muted/50 transition-colors'>
    <CardContent className='flex items-start gap-4'>
      <div className='bg-primary/10 mt-1 p-2 rounded-lg text-primary shrink-0'>
        {icon}
      </div>
      <div>
        <h3 className='font-medium text-lg'>{title}</h3>
        <p className='mt-1 text-muted-foreground text-sm'>{description}</p>
      </div>
    </CardContent>
  </Card>
);

function LoginPage() {
  return (
    <div className='flex justify-center items-center bg-background min-h-dvh'>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
