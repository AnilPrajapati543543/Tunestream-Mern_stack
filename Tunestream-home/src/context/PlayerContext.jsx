import { createContext, useEffect, useRef, useState, useContext } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef(null);
    const { user, isAuthenticated } = useAuth();

    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumData] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [playQueue, setPlayQueue] = useState([]);
    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.7);

    //  SHUFFLE & LOOP
    const [isShuffling, setIsShuffling] = useState(false);
    const [isLooping, setIsLooping] = useState(false);

    //  LYRICS
    const [lyricsData, setLyricsData] = useState([]);

    // AUTH MODAL STATE
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
    });

    //  PLAY / PAUSE
    const play = () => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        audioRef.current?.play().catch(()=>{});
    }

    const pause = () => audioRef.current?.pause();

    //  TOGGLES
    const shuffleToggle = () => setIsShuffling(prev => !prev);
    const loopToggle = () => setIsLooping(prev => !prev);

    //  SELECT SONG
    const playWithId = (id, queue = null) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        const activeQueue = queue || songsData;
        setPlayQueue(activeQueue);
        const t = activeQueue.find(i => i._id === id);
        if (t) setTrack(t);
    };

    //  PREVIOUS
    const previous = () => {
        if (!track || playQueue.length === 0) return;

        if (isShuffling) {
            const randomIndex = Math.floor(Math.random() * playQueue.length);
            setTrack(playQueue[randomIndex]);
            return;
        }

        const i = playQueue.findIndex(s => s._id === track._id);

        if (i > 0) {
            setTrack(playQueue[i - 1]);
        } else {
            setTrack(playQueue[playQueue.length - 1]);
        }
    };

    //  NEXT
    const next = () => {
        if (!track || playQueue.length === 0) return;

        if (isShuffling) {
            const randomIndex = Math.floor(Math.random() * playQueue.length);
            setTrack(playQueue[randomIndex]);
            return;
        }

        const i = playQueue.findIndex(s => s._id === track._id);

        if (i < playQueue.length - 1) {
            setTrack(playQueue[i + 1]);
        } else {
            setTrack(playQueue[0]); // loop playlist
        }
    };

    //  SEEK
    const seekSong = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = percent * audioRef.current.duration;
    };

    //  VOLUME
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const changeVolume = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        setVolume(Math.max(0, Math.min(1, percent)));
    };

    //  AUDIO EVENTS
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const update = () => {
            if (!audio.duration) return;

            const percent = (audio.currentTime / audio.duration) * 100;
            setProgress(percent);

            setTime({
                currentTime: {
                    minute: Math.floor(audio.currentTime / 60),
                    second: Math.floor(audio.currentTime % 60)
                },
                totalTime: {
                    minute: Math.floor(audio.duration / 60),
                    second: Math.floor(audio.duration % 60)
                }
            });
        };

        const handleEnd = () => {
            if (isLooping) {
                audio.currentTime = 0;
                audio.play();
            } else {
                next();
            }
        };

        audio.addEventListener("timeupdate", update);
        audio.addEventListener("ended", handleEnd);
        audio.addEventListener("play", () => setPlayStatus(true));
        audio.addEventListener("pause", () => setPlayStatus(false));

        return () => {
            audio.removeEventListener("timeupdate", update);
            audio.removeEventListener("ended", handleEnd);
        };
    }, [track, isLooping, isShuffling]);

    //  PLAY WHEN TRACK CHANGES
    useEffect(() => {
        if (track && audioRef.current && isAuthenticated) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(()=>{});
        }
    }, [track, isAuthenticated]);

    //  LOAD DATA
    useEffect(() => {
        const load = async () => {
            try {
                // Fetch public songs and albums
                const [s, a] = await Promise.all([
                    API.get("/song/list"),
                    API.get("/album/list")
                ]);

                if (s.data.success) {
                    setSongsData(s.data.songs);
                    setPlayQueue(s.data.songs);
                    if (s.data.songs.length > 0 && !track) {
                        setTrack(s.data.songs[0]);
                    }
                }

                if (a.data.success) {
                    setAlbumData(a.data.albums);
                }

                // Fetch private playlists only if authenticated
                if (isAuthenticated) {
                    const p = await API.get("/playlist/list");
                    if (p.data.success) {
                        setPlaylists(p.data.playlists);
                    }
                }

            } catch (err) {
                console.error("API Fetch Error:", err);
            }
        };
        load();
    }, [isAuthenticated]);

    // CONTEXT VALUE
    const value = {
        audioRef,
        track,
        playStatus,
        play,
        pause,
        previous,
        next,
        playWithId,
        seekSong,
        progress,
        time,
        volume,
        changeVolume,
        songsData,
        playQueue,
        albumsData,
        playlists,
        setPlaylists,
        lyricsData,
        shuffleToggle,
        loopToggle,
        isShuffling,
        isLooping,
        isAuthModalOpen,
        setIsAuthModalOpen
    };

    return (
        <PlayerContext.Provider value={value}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;