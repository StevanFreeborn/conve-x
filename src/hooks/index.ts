import SpinningLoader from '@/components/SpinningLoader';
import { EditorState, Extension, Text } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
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
