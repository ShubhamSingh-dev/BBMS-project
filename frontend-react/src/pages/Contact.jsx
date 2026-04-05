import React, { useState } from 'react';
import Layout from '../components/Layout';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('✅ Thank you for reaching out! Our team will contact you within 2 hours. For emergencies, please call our 24/7 helpline.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChatSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { type: 'user', text: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');

    setTimeout(() => {
      let response = 'Thanks for your message! Our team will get back to you shortly.';
      if (chatInput.toLowerCase().includes('emergency')) {
        response = '🚨 For emergencies, please call our 24/7 helpline immediately: 1800-999-9999.';
      } else if (chatInput.toLowerCase().includes('donate')) {
        response = '💝 Thank you for your interest! You can register in the Become a Donor page.';
      }
      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 1000);
  };

  return (
    <Layout>
      <div className="font-inter">
        {/* Contact Hero */}
        <section className="bg-linear-to-br from-[#fce6e6] to-[#ffe5e5] py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute -bottom-20 right-[5%] text-[15rem] opacity-10 rotate-12">📞</div>
          <div className="absolute -top-10 left-[5%] text-[12rem] opacity-10 -rotate-12">💬</div>
          <h1 className="text-4xl md:text-[3.5rem] font-extrabold mb-5 font-clash relative z-1">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-gray text-lg max-w-[700px] mx-auto leading-relaxed relative z-1">
            Have questions about blood donation? Need emergency assistance? Our team is here to help you 24/7.
          </p>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-phone-alt', title: 'Call Us', info: '24/7 Emergency: 1800-123-4567', sub: 'Office: +91 11-4567-8900' },
              { icon: 'fa-envelope', title: 'Email Us', info: 'support@life4u.in', sub: 'donations@life4u.in' },
              { icon: 'fa-map-marker-alt', title: 'Visit Us', info: '123 Donor Street, Healthcare District', sub: 'New Delhi, Delhi - 110001' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[30px] shadow-md border border-gray/5 text-center transition-all hover:-translate-y-2 hover:shadow-lg">
                <div className="w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                  <i className={`fas ${card.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-4 font-clash">{card.title}</h3>
                <p className="font-bold text-dark mb-1">{card.info}</p>
                <p className="text-gray text-sm">{card.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-20 px-6 bg-[#f8fafc]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-[40px] shadow-xl">
              <h2 className="text-3xl font-bold mb-8 font-clash">Send a <span className="gradient-text">Message</span></h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium">Full Name</label>
                    <input
                      type="text" required placeholder="Enter name"
                      className="w-full p-4 border border-[#f0f0f0] rounded-xl focus:outline-none focus:border-primary"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Email Address</label>
                    <input
                      type="email" required placeholder="Enter email"
                      className="w-full p-4 border border-[#f0f0f0] rounded-xl focus:outline-none focus:border-primary"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium">Phone Number</label>
                    <input
                      type="tel" required placeholder="Mobile number"
                      className="w-full p-4 border border-[#f0f0f0] rounded-xl focus:outline-none focus:border-primary"
                      value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Subject</label>
                    <select
                      className="w-full p-4 border border-[#f0f0f0] rounded-xl focus:outline-none focus:border-primary appearance-none"
                      value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="">Select Subject</option>
                      <option value="donation">Blood Donation Query</option>
                      <option value="emergency">Emergency Requirement</option>
                      <option value="partnership">Hospital Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Your Message</label>
                  <textarea
                    rows="5" required placeholder="How can we help?"
                    className="w-full p-4 border border-[#f0f0f0] rounded-xl focus:outline-none focus:border-primary min-h-[150px]"
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-linear-to-br from-primary to-primary-light text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-1 transition-all">Send Message <i className="fas fa-paper-plane ml-2"></i></button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[40px] shadow-lg h-[400px] flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gray/10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <i className="fas fa-map-marked-alt text-[5rem] text-primary mb-6 relative z-1"></i>
                <h3 className="text-2xl font-bold mb-4 relative z-1 font-clash">Our Headquarters</h3>
                <p className="text-gray mb-6 relative z-1">Find us at the heart of the city's healthcare district.</p>
                <button
                  onClick={() => alert('📍 Redirecting to Google Maps...')}
                  className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-full font-bold relative z-1 hover:bg-primary hover:text-white transition-all"
                >
                  Open in Google Maps
                </button>
              </div>

              <div className="bg-linear-to-br from-primary to-primary-light p-10 rounded-[40px] shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-6 font-clash text-white">Emergency Help?</h3>
                <p className="opacity-90 mb-8 leading-relaxed">If you need blood immediately, please don't wait for a form response. Call our emergency hotline available 24 hours a day.</p>
                <a href="tel:18001234567" className="flex items-center gap-4 text-3xl font-extrabold text-white no-underline hover:scale-105 transition-transform">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  1800-123-4567
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Widget */}
        <div className={`fixed bottom-8 right-8 z-[1001] transition-all duration-300 ${chatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="w-[350px] bg-white rounded-[25px] shadow-2xl overflow-hidden border border-gray/10">
            <div className="bg-linear-to-br from-primary to-primary-light p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><i className="fas fa-robot"></i></div>
                <div>
                  <h4 className="font-bold text-sm font-clash text-white">Life4U Support</h4>
                  <p className="text-[0.6rem] opacity-80">Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white bg-transparent border-none text-xl cursor-pointer">&times;</button>
            </div>
            <div className="h-[300px] overflow-y-auto p-5 space-y-4 bg-[#f8fafc]">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-dark shadow-sm rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-gray/10 flex gap-2">
              <input
                type="text" placeholder="Type a message..."
                className="flex-1 p-3 bg-gray/5 border-none rounded-xl text-sm focus:outline-none focus:bg-gray/10"
                value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSendMessage()}
              />
              <button onClick={handleChatSendMessage} className="w-10 h-10 bg-linear-to-br from-primary to-primary-light text-white rounded-xl border-none cursor-pointer"><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-linear-to-br from-primary to-primary-light text-white rounded-full shadow-xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-all z-[1000]"
        >
          <i className={`fas ${chatOpen ? 'fa-times' : 'fa-comment-dots'}`}></i>
        </button>
      </div>
    </Layout>
  );
};

export default Contact;
