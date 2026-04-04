import { Activity, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">MediGreen</span>
            </div>
            <p className="text-green-200 leading-relaxed">
              Providing world-class medical care with a focus on sustainability and patient well-being.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-green-400" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-green-400" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-green-400" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-green-200">
              <li><a href="/" className="hover:text-green-400">Home</a></li>
              <li><a href="/departments" className="hover:text-green-400">Departments</a></li>
              <li><a href="/doctors" className="hover:text-green-400">Our Doctors</a></li>
              <li><a href="/login" className="hover:text-green-400">Appointment</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Departments</h3>
            <ul className="space-y-4 text-green-200">
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Pediatrics</li>
              <li>Orthopedics</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-green-200">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-400" />
                <span>123 Medical Way, Health City</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-400" />
                <span>contact@medigreen.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-800 pt-8 text-center text-green-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MediGreen Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
