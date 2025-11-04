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

// Constants for Laplace smoothing and numerical stability
const ALPHA = 1.0; // Laplace smoothing parameter
const EPSILON = 1e-10; // Small constant for numerical stability

// Helper function to calculate P(Symptom|Disease) with Laplace smoothing
function calculateSymptomProbability(symptom: string, disease: Disease): number {
  return disease.symptoms.includes(symptom) ? 
    (1 + ALPHA) / (disease.symptoms.length + 2 * ALPHA) : 
    ALPHA / (disease.symptoms.length + 2 * ALPHA);
}

// Helper function to calculate log probability to avoid numerical underflow
function calculateLogProbability(selectedSymptoms: string[], disease: Disease): number {
  // Start with log of prior probability P(Disease)
  let logProb = Math.log(disease.probability + EPSILON);

  // Add log probabilities for each symptom
  for (const symptom of allSymptoms.map(s => s.id)) {
    const isSymptomPresent = selectedSymptoms.includes(symptom);
    const pSymptomGivenDisease = calculateSymptomProbability(symptom, disease);

    if (isSymptomPresent) {
      logProb += Math.log(pSymptomGivenDisease + EPSILON);
    } else {
      logProb += Math.log(1 - pSymptomGivenDisease + EPSILON);
    }
  }

  return logProb;
}

// Main Naive Bayes calculation function
export function calculateNaiveBayes(selectedSymptoms: string[]): DiagnosisResult[] {
  if (selectedSymptoms.length === 0) {
    return [];
  }

  const results: DiagnosisResult[] = [];
  const logProbabilities: number[] = [];

  // Calculate log probabilities for each disease
  for (const disease of diseases) {
    const logProb = calculateLogProbability(selectedSymptoms, disease);
    logProbabilities.push(logProb);
    
    // Convert log probability to regular probability
    const probability = Math.exp(logProb);
    
    results.push({
      disease,
      probability,
      confidence: 'medium' // Will be updated after normalization
    });
  }

  // Calculate evidence P(Symptoms) using log-sum-exp trick for numerical stability
  const maxLogProb = Math.max(...logProbabilities);
  const evidence = maxLogProb + Math.log(
    logProbabilities.map(lp => Math.exp(lp - maxLogProb)).reduce((a, b) => a + b, 0)
  );

  // Normalize probabilities and set confidence levels
  results.forEach((result, i) => {
    // Calculate posterior probability using Bayes' theorem
    const normalizedProb = Math.exp(logProbabilities[i] - evidence) * 100;
    result.probability = normalizedProb;

    // Update confidence levels based on normalized probability
    if (normalizedProb > 40) {
      result.confidence = 'high';
    } else if (normalizedProb > 20) {
      result.confidence = 'medium';
    } else {
      result.confidence = 'low';
    }
  });

  // Sort by probability (descending) and return top 5 results
  return results
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);
}
