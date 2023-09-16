import { Metadata } from 'next';
import { RiTwitterXLine } from 'react-icons/ri';
import { TiSocialLinkedin } from 'react-icons/ti';
import { VscGithub } from 'react-icons/vsc';

export const metadata: Metadata = {
  title: 'conveX | Contact',
};

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center justify-center flex-1">
      <article className="flex flex-col w-full max-w-4xl">
        <section className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold">Get in touch</h1>
          <ul className="flex flex-col items-center gap-8 sm:flex-row">
            <li className="bg-primary-accent rounded-full p-1 shadow-md hover:scale-125 transition duration-300 ease-in transform">
              <a
                href="https://github.com/StevanFreeborn"
                target="_blank"
                className="text-white"
              >
                <VscGithub className="w-16 h-16" />
              </a>
            </li>
            <li className="bg-primary-accent rounded-full p-1 shadow-md hover:scale-125 transition duration-300 ease-in transform">
              <a
                href="https://twitter.com/stevan_freeborn"
                target="_blank"
                className="text-white"
              >
                <RiTwitterXLine className="w-16 h-16" />
              </a>
            </li>
            <li className="bg-primary-accent rounded-full p-1 shadow-md hover:scale-125 transition duration-300 ease-in transform">
              <a
                href="https://www.linkedin.com/in/stevan-freeborn-77917b75/"
                target="_blank"
                className="text-white"
              >
                <TiSocialLinkedin className="w-16 h-16" />
              </a>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
