const FooterSection = () => {
  return (
    <footer
      id="footer"
      className="py-10 bg-gray-900 text-white border-t border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Branding */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold tracking-wide">
            School Alumni System
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            © 2026 My System. All rights reserved.
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-right text-sm text-gray-400 space-y-1">
          <p>
            Email:{" "}
            <a
              href="mailto:alumni@schoolname.edu"
              className="hover:text-white transition"
            >
              alumni@schoolname.edu
            </a>
          </p>
          <p>
            Phone:{" "}
            <span className="hover:text-white transition">
              +63 912 345 6789
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;