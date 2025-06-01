import type { EmailFormData, GeneratedEmail } from "@/pages/home";

// API Configuration - using environment variable with fallback
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || "TU_WSTAW_SWÓJ_KLUCZ_API";
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

// Translation mappings for Polish form values
const translations = {
  emailType: {
    "newsletter": "Newsletter",
    "special-offer": "Oferta specjalna",
    "event-invitation": "Zaproszenie na wydarzenie",
    "thank-you": "Podziękowanie",
    "reminder": "Przypomnienie",
    "product-info": "Informacja o produkcie",
    "status-update": "Aktualizacja statusu",
    "survey": "Ankieta",
    "other": "Inne"
  },
  messagePurpose: {
    "increase-sales": "Zwiększenie sprzedaży",
    "build-relationships": "Budowanie relacji",
    "lead-generation": "Pozyskanie leadów",
    "promotion-info": "Informowanie o promocjach",
    "event-invitation": "Zapraszanie na wydarzenia",
    "customer-education": "Edukacja klientów",
    "customer-feedback": "Feedback od klientów"
  },
  targetAudience: {
    "new-customers": "Nowi klienci",
    "loyal-customers": "Stali klienci",
    "b2b-customers": "Klienci B2B",
    "b2c-customers": "Klienci B2C",
    "newsletter-subscribers": "Subskrybenci newslettera",
    "business-partners": "Partnerzy biznesowi",
    "employees": "Pracownicy",
    "young-professionals": "Młodzi profesjonaliści",
    "sme-owners": "Właściciele małych i średnich firm",
    "students": "Studenci i młodzież",
    "parents": "Rodzice z dziećmi",
    "seniors": "Seniorzy",
    "tech-enthusiasts": "Entuzjaści technologii",
    "fashion-lovers": "Miłośnicy mody i stylu",
    "fitness-enthusiasts": "Osoby aktywne fizycznie",
    "creative-people": "Osoby kreatywne"
  },
  communicationTone: {
    "formal": "Formalny",
    "friendly": "Przyjazny",
    "motivating": "Motywujący",
    "enthusiastic": "Entuzjastyczny",
    "neutral": "Neutralny",
    "humorous": "Humorystyczny"
  }
};

function createPrompt(formData: EmailFormData): string {
  const getTranslation = (category: keyof typeof translations, value: string) => {
    return translations[category][value as keyof typeof translations[typeof category]] || value;
  };

  return `Jesteś ekspertem od marketingu e-mailowego. Wygeneruj profesjonalny e-mail w języku polskim na podstawie następujących informacji:

Rodzaj e-maila: ${getTranslation('emailType', formData.emailType)}
Cel wiadomości: ${getTranslation('messagePurpose', formData.messagePurpose)}
Grupa docelowa: ${getTranslation('targetAudience', formData.targetAudience)}
Ton komunikacji: ${getTranslation('communicationTone', formData.communicationTone)}
Branża: ${formData.industry}
Propozycja wartości: ${formData.valueProposition}
Call to Action: ${formData.callToAction}
${formData.companyName ? `Nazwa firmy: ${formData.companyName}` : ''}

Wygeneruj e-mail zgodnie z następującym formatem:

GŁÓWNY_TEMAT: [napisz jeden główny, najbardziej atrakcyjny temat e-maila]

ALTERNATYWNE_TEMATY: [alternatywa 1] | [alternatywa 2] | [alternatywa 3]

TREŚĆ_TEKSTOWA: [napisz pełną treść e-maila w formacie tekstowym, profesjonalną i odpowiednią dla podanego celu]

TREŚĆ_HTML: [napisz tę samą treść w formacie HTML z odpowiednimi tagami]

Pamiętaj:
- Używaj języka polskiego
- Dostosuj styl do podanego tonu komunikacji
- Uwzględnij wszystkie podane informacje
- Stwórz treść angażującą i przekonującą
- Użyj odpowiedniego zwrotu grzecznościowego dla grupy docelowej`;
}

