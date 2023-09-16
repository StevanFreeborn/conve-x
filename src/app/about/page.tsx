import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'conveX | About',
};

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center flex-1">
      <article className="flex flex-col w-full max-w-4xl gap-8">
        <section className="flex flex-col items-center gap-2">
          <h1 className="text-4xl mt-4">
            Welcome to{' '}
            <span className="italic">
              conve<span className="font-bold text-primary-accent">X</span>
            </span>
          </h1>
          <p className="max-w-xl">
            An X inspired social site that supports following other users,
            liking posts, and sharing both long and short posts formatted with{' '}
            <a
              className="text-primary-accent font-semibold dark:text-white dark:underline"
              href="https://commonmark.org/help/"
              target="_blank"
            >
              Markdown
            </a>
            .
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">About</h2>
          <p>
            This site was built as a submission for the WebDevCody{' '}
            <a
              className="text-primary-accent font-semibold dark:text-white dark:underline"
              href="https://hackathon.webdevcody.com/"
              target="_blank"
            >
              hackathon
            </a>
            . The following are some technologies that were used to build the
            site:
          </p>
          <ul className=" flex flex-col gap-2 list-disc ml-4">
            <li>
              <a
                className="text-primary-accent font-semibold dark:text-white dark:underline"
                href="https://www.typescriptlang.org/"
                target="_blank"
              >
                TypeScript
              </a>
            </li>
            <li>
              <a
                className="text-primary-accent font-semibold dark:text-white dark:underline"
                href="https://nextjs.org/"
                target="_blank"
              >
                NEXT.js
              </a>
            </li>
            <li>
              <a
                className="text-primary-accent font-semibold dark:text-white dark:underline"
                href="https://www.convex.dev/"
                target="_blank"
              >
                Convex
              </a>
            </li>
            <li>
              <a
                className="text-primary-accent font-semibold dark:text-white dark:underline"
                href="https://clerk.com/"
                target="_blank"
              >
                Clerk
              </a>
            </li>
            <li>
              <a
                className="text-primary-accent font-semibold dark:text-white dark:underline"
                href="https://tailwindcss.com/"
                target="_blank"
              >
                Tailwind
              </a>
            </li>
            <li>
              <a
                className="text-primary-accent font-semibold dark:text-white dark:underline"
                href="https://codemirror.net/"
                target="_blank"
              >
                Codemirror
              </a>
            </li>
            <li>
              <a
                className="text-primary-accent font-semibold dark:text-white dark:underline"
                href="https://vercel.com/"
                target="_blank"
              >
                Vercel
              </a>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
