import { motion } from 'motion/react';
import { Calendar, Clock, FileText, User, Bell, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, Appointment, Report } from '../types';
import { format } from 'date-fns';

interface DashboardProps {
  user: UserProfile;
}

export default function Dashboard({ user }: DashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const qApp = query(collection(db, 'appointments'), where('patientId', '==', user.uid));
    const qRep = query(collection(db, 'reports'), where('patientId', '==', user.uid));

    const unsubApp = onSnapshot(qApp, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'appointments'));

    const unsubRep = onSnapshot(qRep, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'reports'));

    return () => {
      unsubApp();
      unsubRep();
    };
  }, [user.uid]);

  const handleUploadReport = async (e: any) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const title = formData.get('title') as string;
    
    try {
      await addDoc(collection(db, 'reports'), {
        patientId: user.uid,
        title,
        fileURL: `https://picsum.photos/seed/${Math.random()}/800/1000`, // Mock file URL
        uploadedAt: new Date().toISOString(),
      });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reports');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-green-600 p-10 rounded-[3rem] text-white shadow-xl shadow-green-100">
        <div className="flex items-center space-x-6">
          <img src={user.photoURL} alt={user.displayName} className="h-24 w-24 rounded-3xl border-4 border-white/20 shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold">Hello, {user.displayName}</h1>
            <p className="text-green-100">Welcome to your patient dashboard</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl text-center min-w-[100px]">
            <p className="text-2xl font-bold">{appointments.length}</p>
            <p className="text-xs text-green-100 uppercase tracking-wider">Appointments</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl text-center min-w-[100px]">
            <p className="text-2xl font-bold">{reports.length}</p>
            <p className="text-xs text-green-100 uppercase tracking-wider">Reports</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Appointments */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-900 flex items-center">
              <Calendar className="mr-3 h-6 w-6 text-green-600" />
              My Appointments
            </h2>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-green-50 text-center space-y-4">
              <p className="text-gray-500">No appointments found.</p>
              <a href="/doctors" className="inline-block text-green-600 font-bold">Book your first appointment →</a>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((app) => (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-2xl border border-green-50 shadow-sm flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-6">
                    <div className="bg-green-100 p-4 rounded-2xl">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900">{app.doctorName}</h3>
                      <p className="text-sm text-gray-500">{format(new Date(app.date), 'PPP')} at {app.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Reports & Upload */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-900 flex items-center">
              <FileText className="mr-3 h-6 w-6 text-green-600" />
              Medical Reports
            </h2>
            
            <div className="bg-white p-6 rounded-3xl border border-green-50 shadow-sm space-y-4">
              <form onSubmit={handleUploadReport} className="space-y-4">
                <input 
                  name="title"
                  type="text" 
                  placeholder="Report Title (e.g. Blood Test)" 
                  required
                  className="w-full px-4 py-3 bg-green-50 border-none rounded-xl focus:ring-2 ring-green-500 outline-none"
                />
                <button 
                  disabled={uploading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  {uploading ? 'Uploading...' : 'Upload Report'}
                </button>
              </form>

              <div className="pt-4 space-y-3">
                {reports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-green-50 transition-all">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400 group-hover:text-green-600" />
                      <span className="text-sm font-medium text-gray-700">{report.title}</span>
                    </div>
                    <a href={report.fileURL} target="_blank" rel="noreferrer" className="text-xs text-green-600 font-bold hover:underline">View</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
