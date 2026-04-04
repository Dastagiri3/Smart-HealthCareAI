import { motion } from 'motion/react';
import { Calendar, Clock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Doctor, UserProfile } from '../types';
import { format, addDays } from 'date-fns';

interface AppointmentBookingProps {
  user: UserProfile;
}

export default function AppointmentBooking({ user }: AppointmentBookingProps) {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const docRef = doc(db, 'doctors', doctorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleBook = async (e: any) => {
    e.preventDefault();
    if (!selectedTime || !doctor) return;

    setBooking(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: user.displayName,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        reason,
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'appointments');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!doctor) return <div className="min-h-screen flex items-center justify-center">Doctor not found</div>;

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6 border border-green-100"
        >
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-green-900">Booking Successful!</h2>
          <p className="text-gray-600">Your appointment with {doctor.name} has been requested. Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <Link to="/doctors" className="inline-flex items-center text-green-600 font-bold hover:translate-x-1 transition-transform">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Doctors
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Doctor Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-green-50 shadow-sm">
            <img src={doctor.photoURL} alt={doctor.name} className="w-full h-64 object-cover" />
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-green-900">{doctor.name}</h3>
              <p className="text-green-600 font-medium text-sm">{doctor.specialty}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{doctor.bio}</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-green-50 shadow-sm space-y-8">
          <h2 className="text-3xl font-bold text-green-900">Schedule Appointment</h2>
          
          <form onSubmit={handleBook} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Select Date</label>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {[0, 1, 2, 3, 4, 5, 6].map(i => {
                  const date = addDays(new Date(), i);
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        selectedDate === dateStr ? 'bg-green-600 text-white shadow-lg' : 'bg-green-50 text-green-800 hover:bg-green-100'
                      }`}
                    >
                      <span className="text-xs font-medium uppercase">{format(date, 'EEE')}</span>
                      <span className="text-2xl font-bold">{format(date, 'd')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Select Time</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {doctor.availability.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      selectedTime === time ? 'bg-green-600 text-white shadow-lg' : 'bg-green-50 text-green-800 hover:bg-green-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Reason for Visit</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your symptoms or reason for the visit..."
                className="w-full p-6 bg-green-50 border-none rounded-2xl focus:ring-2 ring-green-500 outline-none h-32 resize-none"
              />
            </div>

            <button 
              disabled={!selectedTime || booking}
              className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-50"
            >
              {booking ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
