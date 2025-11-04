// Naive Bayes calculation for disease diagnosis
export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  probability: number;
}

export interface DiagnosisResult {
  disease: Disease;
  probability: number;
  confidence: 'high' | 'medium' | 'low';
}

// Sample disease database
export const diseases: Disease[] = [
  {
    id: 'flu',
    name: 'Influenza (Flu)',
    description: 'Infeksi virus yang menyerang sistem pernapasan',
    symptoms: ['demam', 'batuk', 'sakit-kepala', 'kelelahan', 'nyeri-otot', 'hidung-tersumbat'],
    probability: 0.15,
  },
  {
    id: 'covid',
    name: 'COVID-19',
    description: 'Infeksi virus SARS-CoV-2',
    symptoms: ['demam', 'batuk', 'sesak-napas', 'kelelahan', 'kehilangan-indra-penciuman', 'sakit-kepala'],
    probability: 0.12,
  },
  {
    id: 'tbc',
    name: 'Tuberkulosis (TBC)',
    description: 'Infeksi bakteri pada paru-paru',
    symptoms: ['batuk', 'batuk-berdarah', 'demam', 'berkeringat-malam', 'penurunan-berat-badan', 'kelelahan'],
    probability: 0.08,
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    description: 'Infeksi paru-paru yang menyebabkan peradangan',
    symptoms: ['demam', 'batuk', 'sesak-napas', 'nyeri-dada', 'kelelahan'],
    probability: 0.10,
  },
  {
    id: 'bronkitis',
    name: 'Bronkitis',
    description: 'Peradangan pada bronkus (saluran udara ke paru-paru)',
    symptoms: ['batuk', 'demam', 'kelelahan', 'sesak-napas', 'nyeri-dada'],
    probability: 0.13,
  },
  {
    id: 'asma',
    name: 'Asma',
    description: 'Penyakit kronis yang menyebabkan penyempitan saluran napas',
    symptoms: ['sesak-napas', 'batuk', 'mengi', 'nyeri-dada', 'kelelahan'],
    probability: 0.11,
  },
  {
    id: 'sinusitis',
    name: 'Sinusitis',
    description: 'Peradangan atau pembengkakan pada jaringan sinus',
    symptoms: ['sakit-kepala', 'hidung-tersumbat', 'nyeri-wajah', 'demam', 'batuk'],
    probability: 0.14,
  },
  {
    id: 'migrain',
    name: 'Migrain',
    description: 'Sakit kepala berat yang sering disertai mual',
    symptoms: ['sakit-kepala', 'mual', 'muntah', 'sensitif-cahaya', 'pusing'],
    probability: 0.09,
  },
];

export const allSymptoms = [
  { id: 'demam', label: 'Demam' },
  { id: 'batuk', label: 'Batuk' },
  { id: 'sakit-kepala', label: 'Sakit Kepala' },
  { id: 'kelelahan', label: 'Kelelahan' },
  { id: 'nyeri-otot', label: 'Nyeri Otot' },
  { id: 'hidung-tersumbat', label: 'Hidung Tersumbat' },
  { id: 'sesak-napas', label: 'Sesak Napas' },
  { id: 'kehilangan-indra-penciuman', label: 'Kehilangan Indra Penciuman/Perasa' },
  { id: 'batuk-berdarah', label: 'Batuk Berdarah' },
  { id: 'berkeringat-malam', label: 'Berkeringat di Malam Hari' },
  { id: 'penurunan-berat-badan', label: 'Penurunan Berat Badan' },
  { id: 'nyeri-dada', label: 'Nyeri Dada' },
  { id: 'mengi', label: 'Mengi (Napas Berbunyi)' },
  { id: 'nyeri-wajah', label: 'Nyeri Wajah/Sekitar Mata' },
  { id: 'mual', label: 'Mual' },
  { id: 'muntah', label: 'Muntah' },
  { id: 'sensitif-cahaya', label: 'Sensitif terhadap Cahaya' },
  { id: 'pusing', label: 'Pusing' },
];

// Naive Bayes calculation
export function calculateNaiveBayes(selectedSymptoms: string[]): DiagnosisResult[] {
  if (selectedSymptoms.length === 0) {
    return [];
  }

  const results: DiagnosisResult[] = [];

  for (const disease of diseases) {
    // Calculate P(Disease|Symptoms) using Naive Bayes
    // P(D|S) = P(S|D) * P(D) / P(S)
    
    // Count matching symptoms
    const matchingSymptoms = selectedSymptoms.filter(symptom => 
      disease.symptoms.includes(symptom)
    ).length;

    // Calculate likelihood P(S|D)
    const likelihood = matchingSymptoms / disease.symptoms.length;
    
    // Prior probability P(D)
    const prior = disease.probability;
    
    // Calculate posterior (simplified, without normalization)
    const posterior = likelihood * prior * (matchingSymptoms / selectedSymptoms.length);

    if (matchingSymptoms > 0) {
      results.push({
        disease,
        probability: posterior,
        confidence: posterior > 0.08 ? 'high' : posterior > 0.04 ? 'medium' : 'low',
      });
    }
  }

  // Sort by probability (descending)
  results.sort((a, b) => b.probability - a.probability);

  // Normalize probabilities to sum to 1
  const totalProbability = results.reduce((sum, r) => sum + r.probability, 0);
  if (totalProbability > 0) {
    results.forEach(result => {
      result.probability = (result.probability / totalProbability) * 100;
    });
  }

  return results.slice(0, 5); // Return top 5 results
}
