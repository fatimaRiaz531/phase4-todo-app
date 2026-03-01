import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ChatBot } from "@/components/chat/ChatBot";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "TodoApp - Manage Your Tasks",
  description: "A modern todo application with authentication and task management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-zinc-900 border border-zinc-800 text-white",
          headerTitle: "text-white text-2xl font-bold",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest",
          footerActionLink: "text-primary hover:text-primary/80",
          formFieldLabel: "text-zinc-300",
          formFieldInput: "bg-zinc-800 border-zinc-700 text-white",
          dividerLine: "bg-zinc-800",
          dividerText: "text-zinc-500",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="min-h-screen">
                {children}
              </div>
              <ChatBot />
            </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
