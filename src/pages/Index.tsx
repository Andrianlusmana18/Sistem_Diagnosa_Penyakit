import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SymptomSelector } from '@/components/SymptomSelector';
import { DiagnosisResult } from '@/components/DiagnosisResult';
import { allSymptoms, calculateNaiveBayes, DiagnosisResult as Result } from '@/lib/naiveBayes';
import { Stethoscope, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    setSelectedSymptoms(prev => 
      checked 
        ? [...prev, symptomId]
        : prev.filter(id => id !== symptomId)
    );
  };

  const handleDiagnose = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Pilih minimal satu gejala', {
        description: 'Silakan pilih gejala yang Anda alami untuk melakukan diagnosa',
      });
      return;
    }

    setIsLoading(true);
    setResults([]);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const diagnosisResults = calculateNaiveBayes(selectedSymptoms);
    setResults(diagnosisResults);
    setIsLoading(false);

    if (diagnosisResults.length > 0) {
      toast.success('Diagnosa selesai!', {
        description: `Ditemukan ${diagnosisResults.length} kemungkinan penyakit`,
      });
    } else {
      toast.info('Tidak ada hasil', {
        description: 'Kombinasi gejala tidak cocok dengan database penyakit',
      });
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setResults([]);
    toast.info('Reset berhasil', {
      description: 'Pilihan gejala telah dikosongkan',
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4"
          >
            <Stethoscope className="w-12 h-12 text-primary" />
          </motion.div>
          
          <h1 className="text-5xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
            🩺 Sistem Diagnosa Penyakit
          </h1>
          
          <p className="text-xl text-muted-foreground mb-2">
            Menggunakan Algoritma Naive Bayes
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Analisis cerdas berdasarkan gejala yang Anda alami</span>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Symptom Selection */}
          <div>
            <SymptomSelector
              symptoms={allSymptoms}
              selectedSymptoms={selectedSymptoms}
              onSymptomChange={handleSymptomChange}
            />
          </div>

          {/* Right Panel - Results */}
          <div>
            <DiagnosisResult results={results} isLoading={isLoading} />
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={handleDiagnose}
            disabled={isLoading || selectedSymptoms.length === 0}
            className="gradient-primary text-white font-semibold px-8 shadow-medium hover:shadow-lg transition-all hover:scale-105"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Menganalisis...
              </>
            ) : (
              <>
                <Stethoscope className="w-5 h-5 mr-2" />
                Diagnosa Sekarang
              </>
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            className="border-2 font-semibold px-8 hover:bg-secondary"
          >
            Reset
          </Button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>Dibuat dengan teknologi React.js, Tailwind CSS, dan Framer Motion</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
