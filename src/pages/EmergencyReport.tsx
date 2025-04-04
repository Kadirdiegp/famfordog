import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, AlertTriangle, Upload, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const EmergencyReport = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    description: '',
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Die Datei ist zu groß. Maximale Dateigröße beträgt 10MB.');
      return;
    }

    // Check file type
    if (!file.type.match('image.*')) {
      alert('Nur Bildformate werden unterstützt (JPG, PNG, GIF).');
      return;
    }

    setSelectedImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    // Prepare form data for email
    const templateParams = {
      user_name: formData.name,
      user_email: formData.email,
      user_phone: formData.phone,
      location: formData.location,
      description: formData.description,
      image_included: selectedImage ? 'Ja' : 'Nein'
    };

    try {
      // Send email using EmailJS
      // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_PUBLIC_KEY' with your EmailJS credentials
      await emailjs.send(
        'service_famfordogs', // EmailJS service ID
        'template_emergency', // EmailJS template ID
        templateParams,
        'jqpuZ0AXPmQVvLGIp' // EmailJS public key
      );

      // If the message contains an image, handle it separately
      // This can be done in various ways - one option is to convert to base64 and attach
      // Another is to upload to a service like Cloudinary or Firebase Storage
      // For simplicity, we'll just note that an image was included in the email
      
      // Once email is sent successfully
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after submission
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        description: '',
      });
      setSelectedImage(null);
      setPreviewUrl(null);
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to send email:', error);
      setIsSubmitting(false);
      setErrorMessage('Es gab einen Fehler beim Senden Ihres Berichts. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          {isSubmitted ? (
            <div className="bg-accent-green/10 border border-accent-green rounded-lg p-6 max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-accent-green mb-4 font-futura">Notfall gemeldet!</h2>
              <p className="font-futura text-gray-700">
                Vielen Dank für Ihre Meldung. Unser Team wurde informiert und wird sich schnellstmöglich um den Notfall kümmern.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)} 
                className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-futura"
              >
                Neuen Notfall melden
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                  <AlertTriangle size={40} className="text-red-600" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6 sm:mb-8 font-glorious">Tiernotfall melden</h1>
                <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 font-futura max-w-3xl mx-auto">
                  Haben Sie ein Tier in Not gefunden? Bitte füllen Sie das Formular aus, um uns schnellstmöglich zu informieren.
                </p>
              </div>
              
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-3xl mx-auto" role="alert">
                  <strong className="font-bold">Fehler: </strong>
                  <span className="block sm:inline">{errorMessage}</span>
                </div>
              )}
              
              <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 font-futura">
                      Ihr Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 font-futura">
                      Telefonnummer *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-futura">
                      E-Mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 font-futura">
                      Fundort / Standort *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="Straße, Hausnummer, PLZ, Ort oder Beschreibung des Fundortes"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 font-futura">
                      Beschreibung der Verletzung / Situation *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Bitte beschreiben Sie den Zustand des Tieres und die Situation so genau wie möglich..."
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-futura">
                      Foto hochladen
                    </label>
                    <div 
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                        isDragging 
                          ? 'border-primary bg-primary/10' 
                          : 'border-gray-300 hover:border-primary/60'
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="space-y-1 text-center">
                        {previewUrl ? (
                          <div>
                            <img 
                              src={previewUrl} 
                              alt="Vorschau" 
                              className="mx-auto h-48 object-contain mb-4" 
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering parent div's onClick
                                setSelectedImage(null);
                                setPreviewUrl(null);
                              }}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Bild entfernen
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
                              >
                                <span>Datei auswählen</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  ref={fileInputRef}
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                              </label>
                              <p className="pl-1">oder hierher ziehen</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF bis zu 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 flex items-center gap-2 rounded-full text-white font-medium transition-colors ${
                      isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Notfall melden
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmergencyReport;
