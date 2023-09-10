'use client';

import { useState } from 'react';

export default function Editor() {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  return (
    <form className='flex flex-col shadow-md rounded-md dark:bg-secondary-gray border border-gray-600'>
      <div className='flex items-center justify-between rounded-t-md p-4 pb-0 border-b border-gray-600 dark:bg-primary-gray'>
        <div className='flex items-center'>
          <button
            className='flex items-center justify-center px-3 py-2 rounded-t-md -mb-[1px] disabled:dark:bg-secondary-gray disabled:border disabled:border-gray-600 disabled:border-b-0'
            disabled={mode === 'write'}
            onClick={() => setMode('write')}
            type='button'
          >
            Write
          </button>
          <button
            className='flex items-center justify-center px-3 py-2 rounded-t-md disabled:dark:bg-secondary-gray disabled:border disabled:border-gray-600 disabled:border-b-0'
            disabled={mode === 'preview'}
            onClick={() => setMode('preview')}
            type='button'
          >
            Preview
          </button>
        </div>
        <div></div>
      </div>
      <div></div>
      <div className='flex items-center justify-end'>
        <button type='submit'>Post</button>
      </div>
    </form>
  );
}
