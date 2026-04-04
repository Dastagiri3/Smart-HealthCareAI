import { motion } from 'motion/react';
import { Calendar, User, Clock, Check, X, Filter, Activity, Users, Stethoscope } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Appointment, Doctor, UserProfile } from '../types';

export default function AdminPanel() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'patients'>('appointments');
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    department: '',
    experience: 0,
    bio: '',
    photoURL: '',
    availability: '09:00, 10:00, 11:00, 14:00, 15:00'
  });

  useEffect(() => {
    const unsubApp = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment)));
    });
    const unsubDoc = onSnapshot(collection(db, 'doctors'), (snapshot) => {
      setDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor)));
    });
    const unsubPat = onSnapshot(collection(db, 'users'), (snapshot) => {
      setPatients(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as unknown as UserProfile)));
      setLoading(false);
    });

    return () => {
      unsubApp();
      unsubDoc();
      unsubPat();
    };
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'appointments');
    }
  };

  const handleAddDoctor = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'doctors'), {
        ...newDoctor,
        availability: newDoctor.availability.split(',').map(t => t.trim())
      });
      setShowAddDoctorForm(false);
      setNewDoctor({
        name: '',
        specialty: '',
        department: '',
        experience: 0,
        bio: '',
        photoURL: '',
        availability: '09:00, 10:00, 11:00, 14:00, 15:00'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'doctors');
    }
  };

  const seedDoctors = async () => {
    const initialDoctors = [
      { name: "Dr. Sarah Johnson", specialty: "Cardiologist", department: "Cardiology", experience: 12, bio: "Expert in interventional cardiology.", photoURL: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400", availability: ["09:00", "10:00", "11:00", "14:00"] },
      { name: "Dr. Michael Chen", specialty: "Neurologist", department: "Neurology", experience: 15, bio: "Specializes in neurodegenerative diseases.", photoURL: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400", availability: ["10:00", "11:00", "13:00", "15:00"] },
      { name: "Dr. Emily White", specialty: "Pediatrician", department: "Pediatrics", experience: 8, bio: "Passionate about child healthcare and nutrition.", photoURL: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400", availability: ["09:00", "13:00", "14:00", "16:00"] }
    ];

    for (const d of initialDoctors) {
      await addDoc(collection(db, 'doctors'), d);
    }
    alert("Doctors seeded successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <h1 className="text-4xl font-bold text-green-900">Admin Panel</h1>
        <div className="flex space-x-4">
          <button onClick={seedDoctors} className="bg-green-100 text-green-700 px-6 py-2 rounded-xl font-bold hover:bg-green-200 transition-all">
            Seed Doctors
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Appointments", value: appointments.length, icon: Calendar, color: "bg-blue-50 text-blue-600" },
          { label: "Total Doctors", value: doctors.length, icon: Stethoscope, color: "bg-green-50 text-green-600" },
          { label: "Total Patients", value: patients.length, icon: Users, color: "bg-purple-50 text-purple-600" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-green-50 shadow-sm flex items-center space-x-6">
            <div className={`${stat.color} p-4 rounded-2xl`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-green-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-100 pb-4">
        {['appointments', 'doctors', 'patients'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-8 py-3 rounded-2xl font-bold capitalize transition-all ${
              activeTab === tab ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-green-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-green-50 shadow-sm overflow-hidden">
        {activeTab === 'appointments' && (
          <table className="w-full text-left">
            <thead className="bg-green-50 text-green-800 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-8 py-4">Patient</th>
                <th className="px-8 py-4">Doctor</th>
                <th className="px-8 py-4">Date/Time</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-8 py-6 font-medium text-green-900">{app.patientName}</td>
                  <td className="px-8 py-6 text-gray-600">{app.doctorName}</td>
                  <td className="px-8 py-6 text-gray-600">{app.date} at {app.time}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'confirmed')}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'doctors' && (
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-green-900">Manage Doctors</h2>
              <button 
                onClick={() => setShowAddDoctorForm(!showAddDoctorForm)}
                className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all"
              >
                {showAddDoctorForm ? 'Cancel' : 'Add New Doctor'}
              </button>
            </div>

            {showAddDoctorForm && (
              <motion.form 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddDoctor}
                className="bg-green-50 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-green-800">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={newDoctor.name}
                    onChange={e => setNewDoctor({...newDoctor, name: e.target.value})}
                    className="w-full p-4 rounded-xl border border-green-100 bg-white"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-green-800">Specialty</label>
                  <input 
                    required
                    type="text" 
                    value={newDoctor.specialty}
                    onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})}
                    className="w-full p-4 rounded-xl border border-green-100 bg-white"
                    placeholder="Cardiologist"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-green-800">Department</label>
                  <input 
                    required
                    type="text" 
                    value={newDoctor.department}
                    onChange={e => setNewDoctor({...newDoctor, department: e.target.value})}
                    className="w-full p-4 rounded-xl border border-green-100 bg-white"
                    placeholder="Cardiology"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-green-800">Experience (Years)</label>
                  <input 
                    required
                    type="number" 
                    value={newDoctor.experience}
                    onChange={e => setNewDoctor({...newDoctor, experience: parseInt(e.target.value)})}
                    className="w-full p-4 rounded-xl border border-green-100 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-green-800">Photo URL</label>
                  <input 
                    required
                    type="url" 
                    value={newDoctor.photoURL}
                    onChange={e => setNewDoctor({...newDoctor, photoURL: e.target.value})}
                    className="w-full p-4 rounded-xl border border-green-100 bg-white"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-green-800">Availability (Comma separated)</label>
                  <input 
                    required
                    type="text" 
                    value={newDoctor.availability}
                    onChange={e => setNewDoctor({...newDoctor, availability: e.target.value})}
                    className="w-full p-4 rounded-xl border border-green-100 bg-white"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-green-800">Bio</label>
                  <textarea 
                    required
                    value={newDoctor.bio}
                    onChange={e => setNewDoctor({...newDoctor, bio: e.target.value})}
                    className="w-full p-4 rounded-xl border border-green-100 bg-white h-32"
                    placeholder="Brief description of the doctor..."
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                    Save Doctor
                  </button>
                </div>
              </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map(doc => (
                <div key={doc.id} className="flex items-center space-x-6 p-6 bg-gray-50 rounded-2xl">
                  <img src={doc.photoURL} alt={doc.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-grow">
                    <h3 className="font-bold text-green-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.specialty} • {doc.department}</p>
                  </div>
                  <button 
                    onClick={async () => {
                      if(confirm("Delete doctor?")) {
                        await deleteDoc(doc(db, 'doctors', doc.id));
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {patients.map(pat => (
              <div key={pat.uid} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <img src={pat.photoURL} alt={pat.displayName} className="h-12 w-12 rounded-full" />
                <div>
                  <h3 className="font-bold text-green-900 text-sm">{pat.displayName}</h3>
                  <p className="text-xs text-gray-500">{pat.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
