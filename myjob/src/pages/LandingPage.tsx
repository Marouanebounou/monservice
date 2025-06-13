// LandingPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaCogs, FaLock, FaRocket, FaChartLine, FaArrowRight, FaBars, FaTimes, FaUser } from "react-icons/fa";

export default function LandingPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Digi-Service
            </Link>
            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/signup"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                S'inscrire
              </Link>
              <Link
                to="/signin"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Se connecter
              </Link>
            </nav>
            {/* Mobile Menu Button - Only visible on mobile */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <FaBars className="text-gray-600 text-xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar - Only visible on mobile */}
      <div className={`md:hidden fixed inset-0 z-50 transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Sidebar Content */}
        <div className="absolute right-0 w-72 h-full bg-white shadow-lg p-6 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Digi-Service
            </h2>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
          
          {/* Mobile Navigation Links */}
          <nav className="mt-8 space-y-4">
            <Link
              to="/signup"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-600"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FaUser className="text-lg" />
              <span>S'inscrire</span>
            </Link>
            <Link
              to="/signin"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-600"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FaUser className="text-lg" />
              <span>Se connecter</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
            Connectez votre entreprise avec les{" "}
            <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
              meilleurs prestataires
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Digi-Service est la plateforme la plus simple pour trouver les bons services ou prestataires pour votre entreprise. 
            Que vous ayez besoin d'aide ou que vous souhaitiez offrir votre expertise, nous sommes là pour vous aider.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Commencer
              <FaArrowRight className="ml-2" />
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-teal-600 text-base font-medium rounded-full text-teal-600 hover:bg-teal-50 transform hover:scale-105 transition-all duration-200"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us? Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Pourquoi choisir Digi-Service ?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="bg-teal-100 p-4 rounded-full">
                  <FaUsers className="text-4xl text-teal-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                Un large réseau de professionnels
              </h3>
              <p className="text-gray-600 text-center">
                Des solutions informatiques à la logistique en passant par le marketing, nous connectons les entreprises avec une variété de professionnels de confiance.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <FaRocket className="text-4xl text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                Faites évoluer votre entreprise
              </h3>
              <p className="text-gray-600 text-center">
                Développez plus rapidement avec les bons partenaires. Nous vous aidons à trouver les services qui feront passer votre entreprise au niveau supérieur.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="bg-purple-100 p-4 rounded-full">
                  <FaChartLine className="text-4xl text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                Atteignez des résultats mesurables
              </h3>
              <p className="text-gray-600 text-center">
                Suivez vos progrès et optimisez vos services pour atteindre vos objectifs commerciaux et améliorer les performances à chaque connexion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Services populaires sur Digi-Service
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <FaCogs className="text-4xl text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                Développement IT & Logiciels
              </h3>
              <p className="text-gray-600 text-center">
                Connectez-vous avec des développeurs experts pour créer des solutions logicielles, des sites web ou des applications mobiles sur mesure pour vos besoins.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                  <FaLock className="text-4xl text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                Solutions de cybersécurité
              </h3>
              <p className="text-gray-600 text-center">
                Assurez la sécurité de votre entreprise avec des experts en cybersécurité qui protégeront vos données et systèmes contre les menaces émergentes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <FaUsers className="text-4xl text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
                Marketing & Publicité
              </h3>
              <p className="text-gray-600 text-center">
                Augmentez la visibilité de votre marque et générez des ventes avec des experts en marketing digital spécialisés dans le SEO, les réseaux sociaux et la publicité payante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Ce que nos clients disent
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-teal-50 to-indigo-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
                  E
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Emma S.</h4>
                  <p className="text-teal-600">Directrice Marketing</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Digi-Service nous a permis de trouver le bon partenaire pour notre projet de développement logiciel. La plateforme est facile à utiliser et nous a fait gagner du temps !"
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-indigo-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Mark J.</h4>
                  <p className="text-indigo-600">PDG de TechCorp</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Une plateforme fantastique qui nous a aidé à faire évoluer notre entreprise rapidement. Nous avons trouvé les bons experts en marketing et notre retour sur investissement a considérablement augmenté."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-600 to-indigo-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Prêt à transformer votre entreprise ?
          </h2>
          <p className="text-xl text-teal-100 mb-12 max-w-2xl mx-auto">
            Rejoignez notre communauté de professionnels et commencez à développer votre entreprise dès aujourd'hui.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-teal-600 transform hover:scale-105 transition-all duration-200"
          >
            Commencer maintenant
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-indigo-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-4">Digi-Service</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                Votre plateforme de confiance pour trouver les meilleurs services et professionnels.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-600 hover:text-teal-600 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-teal-600 transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-teal-600 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@monservice.com
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 234 567 890
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  123 Rue Example, Ville
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © 2025 Digi-Service. Tous droits réservés.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="text-gray-600 hover:text-teal-600 text-sm transition-colors">
                  Politique de confidentialité
                </Link>
                <Link to="/terms" className="text-gray-600 hover:text-teal-600 text-sm transition-colors">
                  Conditions d'utilisation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
