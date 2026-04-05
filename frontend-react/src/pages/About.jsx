import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Layout>
      <div className="font-inter">
        {/* Page Header */}
        <section className="bg-linear-to-br from-[#fce6e6] to-white py-[60px] px-6 text-center relative overflow-hidden">
          <div className="absolute -top-1/2 -right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,75,75,0.1)_0%,transparent_70%)] rounded-full pointer-events-none"></div>
          <h1 className="text-[3.5rem] mb-5 font-clash font-extrabold">About <span className="gradient-text">Life4U</span></h1>
          <p className="text-gray text-lg max-w-[800px] mx-auto leading-relaxed">
            We are India's most advanced digital blood donation platform, dedicated to ensuring that no life is lost due to the unavailability of blood.
          </p>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
            <div className="bg-linear-to-br from-[#fce6e6] to-white p-10 rounded-2xl shadow-md border border-[#E2E8F0] transition-all duration-300 hover:shadow-lg hover:-translate-y-2.5">
              <h2 className="text-[2.5rem] mb-6 font-clash font-extrabold">Our <span className="gradient-text">Mission</span></h2>
              <p className="text-gray text-[1.1rem] leading-[1.8] mb-[30px]">
                To revolutionize the blood donation ecosystem by connecting donors and recipients through a seamless,
                technology-driven platform that prioritizes speed, safety, and transparency.
              </p>
              <ul className="list-none p-0">
                {[
                  { icon: 'fa-bolt', text: 'Real-time blood availability tracking across 500+ cities.' },
                  { icon: 'fa-shield-alt', text: '100% verified donor profiles and medical screening.' },
                  { icon: 'fa-clock', text: '45-minute average emergency response time.' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-[15px] mb-5 p-[15px] bg-[#F8FAFC] rounded-sm transition-all duration-300 hover:bg-linear-to-br hover:from-primary hover:to-primary-light hover:text-white hover:translate-x-[5px] group">
                    <i className={`fas ${item.icon} text-primary text-[1.2rem] transition-colors duration-300 group-hover:text-white`}></i>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-linear-to-br from-[#fce6e6] to-white p-10 rounded-2xl shadow-md border border-[#E2E8F0] transition-all duration-300 hover:shadow-lg hover:-translate-y-2.5 lg:mt-0">
              <h2 className="text-[2.5rem] mb-6 font-clash font-extrabold">Our <span className="gradient-text">Goals</span></h2>
              <p className="text-gray text-[1.1rem] leading-[1.8] mb-[30px]">
                We aim to build a robust nationwide network where every person has immediate access to safe blood
                during emergencies, regardless of their location or background.
              </p>
              <div className="mt-[30px]">
                {[
                  { percent: '100%', text: 'Nationwide coverage target by 2027' },
                  { percent: '1M+', text: 'Active regular donors within next 2 years' },
                  { percent: '0%', text: 'Wastage of donated blood through smart inventory' }
                ].map((goal, i) => (
                  <div key={i} className="flex items-center gap-[15px] mb-5 p-[15px] bg-[#F8FAFC] rounded-sm transition-all duration-300 hover:bg-linear-to-br hover:from-primary hover:to-primary-light hover:text-white hover:translate-x-[5px] group">
                    <span className="text-[1.5rem] font-extrabold text-primary min-w-[80px] transition-colors duration-300 group-hover:text-white font-clash">{goal.percent}</span>
                    <p className="m-0 text-dark transition-colors duration-300 group-hover:text-white">{goal.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-6 bg-linear-to-br from-[#fce6e6] to-white relative overflow-hidden">
          <h2 className="text-[2.5rem] text-center mb-[60px] font-clash font-extrabold">Our <span className="gradient-text">Journey</span></h2>
          <div className="max-w-[1000px] mx-auto relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-linear-to-br from-primary to-primary-light rounded-[2px] hidden md:block"></div>
            {[
              { year: '2020', title: 'The Beginning', desc: 'Life4U was founded with a small team of medical students and tech enthusiasts to address local blood shortages.' },
              { year: '2022', title: 'Digital Transformation', desc: 'Launched our AI-powered matching system, reaching 100+ cities and saving 50,000+ lives.' },
              { year: '2024', title: 'Nationwide Network', desc: 'Expanded to 500+ cities with 200+ hospital partners, becoming India\'s leading blood tech platform.' },
              { year: '2026', title: 'Global Recognition', desc: 'Recipient of the "Best Health Tech Innovation" award and reaching the milestone of 300,000+ lives saved.' }
            ].map((item, i) => (
              <div key={i} className={`flex flex-col md:flex-row justify-between items-center mb-[60px] relative ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-[45%] bg-white p-[30px] rounded-2xl shadow-md relative transition-all duration-300 hover:scale-105 hover:shadow-lg border border-[#E2E8F0]">
                  <span className="inline-block px-5 py-2 bg-linear-to-br from-primary to-primary-light text-white rounded-[30px] font-bold mb-[15px]">{item.year}</span>
                  <h3 className="text-[1.3rem] mb-[15px] font-clash font-bold">{item.title}</h3>
                  <p className="text-gray leading-relaxed">{item.desc}</p>
                </div>
                <div className="hidden md:block w-5 h-5 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 border-4 border-white shadow-md z-1"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6 bg-white">
          <h2 className="text-[2.5rem] text-center mb-5 font-clash font-extrabold">Our Core <span className="gradient-text">Values</span></h2>
          <p className="text-center text-gray max-w-[700px] mx-auto mb-[60px] text-[1.1rem]">
            Our values are the foundation of everything we do, guiding us in our mission to save lives.
          </p>
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
            {[
              { icon: 'fa-heart', title: 'Compassion', desc: 'We operate with empathy and care for every life we touch, donor or recipient.' },
              { icon: 'fa-bolt', title: 'Speed', desc: 'In medical emergencies, every second counts. We prioritize rapid response and action.' },
              { icon: 'fa-shield-alt', title: 'Integrity', desc: 'We maintain the highest standards of medical safety, data privacy, and transparency.' },
              { icon: 'fa-users', title: 'Collaboration', desc: 'We believe in the power of community and partnerships to create lasting impact.' }
            ].map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-[40px_30px] shadow-md border border-[#E2E8F0] transition-all duration-300 text-center relative overflow-hidden hover:-translate-y-2.5 hover:shadow-lg group">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-br from-primary to-primary-light -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
                <div className="w-20 h-20 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-[25px]">
                  <i className={`fas ${value.icon} text-[2.5rem] text-white`}></i>
                </div>
                <h3 className="text-[1.5rem] mb-[15px] font-clash font-bold">{value.title}</h3>
                <p className="text-gray leading-[1.8]">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 px-6 bg-linear-to-br from-[#fce6e6] to-white">
          <h2 className="text-[2.5rem] text-center mb-[60px] font-clash font-extrabold">Our <span className="gradient-text">Leadership</span></h2>
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {[
              { name: 'Dr. Rajesh Kumar', title: 'Founder & CEO', quote: 'Technology is just a tool. It\'s the compassion of human beings that actually saves lives.' },
              { name: 'Priya Sharma', title: 'Chief Medical Officer', quote: 'Ensuring 100% safety and quality in every donation is our non-negotiable priority.' },
              { name: 'Arjun Verma', title: 'Head of Operations', quote: 'Our goal is to optimize the supply chain so that blood is always available where it\'s needed.' }
            ].map((leader, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2.5 hover:shadow-lg">
                <div className="h-[250px] bg-linear-to-br from-primary to-primary-light relative flex items-center justify-center">
                  <i className="fas fa-user text-[8rem] text-white/30"></i>
                </div>
                <div className="p-[30px]">
                  <h3 className="text-[1.5rem] mb-1.25 font-clash font-bold">{leader.name}</h3>
                  <p className="text-primary font-semibold mb-[15px]">{leader.title}</p>
                  <p className="text-gray italic leading-[1.8] relative pl-5 border-l-3 border-primary">"{leader.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Promise */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[30px]">
            {[
              { icon: 'fa-certificate', title: 'Quality Certifications', desc: 'From donor to recipient, every step is trackable with real-time status updates and public dashboards. ISO 9001:2015 certified.' },
              { icon: 'fa-flask', title: 'Advanced Screening', desc: 'Every donation undergoes comprehensive testing for 8+ infectious diseases using latest technology. Your safety is our priority.' },
              { icon: 'fa-hand-holding-medical', title: 'Sterile Process', desc: 'Single-use, sterile equipment for every donation. Trained professionals ensure safe and comfortable experience.' }
            ].map((safety, i) => (
              <div key={i} className="bg-linear-to-br from-[#fce6e6] to-white rounded-2xl p-[40px_30px] text-center transition-all duration-300 hover:-translate-y-1.25 hover:shadow-lg">
                <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center mx-auto mb-[25px] shadow-md">
                  <i className={`fas ${safety.icon} text-primary text-[1.5rem]`}></i>
                </div>
                <h3 className="text-[1.2rem] mb-[15px] font-clash font-bold">{safety.title}</h3>
                <p className="text-gray leading-[1.8]">{safety.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners & Recognition */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-[2.5rem] text-center mb-5 font-clash font-extrabold">Partners & <span className="gradient-text">Recognition</span></h2>
            <p className="text-center text-gray max-w-[700px] mx-auto mb-[60px] text-[1.1rem]">Trusted by leading healthcare institutions and certified by national bodies</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
              {[
                { icon: 'fa-certificate', title: 'National Blood Transfusion Council', desc: 'Certified Partner' },
                { icon: 'fa-award', title: 'ISO 9001:2015', desc: 'Quality Management' },
                { icon: 'fa-hospital', title: 'NABH', desc: 'Hospital Partnerships' },
                { icon: 'fa-trophy', title: 'Best Health Tech Startup', desc: 'India Innovation Summit 2018' }
              ].map((partner, i) => (
                <div key={i} className="bg-white rounded-2xl p-[30px] shadow-md border border-[#E2E8F0] transition-all duration-300 text-center hover:-translate-y-1.25 hover:shadow-lg">
                  <div className="w-[60px] h-[60px] bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-5 text-primary text-[1.5rem]">
                    <i className={`fas ${partner.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-clash">{partner.title}</h3>
                  <p className="text-gray text-sm">{partner.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Mission CTA */}
        <section className="py-20 px-6 bg-linear-to-br from-primary to-primary-light text-white text-center">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-[2.5rem] mb-5 font-clash font-extrabold">Join Our <span className="text-white">Mission</span></h2>
            <p className="text-xl opacity-90 max-w-[800px] mx-auto mb-10 leading-relaxed">Whether you are a donor, a volunteer, a corporate partner, or a hospital, you can be part of this life-saving journey.</p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link to="/become-donor" className="px-[30px] py-[15px] bg-white text-primary rounded-[50px] font-bold text-lg no-underline transition-all duration-300 hover:-translate-y-0.75 hover:shadow-xl flex items-center gap-2.5">
                <i className="fas fa-hand-holding-heart"></i> Become a Donor
              </Link>
              <a href="#" className="px-[30px] py-[15px] bg-transparent border-2 border-white text-white rounded-[50px] font-bold text-lg no-underline transition-all duration-300 hover:bg-white hover:text-primary hover:-translate-y-0.75 flex items-center gap-2.5">
                <i className="fas fa-handshake"></i> Partner With Us
              </a>
              <Link to="/login" className="px-[30px] py-[15px] bg-transparent border-2 border-white text-white rounded-[50px] font-bold text-lg no-underline transition-all duration-300 hover:bg-white hover:text-primary hover:-translate-y-0.75 flex items-center gap-2.5">
                <i className="fas fa-building"></i> Hospital Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
