import Link from 'next/link';

export default function Footer() {
  return (
    <div className="flex flex-col w-full items-center justify-center px-4 mt-4">
      <footer className="flex flex-col items-center justify-between gap-2 w-full max-w-4xl text-sm text-primary-white border-t border-gray-600 py-4">
        <div className="flex items-center justify-center w-full flex-wrap gap-4">
          <Link href="/about" className="hover:text-primary-orange">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary-orange">
            Contact
          </Link>
          <Link href="/terms" className="hover:text-primary-orange">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-primary-orange">
            Privacy
          </Link>
          <Link
            href="https://github.com/StevanFreeborn/conve-x"
            className="hover:text-primary-orange"
          >
            Code
          </Link>
        </div>
        <div>
          <span className="self-center whitespace-nowrap italic">
            conve<span className="font-bold text-primary-accent">X</span>
          </span>
          <span> &copy; 2023</span>
        </div>
      </footer>
    </div>
  );
}
