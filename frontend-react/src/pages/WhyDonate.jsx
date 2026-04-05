import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const WhyDonate = () => {
  const [counters, setCounters] = useState({
    nextNeed: 2,
    donations: 1247,
    livesSaved: 3741,
    activeDonors: 342
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        ...prev,
        donations: prev.donations + Math.floor(Math.random() * 2),
        livesSaved: prev.livesSaved + Math.floor(Math.random() * 3),
        activeDonors: prev.activeDonors + Math.floor(Math.random() * 5) - 2
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqData = [
    { q: "Does donating blood hurt?", a: "Only a quick pinch! The actual donation takes about 8-10 minutes, and the feeling is similar to a quick mosquito bite." },
    { q: "How much blood is taken?", a: "Typically about 350-450ml is taken, which is less than 10% of your total blood volume. Your body replaces the fluid within 24 hours." },
    { q: "How often can I donate?", a: "Healthy individuals can donate whole blood every 90 days (3 months) to allow iron levels to return to normal." },
    { q: "Will I feel weak after donating?", a: "Most people feel perfectly fine. We provide juice and snacks after donation to help you recover your energy immediately." }
  ];

  const myths = [
    { myth: "I'm too old to donate blood.", fact: "There is no upper age limit as long as you are healthy and fit!" },
    { myth: "Donating blood makes you weak.", fact: "Only a small amount is taken, and your body regenerates it very quickly." },
    { myth: "I can get HIV from donating.", fact: "Impossible. We use only new, sterile, disposable needles for every donor." },
    { myth: "It takes too long to donate.", fact: "The actual process takes only 10 minutes. The whole visit is under an hour!" }
  ];

  return (
    <Layout>
      <div className="font-inter">
        {/* Donation Ticker */}
        <div className="bg-dark py-3 overflow-hidden relative">
          <div className="flex animate-ticker whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {[
                  "🩸 Someone donated blood in Mumbai just now!",
                  "❤️ 3 lives saved in Delhi through donations",
                  "🚑 Emergency blood request fulfilled in Bangalore",
                  "🩸 New donor registered in Chennai",
                  "❤️ Platelets donated for cancer patient in Kolkata"
                ].map((text, idx) => (
                  <div key={idx} className="inline-flex items-center gap-2.5 px-10 text-white font-medium">
                    <i className="fas fa-tint text-primary"></i>
                    <span>{text}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Dynamic Hero */}
        <section className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] py-20 px-6 relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path d=%22M50 0 L61 35 L98 35 L68 57 L79 92 L50 70 L21 92 L32 57 L2 35 L39 35 Z%22 fill=%22white%22/></svg>')] bg-[size:100px_100px] animate-float"></div>
          <div className="max-w-[1400px] mx-auto text-center relative z-1">
            <h1 className="text-4xl md:text-[4rem] font-extrabold mb-6 font-clash">Be Someone's <span className="gradient-text">Hero</span></h1>
            <p className="text-xl opacity-90 max-w-[800px] mx-auto mb-10 leading-relaxed">
              Every 2 seconds, someone needs blood. Your one donation can save up to 3 lives. Join the movement of young heroes saving lives everyday.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link to="/become-donor" className="px-8 py-4 bg-linear-to-br from-primary to-primary-light text-white rounded-xl font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all">
                <i className="fas fa-hand-holding-heart mr-2"></i> Become a Donor Now
              </Link>
              <a href="#impact" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                <i className="fas fa-play mr-2"></i> See Impact
              </a>
            </div>
          </div>
        </section>

        {/* Live Counters */}
        <section className="py-12 bg-white px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fa-clock', num: counters.nextNeed, label: 'Seconds until next need', suffix: 's' },
              { icon: 'fa-tint', num: counters.donations, label: 'Donations today', suffix: '+' },
              { icon: 'fa-heart', num: counters.livesSaved, label: 'Lives saved today', suffix: '+' },
              { icon: 'fa-users', num: counters.activeDonors, label: 'Active donors now', suffix: '+' }
            ].map((stat, i) => (
              <div key={i} className="bg-linear-to-br from-[#f8f9fa] to-white p-8 rounded-2xl shadow-md text-center relative border border-gray/5">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white mx-auto mb-5">
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div className="text-4xl font-extrabold text-primary mb-2 font-clash">{stat.num}{stat.suffix}</div>
                <div className="text-gray text-sm uppercase tracking-wider mb-2 font-semibold">{stat.label}</div>
                <div className="text-[0.7rem] text-success font-bold flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span> LIVE
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Showcase */}
        <section id="impact" className="py-20 px-6 bg-[#f8fafc]">
          <div className="max-w-[1400px] mx-auto text-center mb-16">
            <h2 className="text-[3rem] font-extrabold font-clash mb-5 text-dark">The <span className="gradient-text">Ripple Effect</span> of Your Gift</h2>
            <p className="text-gray text-lg">One donation creates waves of impact across multiple lives</p>
          </div>
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Save Lives', badge: '🩸 Most Common', icon: 'fa-heartbeat', desc: 'Blood is essential for surgeries, cancer treatments, chronic illnesses, and traumatic injuries.' },
              { title: 'Community', badge: '🤝 Stronger Together', icon: 'fa-users', desc: 'A healthy blood supply is a critical component of community health and emergency preparedness.' },
              { title: 'Self Benefits', badge: '💪 Health Perk', icon: 'fa-check-circle', desc: 'Regular donation helps reduce harmful iron stores and gives you a mini-health checkup.' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[30px] shadow-md border border-gray/5 relative group hover:-translate-y-2 transition-all cursor-pointer overflow-hidden">
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[0.7rem] font-bold rounded-full mb-6 uppercase tracking-wider">{card.badge}</div>
                <div className="text-[3rem] text-primary mb-6"><i className={`fas ${card.icon}`}></i></div>
                <h3 className="text-2xl font-bold mb-4 font-clash">{card.title}</h3>
                <p className="text-gray leading-relaxed mb-6">{card.desc}</p>
                <div className="p-4 bg-[#f8fafc] rounded-xl text-xs italic text-gray border-l-4 border-primary">"Your blood can save a premature baby"</div>
              </div>
            ))}
          </div>
        </section>

        {/* Myths vs Facts */}
        <section className="py-20 px-6 bg-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[3rem] font-extrabold font-clash mb-5 text-dark">Myth vs <span className="gradient-text">Fact</span></h2>
              <p className="text-gray text-lg">Don't let misconceptions hold you back from being a hero</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {myths.map((m, i) => (
                <div key={i} className="perspective-1000 h-[300px] group cursor-pointer">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                    <div className="absolute inset-0 bg-linear-to-br from-[#f8f9fa] to-white p-8 rounded-2xl shadow-md border border-gray/10 flex flex-col justify-center items-center text-center backface-hidden">
                      <div className="text-danger font-bold mb-4 flex items-center gap-2"><i className="fas fa-times-circle"></i> MYTH</div>
                      <h3 className="text-lg font-bold font-clash leading-relaxed">"{m.myth}"</h3>
                      <div className="mt-6 text-primary text-xs font-bold animate-bounce">Click to Flip <i className="fas fa-sync"></i></div>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-light p-8 rounded-2xl shadow-md text-white flex flex-col justify-center items-center text-center backface-hidden rotate-y-180">
                      <div className="bg-white/20 px-3 py-1 rounded-full text-[0.7rem] font-bold mb-4 flex items-center gap-2"><i className="fas fa-check-circle"></i> THE REALITY</div>
                      <p className="text-sm font-medium leading-relaxed">{m.fact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 px-6 bg-[#f8fafc]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[3rem] font-extrabold font-clash mb-5 text-dark">The <span className="gradient-text">Hero's Journey</span></h2>
              <p className="text-gray text-lg">It takes less than an hour to make a lifelong impact</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative">
              <div className="hidden lg:block absolute top-10 left-[10%] w-[80%] h-1 bg-gray/10 z-0"></div>
              {[
                { title: 'Registration', icon: 'fa-file-signature', desc: 'Fill a basic form with your medical history and identity.' },
                { title: 'Mini-Checkup', icon: 'fa-user-md', desc: 'A quick check of your pulse, BP, and hemoglobin levels.' },
                { title: 'Donation', icon: 'fa-tint', desc: 'The actual donation takes just 8-10 mins. Relax and save lives.' },
                { title: 'Refreshments', icon: 'fa-cookie', desc: 'Enjoy juice and snacks. Feel the joy of being a hero!' }
              ].map((step, i) => (
                <div key={i} className="flex-1 text-center relative z-1 bg-white p-8 rounded-2xl shadow-sm border border-gray/5">
                  <div className="w-20 h-20 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg border-8 border-white">
                    <i className={`fas ${step.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-clash">{step.title}</h3>
                  <p className="text-gray text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[3rem] font-extrabold font-clash mb-5 text-dark">Donation <span className="gradient-text">FAQs</span></h2>
              <p className="text-gray text-lg">Everything you need to know before your first donation</p>
            </div>
            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <div key={i} className="bg-[#f8f9fa] rounded-2xl overflow-hidden border border-gray/5 transition-all">
                  <button
                    onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-dark hover:bg-gray/5 transition-all"
                  >
                    <span>{faq.q}</span>
                    <i className={`fas fa-chevron-down transition-transform duration-300 ${activeFAQ === i ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFAQ === i ? 'max-h-[200px] p-6 pt-0' : 'max-h-0'}`}>
                    <p className="text-gray leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Dynamic */}
        <section className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] py-20 px-6 text-white text-center relative overflow-hidden">
          <div className="absolute -bottom-20 -left-10 text-[15rem] opacity-5 rotate-15 animate-heartbeat">❤️</div>
          <div className="max-w-[800px] mx-auto relative z-1">
            <h2 className="text-[3.5rem] font-extrabold mb-5 font-clash">Ready to Save <span className="gradient-text">3 Lives?</span></h2>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">Your single donation can be the difference between life and death for someone today.</p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link to="/become-donor" className="px-10 py-5 bg-linear-to-br from-primary to-primary-light text-white rounded-xl font-bold text-xl hover:-translate-y-1 hover:shadow-xl transition-all">
                Find Donation Center <i className="fas fa-map-marker-alt ml-2"></i>
              </Link>
              <Link to="/signup" className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-xl hover:bg-white/20 transition-all">
                Register as Hero <i className="fas fa-user-plus ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default WhyDonate;
