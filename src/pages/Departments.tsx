import { motion } from 'motion/react';
import { Stethoscope, Brain, Baby, Bone, Eye, Heart } from 'lucide-react';

const departments = [
  { icon: Heart, name: "Cardiology", desc: "Comprehensive heart care including diagnostics, surgery, and rehabilitation.", color: "bg-red-50 text-red-600" },
  { icon: Brain, name: "Neurology", desc: "Expert treatment for brain, spine, and nervous system disorders.", color: "bg-blue-50 text-blue-600" },
  { icon: Baby, name: "Pediatrics", desc: "Specialized healthcare for infants, children, and adolescents.", color: "bg-yellow-50 text-yellow-600" },
  { icon: Bone, name: "Orthopedics", desc: "Advanced care for bone, joint, and musculoskeletal conditions.", color: "bg-orange-50 text-orange-600" },
  { icon: Eye, name: "Ophthalmology", desc: "Complete eye care from routine exams to complex surgeries.", color: "bg-purple-50 text-purple-600" },
  { icon: Stethoscope, name: "General Medicine", desc: "Primary healthcare and preventive medical services for all ages.", color: "bg-green-50 text-green-600" },
];

export default function Departments() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-green-900">Our Departments</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Specialized medical care across multiple disciplines, delivered by world-class experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-10 rounded-[2.5rem] border border-green-50 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className={`${dept.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              <dept.icon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-4">{dept.name}</h3>
            <p className="text-gray-600 leading-relaxed mb-8">{dept.desc}</p>
            <button className="text-green-600 font-bold flex items-center hover:translate-x-2 transition-transform">
              Learn More
              <span className="ml-2">→</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
