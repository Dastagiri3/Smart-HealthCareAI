import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Clock, Users, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-green-50">
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
            alt="Hospital Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-green-900 leading-tight">
              Modern Healthcare <br />
              <span className="text-green-600">For a Better Life</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Experience world-class medical services with our expert team of doctors and state-of-the-art facilities. Your health is our priority.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all flex items-center group shadow-lg shadow-green-200">
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/doctors" className="bg-white text-green-700 border-2 border-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all">
                Find a Doctor
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1000" 
                alt="Doctor" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center space-x-4 border border-green-50">
              <div className="bg-green-100 p-3 rounded-full">
                <HeartPulse className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Happy Patients</p>
                <p className="text-2xl font-bold text-green-900">15,000+</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900">Why Choose MediGreen?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We combine expertise with empathy to provide the best healthcare experience.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Expert Doctors", desc: "Our team consists of highly qualified and experienced medical professionals." },
            { icon: Clock, title: "24/7 Service", desc: "Emergency care and medical assistance available round the clock." },
            { icon: Users, title: "Patient Centric", desc: "We focus on personalized care tailored to each patient's unique needs." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl border border-green-50 shadow-sm hover:shadow-xl transition-all text-center space-y-4"
            >
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-green-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500 rounded-full -ml-32 -mb-32 opacity-50"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to prioritize your health?</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">Join thousands of satisfied patients who trust MediGreen for their healthcare needs.</p>
            <Link to="/login" className="inline-block bg-white text-green-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-xl">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
