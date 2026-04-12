'use client';

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignIn
        routing="hash"
        appearance={{
          baseTheme: dark,
          variables: {
            colorBackground: '#111111',
            colorText: '#ffffff',
            colorTextSecondary: '#a0a0a0',
            colorPrimary: '#ffffff',
            colorInputBackground: '#1a1a1a',
            colorInputText: '#ffffff',
          },
          elements: {
            card: {
              backgroundColor: '#111111',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            },
            headerTitle: {
              color: '#ffffff',
            },
            headerSubtitle: {
              color: '#999999',
            },
            socialButtonsBlockButton: {
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#222222',
              },
            },
            footerActionLink: {
              color: '#ffffff',
            },
            formFieldInput: {
              backgroundColor: '#1a1a1a',
              borderColor: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
            },
            footer: {
              '& + div': {
                color: '#666666',
              },
            },
          },
        }}
      />
    </div>
  );
}