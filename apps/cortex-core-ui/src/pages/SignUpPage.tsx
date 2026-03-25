import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout, Text, Button, Card, FormInput, FormWrapper } from '@harnessio/ui/components';
import { useAuth } from '@cortex/core';

const OAUTH_URLS: Record<string, string | undefined> = {
  github: import.meta.env.VITE_OAUTH_GITHUB_URL,
  google: import.meta.env.VITE_OAUTH_GOOGLE_URL,
};

const FALLBACK_URLS: Record<string, string> = {
  github: 'https://github.com',
  google: 'https://google.com',
};

function handleSocialClick(provider: keyof typeof OAUTH_URLS) {
  const url = OAUTH_URLS[provider] || FALLBACK_URLS[provider];
  if (OAUTH_URLS[provider]) {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

const signUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .min(2, 'Display name must be at least 2 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [serverError, setServerError] = useState('');

  const formMethods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { register, handleSubmit, setError: setFormError, clearErrors } = formMethods;

  const onSubmit = async (data: SignUpFormData) => {
    setServerError('');
    clearErrors();

    try {
      await signup({ email: data.email, displayName: data.displayName });

      // Redirect to home after successful signup
      navigate('/', { replace: true });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up. Please try again.';
      setServerError(errorMessage);
      setFormError('email', { type: 'manual', message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen cn-bg-background-4 flex flex-col items-center justify-center p-6">
      <Card.Root className="w-full max-w-md p-10 shadow-lg">
        <Layout.Vertical gapY="lg">
          {/* Logo and Title */}
          <Layout.Vertical gapY="md" align="center">
            <Text variant="heading-base" className="cn-text-foreground-1">
              Cortex
            </Text>
            <Layout.Vertical gapY="xs" align="center">
              <Text variant="heading-subsection" className="cn-text-foreground-1">
                Sign up
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-2">
                Get started for free. No credit card required.
              </Text>
            </Layout.Vertical>
          </Layout.Vertical>

          {/* Social Login Buttons */}
          <Layout.Vertical gapY="sm">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full flex items-center justify-center gap-3"
              onClick={() => handleSocialClick('google')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full flex items-center justify-center gap-3"
              onClick={() => handleSocialClick('github')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with Github
            </Button>
          </Layout.Vertical>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t cn-border-border-1" />
            </div>
            <div className="relative flex justify-center">
              <Text variant="body-normal" className="cn-bg-background-1 px-3 cn-text-foreground-3">
                OR
              </Text>
            </div>
          </div>

          {/* Error Message */}
          {serverError && (
            <div className="p-3 rounded-md cn-bg-destructive-1 border cn-border-destructive-border">
              <Text variant="body-normal" className="cn-text-destructive-foreground">
                {serverError}
              </Text>
            </div>
          )}

          {/* Form */}
          <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
            <Layout.Vertical gapY="md">
              <FormInput.Text
                id="email"
                label="Email"
                type="email"
                placeholder="email@work.com"
                autoComplete="email"
                {...register('email')}
                disabled={isLoading}
                autoFocus
              />

              <FormInput.Text
                id="displayName"
                label="Display Name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                {...register('displayName')}
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign up with Email'}
              </Button>
            </Layout.Vertical>
          </FormWrapper>

          {/* Footer */}
          <Text variant="body-normal" className="text-center cn-text-foreground-2">
            Already have an account?{' '}
            <Link to="/signin" className="cn-text-brand-primary hover:underline">
              Sign in
            </Link>
          </Text>
        </Layout.Vertical>
      </Card.Root>

      {/* Legal */}
      <Text variant="body-normal" className="mt-8 text-center max-w-md cn-text-foreground-3">
        By signing up, you agree to our{' '}
        <Link to="/privacy" className="cn-text-brand-primary hover:underline">
          Privacy Policy
        </Link>{' '}
        and our{' '}
        <Link to="/terms" className="cn-text-brand-primary hover:underline">
          Terms of Use
        </Link>
        .
      </Text>
    </div>
  );
}
