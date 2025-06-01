import { Card, CardContent } from "@/components/ui/card";

export default function CreatorInfo() {
  return (
    <Card className="mt-8 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/30">
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Informacje o aplikacji</h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="space-y-1">
              <p><strong>Twórca:</strong> Julia Bloch</p>
              <p><strong>Email:</strong> bl.julia99@gmail.com</p>
              <p><strong>Tel:</strong> 796 961 363</p>
            </div>
            <div className="space-y-1">
              <p><strong>Wykonano za pomocą:</strong> ChatGPT (GPT-4), Replit</p>
              <p><strong>Na potrzeby rekrutacji:</strong> AI Marketing Junior / Specialist</p>
              <p><strong>Dla firm:</strong> GRYF Sp. z o.o., SINDBAD Sp. z o.o.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Aplikacja dostępna na: <a 
              href="https://rekru.cmenergy.pl" 
              className="text-[hsl(var(--baby-blue))] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://rekru.cmenergy.pl
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
