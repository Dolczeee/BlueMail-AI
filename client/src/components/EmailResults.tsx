import { useState } from "react";
import { Eye, Crown, Sparkles, AlignLeft, Code, Download, AlertCircle, MailOpen, Loader2, Tag, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { GeneratedEmail } from "@/pages/home";

interface EmailResultsProps {
  generatedEmail: GeneratedEmail | null;
  isLoading: boolean;
  error: string | null;
}

export default function EmailResults({ generatedEmail, isLoading, error }: EmailResultsProps) {
  const exportToHtml = () => {
    if (!generatedEmail) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${generatedEmail.mainSubject}</title>
    <style>
        body { 
            font-family: 'Inter', Arial, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 20px; 
            background-color: #f8fafc; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #87CEEB, #9370DB); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content { 
            padding: 30px 20px; 
            color: #374151;
        }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${generatedEmail.mainSubject}</h1>
        </div>
        <div class="content">
            ${generatedEmail.textContent.replace(/\n/g, '<br>')}
        </div>
        <div class="footer">
            Wygenerowano przez BlueMail AI
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wygenerowany-email.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  };

  return (
    <Card className="glass-card rounded-xl shadow-sm border-gray-200/50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-7 h-7 gradient-bg rounded-md flex items-center justify-center shadow-sm">
            <Eye className="text-white text-sm" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">Wygenerowany E-mail</h3>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--baby-blue))]" />
              <span className="text-gray-600">Generowanie e-maila...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <span className="font-medium">Błąd podczas generowania:</span> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && !error && !generatedEmail && (
          <div className="text-center py-12 text-gray-500">
            <MailOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Gotowy do rozpoczęcia?</p>
            <p className="text-sm">Wypełnij formularz po lewej stronie i wygeneruj swój pierwszy e-mail z AI.</p>
          </div>
        )}

        {/* Results Content */}
        {generatedEmail && !isLoading && (
          <div className="space-y-6">
            {/* Main Email Subject - Golden Theme */}
            <div className="bg-gradient-to-r from-[hsl(var(--golden-light))] to-[hsl(var(--golden-light))]/80 border-2 border-[hsl(var(--golden-amber))]/20 rounded-xl p-6 shadow-lg">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <Crown className="w-5 h-5 mr-2 text-[hsl(var(--golden-amber))]" />
                <span className="text-[hsl(var(--golden-amber))]">Główny temat</span>
              </h4>
              <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                {generatedEmail.mainSubject}
              </p>
            </div>

            {/* Alternative Subjects - Pink Theme */}
            <div className="bg-gradient-to-r from-[hsl(var(--pink-light))] to-[hsl(var(--pink-light))]/80 border-2 border-[hsl(var(--pink-rose))]/20 rounded-xl p-6 shadow-lg">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[hsl(var(--pink-rose))]" />
                <span className="text-[hsl(var(--pink-rose))]">Alternatywne tematy</span>
              </h4>
              <ul className="space-y-3">
                {generatedEmail.alternativeSubjects.map((subject, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-[hsl(var(--pink-rose))] font-bold mt-1 text-lg">•</span>
                    <span className="text-gray-800 font-medium">{subject}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Content Tabs */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-gray-50 border-b border-gray-200 rounded-none">
                  <TabsTrigger 
                    value="text" 
                    className="data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--baby-blue))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--baby-blue))]"
                  >
                    <AlignLeft className="w-4 h-4 mr-2" />
                    Widok tekstowy
                  </TabsTrigger>
                  <TabsTrigger 
                    value="html" 
                    className="data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--baby-blue))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--baby-blue))]"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Widok HTML
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="p-6 mt-0">
                  <div 
                    className="prose max-w-none text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: generatedEmail.textContent.replace(/\n/g, '<br>') 
                    }}
                  />
                </TabsContent>

                <TabsContent value="html" className="p-6 mt-0">
                  <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <code 
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ 
                        __html: escapeHtml(generatedEmail.htmlContent) 
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <Button 
                onClick={exportToHtml}
                className="gradient-bg text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Eksportuj do HTML
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
