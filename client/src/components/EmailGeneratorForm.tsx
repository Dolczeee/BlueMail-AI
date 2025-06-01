import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2, Mail, Target, Users, MessageCircle, Building, Star, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmail } from "@/lib/emailGenerator";
import type { EmailFormData, GeneratedEmail } from "@/pages/home";

const formSchema = z.object({
  emailType: z.string().min(1, "Wybierz rodzaj e-maila"),
  messagePurpose: z.string().min(1, "Wybierz cel wiadomości"),
  targetAudience: z.string().min(1, "Wybierz grupę docelową"),
  communicationTone: z.string().min(1, "Wybierz ton komunikacji"),
  industry: z.string().min(1, "Podaj branżę i rodzaj biznesu"),
  valueProposition: z.string().min(1, "Opisz propozycję wartości"),
  callToAction: z.string().min(1, "Podaj wezwanie do działania"),
  companyName: z.string().optional(),
});

interface EmailGeneratorFormProps {
  onEmailGenerated: (email: GeneratedEmail) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string) => void;
}

export default function EmailGeneratorForm({ onEmailGenerated, onLoadingChange, onError }: EmailGeneratorFormProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailType: "",
      messagePurpose: "",
      targetAudience: "",
      communicationTone: "",
      industry: "",
      valueProposition: "",
      callToAction: "",
      companyName: "",
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      onLoadingChange(true);
      onError("");
      const result = await generateEmail(data);
      onEmailGenerated(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Wystąpił błąd podczas generowania e-maila");
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card className="glass-card rounded-xl shadow-sm border-gray-200/50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-7 h-7 gradient-bg rounded-md flex items-center justify-center shadow-sm">
            <Wand2 className="text-white text-sm" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">Generator Maili</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Type */}
            <FormField
              control={form.control}
              name="emailType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-[hsl(var(--baby-blue))]" />
                    Rodzaj e-maila
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-focus rounded-xl">
                        <SelectValue placeholder="Wybierz rodzaj e-maila" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="special-offer">Oferta specjalna</SelectItem>
                      <SelectItem value="event-invitation">Zaproszenie na wydarzenie</SelectItem>
                      <SelectItem value="thank-you">Podziękowanie</SelectItem>
                      <SelectItem value="reminder">Przypomnienie</SelectItem>
                      <SelectItem value="product-info">Informacja o produkcie</SelectItem>
                      <SelectItem value="status-update">Aktualizacja statusu</SelectItem>
                      <SelectItem value="survey">Ankieta</SelectItem>
                      <SelectItem value="other">Inne</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Purpose */}
            <FormField
              control={form.control}
              name="messagePurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Target className="w-4 h-4 mr-2 text-[hsl(var(--baby-blue))]" />
                    Cel wiadomości
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-focus rounded-xl">
                        <SelectValue placeholder="Wybierz cel wiadomości" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="increase-sales">Zwiększenie sprzedaży</SelectItem>
                      <SelectItem value="build-relationships">Budowanie relacji</SelectItem>
                      <SelectItem value="lead-generation">Pozyskanie leadów</SelectItem>
                      <SelectItem value="promotion-info">Informowanie o promocjach</SelectItem>
                      <SelectItem value="event-invitation">Zapraszanie na wydarzenia</SelectItem>
                      <SelectItem value="customer-education">Edukacja klientów</SelectItem>
                      <SelectItem value="customer-feedback">Feedback od klientów</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Audience */}
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-[hsl(var(--baby-blue))]" />
                    Grupa docelowa
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-focus rounded-xl">
                        <SelectValue placeholder="Wybierz grupę docelową" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new-customers">Nowi klienci</SelectItem>
                      <SelectItem value="loyal-customers">Stali klienci</SelectItem>
                      <SelectItem value="b2b-customers">Klienci B2B</SelectItem>
                      <SelectItem value="b2c-customers">Klienci B2C</SelectItem>
                      <SelectItem value="newsletter-subscribers">Subskrybenci newslettera</SelectItem>
                      <SelectItem value="business-partners">Partnerzy biznesowi</SelectItem>
                      <SelectItem value="employees">Pracownicy</SelectItem>
                      <SelectItem value="young-professionals">Młodzi profesjonaliści</SelectItem>
                      <SelectItem value="sme-owners">Właściciele małych i średnich firm</SelectItem>
                      <SelectItem value="students">Studenci i młodzież</SelectItem>
                      <SelectItem value="parents">Rodzice z dziećmi</SelectItem>
                      <SelectItem value="seniors">Seniorzy</SelectItem>
                      <SelectItem value="tech-enthusiasts">Entuzjaści technologii</SelectItem>
                      <SelectItem value="fashion-lovers">Miłośnicy mody i stylu</SelectItem>
                      <SelectItem value="fitness-enthusiasts">Osoby aktywne fizycznie</SelectItem>
                      <SelectItem value="creative-people">Osoby kreatywne</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Communication Tone */}
            <FormField
              control={form.control}
              name="communicationTone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <MessageCircle className="w-4 h-4 mr-2 text-[hsl(var(--baby-blue))]" />
                    Ton komunikacji
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-focus rounded-xl">
                        <SelectValue placeholder="Wybierz ton komunikacji" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="formal">Formalny</SelectItem>
                      <SelectItem value="friendly">Przyjazny</SelectItem>
                      <SelectItem value="motivating">Motywujący</SelectItem>
                      <SelectItem value="enthusiastic">Entuzjastyczny</SelectItem>
                      <SelectItem value="neutral">Neutralny</SelectItem>
                      <SelectItem value="humorous">Humorystyczny</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Industry */}
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Building className="w-4 h-4 mr-2 text-[hsl(var(--baby-blue))]" />
                    Branża i rodzaj biznesu
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="np. E-commerce, Technologia, Usługi finansowe..." 
                      className="input-focus rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value Proposition */}
            <FormField
              control={form.control}
              name="valueProposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Star className="w-4 h-4 mr-2 text-[hsl(var(--baby-blue))]" />
                    Propozycja wartości (UVP)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Opisz unikalną wartość, którą oferujesz klientom..."
                      className="input-focus rounded-xl resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Call to Action */}
            <FormField
              control={form.control}
              name="callToAction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <MousePointer className="w-4 h-4 mr-2 text-[hsl(var(--baby-blue))]" />
                    Wezwanie do działania (CTA)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="np. Kup teraz, Dowiedz się więcej, Zapisz się..." 
                      className="input-focus rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Building className="w-4 h-4 mr-2 text-[hsl(var(--baby-blue))]" />
                    Nazwa firmy (opcjonalnie)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nazwa Twojej firmy" 
                      className="input-focus rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Generate Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[hsl(var(--baby-blue))] via-[hsl(var(--soft-purple))] to-[hsl(var(--pink-rose))] text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-200"
              disabled={form.formState.isSubmitting}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {form.formState.isSubmitting ? "Generowanie..." : "Generuj E-mail z AI"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
