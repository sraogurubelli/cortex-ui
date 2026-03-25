import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout, Text, Button, Card, FormInput, FormWrapper } from '@harnessio/ui/components';
import { useAuth } from '@cortex/core';

const OAUTH_URLS: Record<string, string | undefined> = {
  github: import.meta.env.VITE_OAUTH_GITHUB_URL,
  linkedin: import.meta.env.VITE_OAUTH_LINKEDIN_URL,
  google: import.meta.env.VITE_OAUTH_GOOGLE_URL,
  azure: import.meta.env.VITE_OAUTH_AZURE_URL,
};

const FALLBACK_URLS: Record<string, string> = {
  github: 'https://github.com',
  linkedin: 'https://www.linkedin.com',
  google: 'https://google.com',
  azure: 'https://azure.microsoft.com',
};

const SSO_URL = import.meta.env.VITE_OAUTH_SSO_URL;

function handleSocialClick(provider: keyof typeof OAUTH_URLS) {
  const url = OAUTH_URLS[provider] || FALLBACK_URLS[provider];
  if (OAUTH_URLS[provider]) {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function handleSsoClick() {
  if (SSO_URL) {
    window.location.href = SSO_URL;
  }
}

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState('');

  const formMethods = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const { register, handleSubmit, setError: setFormError, clearErrors } = formMethods;

  // Get the page they tried to visit before being redirected to login
  const from = (location.state as any)?.from?.pathname || '/';

  const onSubmit = async (data: SignInFormData) => {
    setServerError('');
    clearErrors();

    try {
      await login({ email: data.email, password: data.password, rememberMe });

      // Redirect to where they came from or home
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in. Please check your credentials.';
      setServerError(errorMessage);
      setFormError('password', { type: 'manual', message: errorMessage });
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
                Sign in
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-2">
                Evals for Agents
              </Text>
            </Layout.Vertical>
          </Layout.Vertical>

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
                placeholder="email@work.com"
                autoComplete="email"
                {...register('email')}
                disabled={isLoading}
                autoFocus
              />

              <Layout.Vertical gapY="xs">
                <Layout.Horizontal justify="between" align="center">
                  <Text variant="body-strong" className="cn-text-foreground-1">
                    Password
                  </Text>
                  <Link
                    to="/signin/forgot"
                    className="text-sm cn-text-brand-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </Layout.Horizontal>
                <FormInput.Text
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  disabled={isLoading}
                />
              </Layout.Vertical>

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-cn-border-1"
                />
                <Text variant="body-normal" className="cn-text-foreground-2">
                  Remember me
                </Text>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Layout.Vertical>
          </FormWrapper>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t cn-border-border-1" />
            </div>
            <div className="relative flex justify-center">
              <Text variant="body-normal" className="cn-bg-background-1 px-3 cn-text-foreground-3">
                or login with
              </Text>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              className="w-11 h-11 flex items-center justify-center rounded-md border cn-border-border-1 cn-bg-background-1 hover:cn-bg-background-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="GitHub"
              title="GitHub"
              onClick={() => handleSocialClick('github')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </button>
            <button
              type="button"
              className="w-11 h-11 flex items-center justify-center rounded-md border cn-border-border-1 cn-bg-background-1 hover:cn-bg-background-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="LinkedIn"
              title="LinkedIn"
              onClick={() => handleSocialClick('linkedin')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
            <button
              type="button"
              className="w-11 h-11 flex items-center justify-center rounded-md border cn-border-border-1 cn-bg-background-1 hover:cn-bg-background-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Google"
              title="Google"
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
            </button>
            <button
              type="button"
              className="w-11 h-11 flex items-center justify-center rounded-md border cn-border-border-1 cn-bg-background-1 hover:cn-bg-background-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Azure"
              title="Azure"
              onClick={() => handleSocialClick('azure')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0078D4" aria-hidden>
                <path d="M5.483 21.3H2.75a.483.483 0 01-.483-.483V3.183c0-.267.216-.483.483-.483h2.733l10.45 8.334 4.567-2.834-10.45 12.3H5.483zM22.95 10.2l-4.567 2.834-4.084-3.267 4.084-2.567L22.95 10.2zm-6.517 5.383l-2.834 4.567-4.084-3.267 2.834-4.567 4.084 3.267zM6.783 3.667v14.666l7.334-5.733-7.334-8.933z" />
              </svg>
            </button>
          </div>

          {/* SSO Button */}
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full"
            onClick={handleSsoClick}
            disabled={isLoading || !SSO_URL}
          >
            ☁️ Single sign-on
          </Button>

          {/* Footer */}
          <Text variant="body-normal" className="text-center cn-text-foreground-2">
            No account?{' '}
            <Link to="/signup" className="cn-text-brand-primary hover:underline">
              Sign up
            </Link>
          </Text>
        </Layout.Vertical>
      </Card.Root>

      {/* Legal */}
      <Text variant="body-normal" className="mt-8 text-center max-w-md cn-text-foreground-3">
        By signing in, you agree to our{' '}
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
