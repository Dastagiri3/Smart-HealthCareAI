import { motion } from 'motion/react';
import { Search, Star, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Doctor } from '../types';
import { Link } from 'react-router-dom';

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'doctors'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
      setDoctors(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900">Our Specialists</h1>
          <p className="text-gray-600 max-w-xl text-lg">
            Consult with our world-class medical experts across various specialties.
          </p>
        </div>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or specialty..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-green-50 rounded-2xl focus:border-green-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor, idx) => (
            <motion.div 
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-green-50 shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={doctor.photoURL || `https://picsum.photos/seed/${doctor.id}/800/600`} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-green-900">4.9</span>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <p className="text-green-600 font-bold text-sm uppercase tracking-wider mb-2">{doctor.specialty}</p>
                  <h3 className="text-2xl font-bold text-green-900">{doctor.name}</h3>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.department}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{doctor.experience} yrs exp</span>
                  </div>
                </div>
                
                <Link 
                  to={`/book/${doctor.id}`}
                  className="w-full bg-green-50 text-green-700 py-4 rounded-2xl font-bold flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all"
                >
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {!loading && filteredDoctors.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <p className="text-2xl font-bold text-green-900">No doctors found</p>
          <p className="text-gray-500">Try searching for a different specialty or name.</p>
        </div>
      )}
    </div>
  );
}
