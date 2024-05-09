'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { useAppSelector } from '@/store'

export default function LargePlayer() {

  const albumKey = useRef<null | string>(null);
  const mode = useAppSelector(state => state.player.mode);
  const currentTrack = useAppSelector(state => state.player.currentTrack);
  const isLastTrack = useAppSelector(state => state.player.isLastTrack);

  const router = useRouter();

  useEffect(() => {
    if (currentTrack) albumKey.current = currentTrack.parentRatingKey;
  }, [currentTrack]);

  useEffect(() => {
    if (mode === 'stopped' || (mode === 'ended' && isLastTrack)) {
      if (albumKey.current) router.push(`/library/album/${albumKey.current}`);
      else router.push('/');
    }
  }, [mode]);

  return (
    <>
      {mode === 'stopped' && 
        <div>Nothing is being played. Please select a book from the library.</div>
      }
    </>
  )
}