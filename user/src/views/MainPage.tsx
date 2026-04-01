import Header from "./header";
import HomePageSection from "./homePageSection";
import AboutPageSection from "./aboutPageSection";
import ContactPageSection from "./contactPageSection";
import FooterSection from "./footerSection";
import backgroundImage from "../assets/psubg.jpg";

const MainPage = () => {
  return (
    <div
      className="relative text-white min-h-screen bg-no-repeat bg-center bg-cover bg-fixed"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Gradient Dark Overlay (better than plain black) */}
      <div className="absolute inset-0 bg-black/60" />

      <Header />

      <main className="scroll-smooth">
        <section id="home" className="px-0">
          <HomePageSection />
        </section>

        <section id="about" className="px-6 py-20">
          <AboutPageSection />
        </section>

        <section id="contact" className="px-6 py-20">
          <ContactPageSection />
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default MainPage;