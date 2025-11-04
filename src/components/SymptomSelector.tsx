import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface SymptomSelectorProps {
  symptoms: { id: string; label: string }[];
  selectedSymptoms: string[];
  onSymptomChange: (symptomId: string, checked: boolean) => void;
}

export const SymptomSelector = ({ 
  symptoms, 
  selectedSymptoms, 
  onSymptomChange 
}: SymptomSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 shadow-medium border-2 border-primary/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Pilih Gejala yang Dialami</h2>
            <p className="text-sm text-muted-foreground">Centang semua gejala yang Anda rasakan</p>
          </div>
        </div>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {symptoms.map((symptom, index) => (
            <motion.div
              key={symptom.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Checkbox
                id={symptom.id}
                checked={selectedSymptoms.includes(symptom.id)}
                onCheckedChange={(checked) => onSymptomChange(symptom.id, checked as boolean)}
                className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={symptom.id}
                className="text-base cursor-pointer flex-1 font-medium"
              >
                {symptom.label}
              </Label>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">{selectedSymptoms.length}</span> gejala dipilih
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
