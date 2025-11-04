import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Heart, AlertCircle, TrendingUp } from 'lucide-react';
import { DiagnosisResult as Result } from '@/lib/naiveBayes';
import { Progress } from '@/components/ui/progress';

interface DiagnosisResultProps {
  results: Result[];
  isLoading: boolean;
}

export const DiagnosisResult = ({ results, isLoading }: DiagnosisResultProps) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 shadow-medium border-2 border-accent/10">
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center space-y-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                <Heart className="w-16 h-16 text-accent" />
              </motion.div>
              <p className="text-lg font-medium text-foreground">Menganalisis gejala Anda...</p>
              <p className="text-sm text-muted-foreground">Menggunakan algoritma Naive Bayes</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 shadow-medium border-2 border-border">
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center space-y-4">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto animate-heartbeat" />
              <p className="text-lg font-medium text-foreground">Hasil diagnosa akan muncul di sini</p>
              <p className="text-sm text-muted-foreground">Pilih gejala dan klik tombol diagnosa</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 shadow-medium border-2 border-accent/10">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2 bg-accent/10 rounded-lg"
          >
            <Heart className="w-6 h-6 text-accent" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Hasil Diagnosa</h2>
            <p className="text-sm text-muted-foreground">Berdasarkan gejala yang dipilih</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {results.map((result, index) => (
              <motion.div
                key={result.disease.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <Card className={`p-4 ${index === 0 ? 'border-2 border-accent bg-accent/5' : 'border border-border'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {index === 0 && (
                          <TrendingUp className="w-4 h-4 text-accent" />
                        )}
                        <h3 className="font-bold text-foreground">{result.disease.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.disease.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      result.confidence === 'high' 
                        ? 'bg-accent/10 text-accent' 
                        : result.confidence === 'medium'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {result.confidence === 'high' ? 'Tinggi' : result.confidence === 'medium' ? 'Sedang' : 'Rendah'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tingkat Kepercayaan:</span>
                      <span className="font-semibold text-foreground">{result.probability.toFixed(1)}%</span>
                    </div>
                    <Progress value={result.probability} className="h-2" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg"
        >
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive mb-1">Disclaimer Penting</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sistem ini hanya alat bantu untuk memberikan gambaran awal. Hasil diagnosa tidak dapat menggantikan 
                pemeriksaan dan konsultasi langsung dengan dokter profesional. Segera konsultasikan dengan tenaga medis 
                untuk diagnosa yang akurat dan penanganan yang tepat.
              </p>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};
