import { useEffect, useRef, useState } from "react";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import {
  MdPauseCircleOutline,
  MdPlayCircleOutline,
  MdFileDownload,
} from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

const AudioPlayer = ({ audioSrc, fileName = "audio-file.mp4" }) => {
  const t = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Initialize audio and set up event listeners
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !audioSrc) return;

    const updateProgress = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(currentProgress);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    // Set up event listeners
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Cleanup function
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioSrc]);

  // Update playback rate when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Handle progress bar click
  const handleProgressBarClick = (e) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;

    if (!progressBar || !audio || !audio.duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickPercentage = (clickPosition / progressBarWidth) * 100;

    // Set new time based on click position
    audio.currentTime = (clickPercentage / 100) * audio.duration;
    setProgress(clickPercentage);
  };

  // Handle mute/unmute
  const handleMute = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.muted = !audio.muted;
      setAudioMuted(!audioMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    const audio = audioRef.current;

    if (audio) {
      const volumeValue = newVolume[0] / 100;
      setVolume(volumeValue);
      audio.volume = volumeValue;

      if (volumeValue === 0) {
        setAudioMuted(true);
        audio.muted = true;
      } else if (audioMuted) {
        setAudioMuted(false);
        audio.muted = false;
      }
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!audioSrc) return;

    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds) return "00:00";

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex w-full items-center rounded-full bg-gray-100">
      <button
        type="button"
        onClick={togglePlay}
        className="primaryBg mx-2 flex h-7 w-7 items-center justify-center rounded-full text-white focus:outline-none md:h-10 md:w-10"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <MdPauseCircleOutline className="h-4 w-4 md:h-6 md:w-6" />
        ) : (
          <MdPlayCircleOutline className="h-4 w-4 md:h-6 md:w-6" />
        )}
      </button>

      <div
        ref={progressBarRef}
        className="relative mx-0 h-2 w-16 flex-grow cursor-pointer overflow-hidden rounded-full bg-gray-300 md:mx-3 md:w-20"
        onClick={handleProgressBarClick}
      >
        <div
          className="transition-width primaryBg absolute left-0 top-0 h-full rounded-full duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        onClick={handleMute}
        className="secondryTextColor mx-1 flex h-4 items-center justify-center md:mx-2 md:my-2 md:h-8 md:w-8"
        aria-label={audioMuted ? "Unmute" : "Mute"}
      >
        {audioMuted ? (
          <HiOutlineSpeakerXMark className="h-5 w-5 md:h-6 md:w-6" />
        ) : (
          <HiOutlineSpeakerWave className="h-5 w-5 md:h-6 md:w-6" />
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="secondryTextColor flex h-6 w-6 items-center justify-center md:h-8 md:w-8"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <MdFileDownload className="h-4 w-4" />
            <span>{t("download")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled
            className="cursor-default px-2 py-1 opacity-100"
          >
            <span className="text-xs font-semibold">{t("playbackSpeed")}</span>
          </DropdownMenuItem>
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <DropdownMenuItem
              key={rate}
              onClick={() => setPlaybackRate(rate)}
              className={`px-6 ${playbackRate === rate ? "bg-gray-100 font-medium" : ""}`}
            >
              {rate}x
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <audio ref={audioRef} src={audioSrc} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
