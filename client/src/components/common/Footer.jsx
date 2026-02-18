import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-brandMainColor via-emerald-700 to-emerald-900 py-10 text-white dark:from-[#1f5928] dark:via-[#144021] dark:to-[#0a2713]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 md:grid-cols-4">
        {/* Column 1 - About */}
        <div>
          <h2 className="text-lg font-semibold text-white">About CarbonEase</h2>
          <p className="mt-3 text-sm text-white/85">
            A transparent platform for trading carbon credits and supporting
            renewable energy.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white">Quick Links</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/90">
            <li>
              <Link to="/about" className="transition hover:text-brandSubColor">
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/calculator"
                className="transition hover:text-brandSubColor"
              >
                Carbon Calculator
              </Link>
            </li>
            <li>
              <Link to="/blog" className="transition hover:text-brandSubColor">
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/marketplace"
                className="transition hover:text-brandSubColor"
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="transition hover:text-brandSubColor"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 - Contact Info */}
        <div>
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-brandSubColor" />
              <a
                href="mailto:support@carbonease.com"
                className="transition hover:text-brandSubColor"
              >
                support@carbonease.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-brandSubColor" />
              <span>+91 8938-2567-890</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-brandSubColor" />
              <span>123 Green Street, Eco City</span>
            </li>
          </ul>
        </div>

        {/* Column 4 - Social Media */}
        <div>
          <h2 className="text-lg font-semibold text-white">Follow Us</h2>
          <div className="mt-3 flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-brandSubColor"
            >
              <Github size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-brandSubColor"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-brandSubColor"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/70">
        © 2024 CarbonEase. All rights reserved.
      </div>
    </footer>
  );
}
