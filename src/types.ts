export type UserRole = 'patient' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experience: number;
  bio: string;
  photoURL: string;
  availability: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string;
  createdAt: string;
}

export interface Report {
  id: string;
  patientId: string;
  title: string;
  fileURL: string;
  uploadedAt: string;
}
