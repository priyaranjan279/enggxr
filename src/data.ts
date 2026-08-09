export type College = {
  id: number; name: string; short: string; location: string; branch: string;
  match: number; probability: number; category: 'Dream' | 'Target' | 'Safe';
  fee: string; avgPackage: string; roi: number; distance: string; reason: string;
}

export const colleges: College[] = [
  { id: 1, name: 'JNTUH University College of Engineering', short: 'JNTUH', location: 'Hyderabad', branch: 'CSE', match: 96, probability: 72, category: 'Target', fee: 'INR 1.2L', avgPackage: 'INR 8.4L', roi: 94, distance: '18 km', reason: 'Strong CSE outcomes and a good fit for your rank range.' },
  { id: 2, name: 'CBIT Hyderabad', short: 'CBIT', location: 'Gandipet', branch: 'AI & ML', match: 92, probability: 48, category: 'Dream', fee: 'INR 1.6L', avgPackage: 'INR 9.1L', roi: 89, distance: '31 km', reason: 'The AI and ML branch matches your selected career goals.' },
  { id: 3, name: 'VNR VJIET', short: 'VNR', location: 'Bachupally', branch: 'Data Science', match: 89, probability: 81, category: 'Safe', fee: 'INR 1.35L', avgPackage: 'INR 7.8L', roi: 87, distance: '24 km', reason: 'The admission estimate, commute, and placement data meet your filters.' },
  { id: 4, name: 'Vasavi College of Engineering', short: 'VASAVI', location: 'Ibrahim Bagh', branch: 'ECE', match: 84, probability: 66, category: 'Target', fee: 'INR 1.4L', avgPackage: 'INR 7.2L', roi: 83, distance: '27 km', reason: 'The ECE branch and placement data meet your selected filters.' },
]

export const streams = [
  { name: 'Computer Science', match: 98, outlook: 'Very high', salary: 'INR 12-45L' },
  { name: 'AI & Machine Learning', match: 94, outlook: 'Growing', salary: 'INR 15-60L' },
  { name: 'Data Science', match: 89, outlook: 'High', salary: 'INR 10-38L' },
  { name: 'Electronics & Communication', match: 77, outlook: 'Stable', salary: 'INR 8-28L' },
]
