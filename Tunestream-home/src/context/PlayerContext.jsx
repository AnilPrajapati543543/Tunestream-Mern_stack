import { createContext, useEffect, useRef, useState, useContext } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef(null);
    const { user, isAuthenticated } = useAuth();

    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumData] = useState([]);
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
    const playWithId = (id) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        const t = songsData.find(i => i._id === id);
        if (t) setTrack(t);
    };

    //  PREVIOUS
    const previous = () => {
        if (!track || songsData.length === 0) return;

        if (isShuffling) {
            const randomIndex = Math.floor(Math.random() * songsData.length);
            setTrack(songsData[randomIndex]);
            return;
        }

        const i = songsData.findIndex(s => s._id === track._id);

        if (i > 0) {
            setTrack(songsData[i - 1]);
        } else {
            setTrack(songsData[songsData.length - 1]);
        }
    };

    //  NEXT
    const next = () => {
        if (!track || songsData.length === 0) return;

        if (isShuffling) {
            const randomIndex = Math.floor(Math.random() * songsData.length);
            setTrack(songsData[randomIndex]);
            return;
        }

        const i = songsData.findIndex(s => s._id === track._id);

        if (i < songsData.length - 1) {
            setTrack(songsData[i + 1]);
        } else {
            setTrack(songsData[0]); // loop playlist
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
                // Use the configured API instance
                const [s, a] = await Promise.all([
                    API.get("/song/list"),
                    API.get("/album/list")
                ]);

                if (s.data.success) {
                    setSongsData(s.data.songs);
                    if (s.data.songs.length > 0) {
                        setTrack(s.data.songs[0]);
                    }
                }

                if (a.data.success) {
                    setAlbumData(a.data.albums);
                }

            } catch (err) {
                console.error("API Fetch Error:", err);
            }
        };
        load();
    }, []);

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
        albumsData,
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