function parseAIResponse(text: string): GeneratedEmail {
  const lines = text.split('\n');
  let mainSubject = '';
  let alternativeSubjects: string[] = [];
  let textContent = '';
  let htmlContent = '';
  
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('GŁÓWNY_TEMAT:')) {
      mainSubject = trimmedLine.replace('GŁÓWNY_TEMAT:', '').trim();
    } else if (trimmedLine.startsWith('ALTERNATYWNE_TEMATY:')) {
      const subjects = trimmedLine.replace('ALTERNATYWNE_TEMATY:', '').trim();
      alternativeSubjects = subjects.split('|').map(s => s.trim()).filter(s => s.length > 0);
    } else if (trimmedLine.startsWith('TREŚĆ_TEKSTOWA:')) {
      currentSection = 'text';
      const initialContent = trimmedLine.replace('TREŚĆ_TEKSTOWA:', '').trim();
      textContent = initialContent ? initialContent + '\n' : '';
    } else if (trimmedLine.startsWith('TREŚĆ_HTML:')) {
      currentSection = 'html';
      const initialContent = trimmedLine.replace('TREŚĆ_HTML:', '').trim();
      htmlContent = initialContent ? initialContent + '\n' : '';
    } else if (currentSection === 'text' && !trimmedLine.startsWith('TREŚĆ_HTML:')) {
      textContent += line + '\n';
    } else if (currentSection === 'html') {
      htmlContent += line + '\n';
    }
  }

  // Ensure we have exactly 3 alternative subjects
  if (alternativeSubjects.length < 3) {
    const defaultAlternatives = [
      'Odkryj nasze najnowsze rozwiązania',
      'Specjalna oferta tylko dla Ciebie', 
      'Nie przegap tej wyjątkowej okazji'
    ];
    while (alternativeSubjects.length < 3) {
      alternativeSubjects.push(defaultAlternatives[alternativeSubjects.length] || `Alternatywa ${alternativeSubjects.length + 1}`);
    }
  }

  // Fallback values if parsing fails
  return {
    mainSubject: mainSubject || 'Profesjonalny e-mail marketingowy',
    alternativeSubjects: alternativeSubjects.slice(0, 3), // Ensure exactly 3 alternatives
    textContent: textContent.trim() || 'Treść e-maila została wygenerowana przez AI.',
    htmlContent: htmlContent.trim() || '<p>Treść e-maila została wygenerowana przez AI.</p>'
  };
}

export async function generateEmail(formData: EmailFormData): Promise<GeneratedEmail> {
  if (!API_KEY || API_KEY === "TU_WSTAW_SWÓJ_KLUCZ_API") {
    throw new Error('Klucz API Hugging Face nie został skonfigurowany. Skontaktuj się z administratorem.');
  }

  try {
    const prompt = createPrompt(formData);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Nieprawidłowy klucz API Hugging Face. Sprawdź konfigurację.');
      } else if (response.status === 402) {
        throw new Error('Problem z limitem API lub płatnościami. Sprawdź swoje konto Hugging Face lub użyj innego klucza API.');
      } else if (response.status === 503) {
        throw new Error('Model AI jest obecnie niedostępny. Spróbuj ponownie za chwilę.');
      } else {
        throw new Error(`Błąd API (${response.status}): ${response.statusText}`);
      }
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(`Błąd AI: ${result.error}`);
    }

    // Handle different response formats from Hugging Face
    let generatedText = '';
    if (Array.isArray(result) && result.length > 0) {
      generatedText = result[0].generated_text || result[0].text || '';
    } else if (result.generated_text) {
      generatedText = result.generated_text;
    } else if (result.text) {
      generatedText = result.text;
    } else {
      throw new Error('Nieprawidłowa odpowiedź z API AI');
    }

    if (!generatedText.trim()) {
      throw new Error('AI nie wygenerowało żadnej treści. Spróbuj ponownie z innymi parametrami.');
    }

    return parseAIResponse(generatedText);
    
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Wystąpił nieoczekiwany błąd podczas komunikacji z AI');
    }
  }
}
