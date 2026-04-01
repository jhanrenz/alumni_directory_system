const AboutPageSection = () => {
  return (
    <section
      id="about"
      className="relative py-20 px-6 text-gray-100"
    >
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Glass Header Container */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            About <span className="text-blue-400">Our Alumni System</span>
          </h2>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            We connect graduates, faculty, and students through a platform to share achievements, stay updated on school events, and maintain lifelong connections. 
            Our mission is to empower the alumni community through technology and smart design.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold mb-2 text-blue-400">Connect</h3>
            <p className="text-gray-200">
              Reconnect with classmates and build a strong professional network.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold mb-2 text-blue-400">Engage</h3>
            <p className="text-gray-200">
              Participate in events, workshops, and alumni gatherings to stay involved.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-2xl font-semibold mb-2 text-blue-400">Celebrate</h3>
            <p className="text-gray-200">
              Share achievements, milestones, and success stories with the community.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutPageSection;