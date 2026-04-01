import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPageSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (This is a demo form.)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-20 px-6 text-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Glass Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Contact <span className="text-blue-400">Us</span>
          </h2>

          <p className="text-gray-200 max-w-3xl mx-auto text-lg md:text-xl">
            Have questions, feedback, or just want to connect? Reach out to us and we’ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-6 text-left bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
            
            <div className="flex items-center gap-4">
              <Mail size={24} className="text-blue-400" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-200">alumni@schoolname.edu</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone size={24} className="text-blue-400" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-200">+63 912 345 6789</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MapPin size={24} className="text-blue-400" />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-gray-200">123 Alumni St, Asingan, Pangasinan</p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg flex flex-col gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default ContactPageSection;