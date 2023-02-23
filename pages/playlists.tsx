import React, { useState } from 'react'
import { PlaylistDnD, Playlist } from '../components/playlist'

const Playlists = () => {
  const [playlist, setPlaylist] = useState<Playlist>([
    {
      isQueued: true,
      hasBuffer: false,
      key: 'aldksjfa',
      uri: 'wtf',
      title: 'you there'
    },
    {
      isQueued: false,
      hasBuffer: false,
      key: 'aldkalfdjas',
      uri: 'wtf2',
      title: 'you hellow there'
    },
    {
      isQueued: false,
      hasBuffer: false,
      key: 'asldfjkallls',
      uri: 'wtsss',
      title: 'you brown there'
    },
    {
      isQueued: false,
      hasBuffer: false,
      key: 'aldkxxlfdjas',
      uri: 'wtf2xx',
      title: 'you xxx there'
    },
    {
      isQueued: false,
      hasBuffer: false,
      key: 'aldal',
      uri: 'wtf2',
      title: 'you hellow there'
    }

  ])
  const orderPlaylist = (p: Playlist) => setPlaylist(p)
  return (
    <div className='flex flex-row '>
      <PlaylistDnD playlist={playlist} orderPlaylist={orderPlaylist} />
    </div>
  )
}

export default Playlists
