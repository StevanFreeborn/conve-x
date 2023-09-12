import SpinningLoader from '@/components/SpinningLoader';
import { EditorState, Extension, Text } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import {
  useRouter as useNextRouter,
  usePathname,
  useSearchParams,
} from 'next/navigation';
import NProgress from 'nprogress';
import { useEffect, useRef, useState } from 'react';

export function useCodeMirror({
  doc,
  extensions,
}: {
  doc: string[];
  extensions: Extension;
}) {
  const editorRef = useRef(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current === null) {
      return;
    }

    const state = EditorState.create({
      doc: Text.of(doc),
      extensions: extensions,
    });

    const view = new EditorView({
      state: state,
      parent: editorRef.current,
    });

    setEditorView(view);
    return () => view.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef.current]);

  return { editorRef, editorView };
}

export function useMountedEffect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return { mounted, Loader: SpinningLoader };
}

export function useRouter() {
  const router = useNextRouter();
  const { push, back } = router;

  router.push = (href, options) => {
    NProgress.start();
    push(href, options);
  };

  router.back = () => {
    NProgress.start();
    back();
  };

  return router;
}

export function useProgressEffect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);
}
