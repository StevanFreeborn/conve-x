'use client';

import { useCodeMirror } from '@/hooks';
import { basicDark } from '@/lib/codemirror';
import { useUser } from '@clerk/nextjs';
import { indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Compartment, EditorState, Text } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useMutation } from 'convex/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import PostContent from './PostContent';

export default function Editor() {
  const { user, isSignedIn } = useUser();
  const { theme } = useTheme();
  const editorTheme = new Compartment();
  const [currentDoc, setCurrentDoc] = useState(['']);
  const createPost = useMutation(api.posts.createPost);
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const doc = [''];
  const extensions = [
    basicSetup,
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorState.tabSize.of(2),
    editorTheme.of(basicDark),
    keymap.of([indentWithTab]),
    EditorView.updateListener.of(vu => {
      setCurrentDoc(vu.state.doc.toJSON());
    }),
  ];

  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const { editorRef, editorView } = useCodeMirror({ doc, extensions });

  useEffect(() => {
    if (editorView === null) {
      return;
    }

    if (theme === 'dark') {
      editorView.dispatch({
        effects: editorTheme.reconfigure([]),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, editorView]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (isSignedIn !== true) {
        router.push('/login');
        return;
      }

      setCreating(true);

      const result = await createPost({
        clerkUserId: user.id,
        content: currentDoc,
      });

      switch (result) {
        case 'USER_NOT_FOUND':
        case 'USER_NOT_AUTHORIZED':
        case 'CANNOT_POST_ON_BEHALF_OF_ANOTHER_USER':
          throw Error('Unable to create post');
        default:
          router.push('/');
          return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col flex-1 shadow-md rounded-md dark:bg-secondary-gray border border-gray-600'
    >
      <div className='flex items-center justify-between rounded-t-md p-4 pb-0 border-b border-gray-600 dark:bg-primary-gray'>
        <div className='flex items-center'>
          <button
            className='flex items-center justify-center px-3 py-2 rounded-t-md -mb-[1px] disabled:bg-white disabled:border disabled:border-b-0 disabled:border-gray-600 disabled:dark:bg-secondary-gray'
            disabled={mode === 'write'}
            onClick={() => setMode('write')}
            type='button'
          >
            Write
          </button>
          <button
            className='flex items-center justify-center px-3 py-2 rounded-t-md -mb-[1px] disabled:bg-white disabled:border disabled:border-b-0 disabled:border-gray-600 disabled:dark:bg-secondary-gray'
            disabled={mode === 'preview'}
            onClick={() => setMode('preview')}
            type='button'
          >
            Preview
          </button>
        </div>
        <div></div>
      </div>
      <div className='flex flex-col p-4 h-0 flex-grow'>
        <div
          className={`${mode === 'write' ? '' : 'hidden'} flex-1 overflow-auto`}
          ref={editorRef}
        ></div>
        <div
          className={`${
            mode === 'preview' ? '' : 'hidden'
          } flex-1 overflow-auto`}
        >
          <PostContent content={Text.of(currentDoc).toString()} />
        </div>
      </div>
      <div className='flex items-center justify-end p-4 pt-0'>
        <button
          type='submit'
          disabled={!currentDoc.join() || !currentDoc.join().trim() || creating}
          className='py-1 px-4 bg-primary-accent text-white rounded-md disabled:opacity-50 flex items-center justify-center gap-2'
        >
          Post
        </button>
      </div>
    </form>
  );
}
