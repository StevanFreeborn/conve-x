'use client';

import { useCodeMirror, useRouter } from '@/hooks';
import { basicDark } from '@/lib/codemirror';
import { indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Compartment, EditorState, Text } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { FormEvent, useEffect, useState } from 'react';
import { Doc, Id } from '../../convex/_generated/dataModel';
import PostContent from './PostContent';

export type SubmitActionParams = {
  clerkUserId: string;
  parentPostId?: Id<'posts'>;
  post?: Doc<'posts'>;
  currentDoc: string[];
};

export default function Editor({
  clerkUserId,
  parentPostId,
  post,
  submitAction,
  autofocus = true,
}: {
  clerkUserId: string;
  parentPostId?: Id<'posts'>;
  post?: Doc<'posts'>;
  submitAction: ({
    clerkUserId,
    parentPostId,
    post,
    currentDoc,
  }: SubmitActionParams) => Promise<void>;
  autofocus?: boolean;
}) {
  const editorTheme = new Compartment();
  const [currentDoc, setCurrentDoc] = useState(post?.content ?? ['']);
  const router = useRouter();
  const [creatingOrUpdating, setCreatingOrUpdating] = useState(false);

  const extensions = [
    basicSetup,
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorState.tabSize.of(2),
    editorTheme.of(basicDark),
    keymap.of([indentWithTab]),
    EditorView.updateListener.of(vu => {
      setCurrentDoc(vu.state.doc.toJSON());
    }),
    EditorView.lineWrapping,
  ];

  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const { editorRef, editorView } = useCodeMirror({
    doc: currentDoc,
    extensions,
  });

  useEffect(() => {
    if (editorView !== null && autofocus) {
      editorView.focus();
    }
  }, [autofocus, editorView]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setCreatingOrUpdating(true);
      await submitAction({
        clerkUserId,
        parentPostId,
        post,
        currentDoc,
      });
    } catch (error) {
      console.log(error);
    } finally {
      console.log('here');
      setCreatingOrUpdating(false);
      setCurrentDoc(['']);
      editorView?.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: '' },
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 w-full shadow-md rounded-md dark:bg-secondary-gray border border-gray-600"
    >
      <div className="flex items-center justify-between rounded-t-md p-4 pb-0 border-b border-gray-600 dark:bg-primary-gray">
        <div className="flex items-center">
          <button
            className="flex items-center justify-center px-3 py-2 rounded-t-md -mb-[1px] disabled:bg-white disabled:border disabled:border-b-0 disabled:border-gray-600 disabled:dark:bg-secondary-gray"
            disabled={mode === 'write'}
            onClick={() => setMode('write')}
            type="button"
          >
            Write
          </button>
          <button
            className="flex items-center justify-center px-3 py-2 rounded-t-md -mb-[1px] disabled:bg-white disabled:border disabled:border-b-0 disabled:border-gray-600 disabled:dark:bg-secondary-gray"
            disabled={mode === 'preview'}
            onClick={() => setMode('preview')}
            type="button"
          >
            Preview
          </button>
        </div>
        <div></div>
      </div>
      <div className="flex flex-col pt-4 px-4 h-0 flex-grow overflow-auto">
        <div
          className={`${mode === 'write' ? '' : 'hidden'} flex-1 overflow-auto`}
          ref={editorRef}
        ></div>
        <div className={`${mode === 'preview' ? '' : 'hidden'} flex-1`}>
          <PostContent content={Text.of(currentDoc).toString()} />
        </div>
      </div>
      <div className="flex items-center justify-end p-4 gap-4">
        <button onClick={() => router.back()} type="button">
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            !currentDoc.join() ||
            !currentDoc.join().trim() ||
            creatingOrUpdating
          }
          className="py-1 px-4 bg-primary-accent text-white rounded-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          Post
        </button>
      </div>
    </form>
  );
}
