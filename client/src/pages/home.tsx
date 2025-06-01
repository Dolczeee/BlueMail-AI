import { useState } from "react";
import { Mail, User, Phone } from "lucide-react";
import EmailGeneratorForm from "@/components/EmailGeneratorForm";
import EmailResults from "@/components/EmailResults";
import CreatorInfo from "@/components/CreatorInfo";

export interface EmailFormData {
  emailType: string;
  messagePurpose: string;
  targetAudience: string;
  communicationTone: string;
  industry: string;
  valueProposition: string;
  callToAction: string;
  companyName: string;
}

export interface GeneratedEmail {
  mainSubject: string;
  alternativeSubjects: string[];
  textContent: string;
  htmlContent: string;
}

export default function Home() {
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailGenerated = (email: GeneratedEmail) => {
    setGeneratedEmail(email);
    setError(null);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setGeneratedEmail(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--baby-blue))] via-[hsl(var(--soft-purple))] to-[hsl(var(--pink-rose))] rounded-xl flex items-center justify-center shadow-xl">
                <Mail className="text-white text-xl" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--baby-blue))] via-[hsl(var(--soft-purple))] to-[hsl(var(--pink-rose))] bg-clip-text text-transparent">
                BlueMail AI
              </h1>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-[hsl(var(--golden-light))] to-[hsl(var(--pink-light))] px-4 py-2 rounded-full border border-[hsl(var(--golden-amber))]/20 shadow-md">
              <span className="font-medium">Model AI: Mistral-7B-Instruct-v0.3</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* App Description */}
        <div className="glass-card rounded-xl shadow-sm p-6 mb-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Inteligentne narzędzie do generowania maili marketingowych
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Wykorzystaj sztuczną inteligencję do tworzenia profesjonalnych wiadomości e-mail dopasowanych do Twojej grupy odbiorców. 
              Prosty formularz i zaawansowane algorytmy AI pomogą Ci zwiększyć skuteczność kampanii marketingowych.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <EmailGeneratorForm
            onEmailGenerated={handleEmailGenerated}
            onLoadingChange={handleLoadingChange}
            onError={handleError}
          />
          <EmailResults
            generatedEmail={generatedEmail}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <CreatorInfo />
      </main>
    </div>
  );
}
