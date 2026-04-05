import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const BecomeDonor = () => {
  const [eligibility, setEligibility] = useState({
    age: false,
    weight: false,
    health: false,
    travel: false,
    tattoo: false,
    medication: false
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Demo auto-check
    setTimeout(() => {
      setEligibility(prev => ({ ...prev, age: true, weight: true, health: true }));
    }, 1000);

    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setDate(target.getDate() + ((6 - target.getDay() + 7) % 7));
      target.setHours(9, 0, 0, 0);
      const diff = target - now;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheck = (key) => {
    setEligibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = Object.values(eligibility).filter(Boolean).length;
  const progress = (checkedCount / 6) * 100;

  return (
    <Layout>
      <div className="font-inter">
        {/* Donor Hero */}
        <section className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] py-24 px-6 relative overflow-hidden text-white text-center">
          <div className="absolute -bottom-[20%] -left-[5%] text-[20rem] opacity-10 rotate-[-10deg] animate-float pointer-events-none">🩸</div>
          <div className="absolute -top-[10%] -right-[5%] text-[15rem] opacity-10 rotate-[15deg] animate-float [animation-delay:2s] pointer-events-none">❤️</div>
          <div className="max-w-[800px] mx-auto relative z-1">
            <h1 className="text-4xl md:text-[3.5rem] font-extrabold mb-5 font-clash">Start Your <span className="gradient-text">Hero's Journey</span></h1>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">Your decision to donate blood can give someone a second chance at life. Join our community of 100,000+ life-savers today.</p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link to="/signup" className="px-10 py-5 bg-linear-to-br from-primary to-primary-light text-white rounded-[50px] font-bold text-xl hover:-translate-y-1 hover:shadow-xl transition-all">
                Register as Donor <i className="fas fa-arrow-right ml-2"></i>
              </Link>
              <a href="#eligibility" className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-[50px] font-bold text-xl hover:bg-white/20 transition-all">
                Check Eligibility
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fa-heartbeat', title: 'Save 3 Lives', desc: 'A single donation can be separated into red cells, plasma, and platelets.' },
              { icon: 'fa-check-circle', title: 'Free Health Check', desc: 'Get your pulse, BP, and hemoglobin levels checked for free.' },
              { icon: 'fa-medal', title: 'Earn Rewards', desc: 'Get points for every donation and redeem them for vouchers.' },
              { icon: 'fa-certificate', title: 'Digital Certificate', desc: 'Receive a verified certificate of appreciation for your service.' }
            ].map((b, i) => (
              <div key={i} className="bg-linear-to-br from-[#f8fafc] to-white p-10 rounded-[30px] shadow-sm border border-gray/5 text-center transition-all hover:-translate-y-2 hover:shadow-lg group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-all">
                  <i className={`fas ${b.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-4 font-clash">{b.title}</h3>
                <p className="text-gray text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility Checker */}
        <section id="eligibility" className="py-20 bg-[#f8fafc] px-6">
          <div className="max-w-[1000px] mx-auto bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 p-10 bg-linear-to-br from-primary to-primary-light text-white">
              <h2 className="text-3xl font-bold mb-6 font-clash text-white">Eligibility <span className="text-white">Checker</span></h2>
              <p className="opacity-90 mb-10">Check if you are ready to donate today by answering these simple questions.</p>
              <div className="mb-8">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Progress</span>
                  <span>{checkedCount}/6 completed</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-[width] duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
              <div className="bg-white/10 p-8 rounded-2xl text-center backdrop-blur-md border border-white/20">
                <div className="text-[4rem] mb-4">
                  {checkedCount === 6 ? '✅' : checkedCount >= 4 ? '⚠️' : '🩸'}
                </div>
                <h3 className="text-2xl font-bold mb-2 font-clash">
                  {checkedCount === 6 ? 'You Are Eligible!' : checkedCount >= 4 ? 'Almost There!' : 'Check Your Eligibility'}
                </h3>
                <p className="text-sm opacity-90">
                  {checkedCount === 6 ? 'Congratulations! You can donate blood today. Click below to register.' : 'Select the checkboxes to see if you can donate today.'}
                </p>
                {checkedCount === 6 && (
                  <Link to="/signup" className="inline-block mt-6 px-8 py-3 bg-white text-primary rounded-full font-bold hover:scale-105 transition-transform">Register as Donor →</Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 p-10">
              <div className="space-y-4">
                {[
                  { key: 'age', q: 'Are you between 18-65 years old?' },
                  { key: 'weight', q: 'Do you weigh more than 45kg?' },
                  { key: 'health', q: 'Are you in good general health today?' },
                  { key: 'travel', q: 'No international travel in last 3 months?' },
                  { key: 'tattoo', q: 'No tattoos/piercings in last 6 months?' },
                  { key: 'medication', q: 'Not on any major medications?' }
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleCheck(item.key)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${eligibility[item.key] ? 'bg-primary/5 border-primary shadow-sm' : 'bg-gray/5 border-transparent hover:bg-gray/10'}`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${eligibility[item.key] ? 'bg-primary border-primary' : 'bg-white border-gray/20'}`}>
                      {eligibility[item.key] && <i className="fas fa-check text-white text-xs"></i>}
                    </div>
                    <span className={`font-semibold ${eligibility[item.key] ? 'text-primary' : 'text-dark'}`}>{item.q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Countdown to Next Camp */}
        <section className="py-20 px-6 bg-white text-center">
          <h2 className="text-3xl font-extrabold mb-10 font-clash">Next <span className="gradient-text">Mega Donation Camp</span></h2>
          <div className="max-w-[800px] mx-auto grid grid-cols-4 gap-4 mb-10">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Minutes' },
              { val: timeLeft.seconds, label: 'Seconds' }
            ].map((t, i) => (
              <div key={i} className="bg-linear-to-br from-primary to-primary-light p-6 rounded-2xl text-white shadow-lg">
                <div className="text-4xl md:text-5xl font-extrabold mb-1 font-clash">{t.val.toString().padStart(2, '0')}</div>
                <div className="text-[0.7rem] md:text-xs uppercase font-bold tracking-widest opacity-80">{t.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#f8fafc] p-8 rounded-3xl inline-block border border-gray/5 shadow-md">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <h4 className="font-bold text-dark font-clash">City Community Center</h4>
                <p className="text-gray text-sm">Healthcare District, New Delhi • Starts 9:00 AM</p>
              </div>
              <button className="ml-4 px-6 py-3 bg-linear-to-br from-primary to-primary-light text-white rounded-xl font-bold shadow-md hover:-translate-y-1 transition-all">Get Directions</button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-[#f8fafc]">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-3xl font-extrabold mb-10 text-center font-clash">Donor <span className="gradient-text">Essentials</span></h2>
            <div className="space-y-4">
              {[
                { q: "What should I eat before donation?", a: "Eat a healthy meal avoid fatty foods. Drink plenty of water (500ml) 30-60 mins before donating." },
                { q: "How long does it take?", a: "The actual blood collection takes only 8-10 minutes. The entire process including registration and recovery takes about 45-60 minutes." },
                { q: "Can I exercise after donating?", a: "It's best to avoid strenuous exercise or heavy lifting for 24 hours after donation to allow your body to recover." }
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray/5 group overflow-hidden transition-all hover:shadow-md">
                  <div className="p-6 cursor-pointer flex justify-between items-center font-bold text-dark group-hover:text-primary transition-colors">
                    <span>{faq.q}</span>
                    <i className="fas fa-plus text-primary text-sm group-hover:rotate-45 transition-transform"></i>
                  </div>
                  <div className="px-6 pb-6 text-gray leading-relaxed text-sm">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BecomeDonor;
