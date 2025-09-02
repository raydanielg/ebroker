// Video.js
// import { t } from '@/utils/translation';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { PiPlayCircleThin } from 'react-icons/pi';
import { useTranslation } from '../context/TranslationContext';

const Video = (props) => {
    const t = useTranslation()
    const [playing, setPlaying] = useState(false);
    const [manualPause, setManualPause] = useState(false); // State to track manual pause
    const [seekPosition, setSeekPosition] = useState(0);
    const [showThumbnail, setShowThumbnail] = useState(true);

    const handleVideoReady = (state) => {
        setPlaying(state);
        setShowThumbnail(!state);
    };

    const handleSeek = (e) => {
        try {
            if (e && typeof e.playedSeconds === "number") {
                setSeekPosition(parseFloat(e.playedSeconds));
                // Avoid pausing the video when seeking
                if (!manualPause) {
                    setPlaying(true);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSeekEnd = () => {
        setShowThumbnail(false);
    };

    const handlePause = () => {
        setManualPause(true); // Manually pause the video
        setShowThumbnail(true); // Reset showThumbnail to true
    };
    return (
        <div className='cardBg border flex flex-col rounded-2xl mb-7'>
            <div className="text-base font-bold p-5 blackTextColor border-b md:text-xl">
                {t("video")}
            </div>
            {!playing ?
                (
                    <div className='flex justify-center w-full h-[500px] p-5'>
                        <div className='w-full bg-blend-darken videoBgContainer rounded'
                            style={{
                                backgroundImage: `url(${props.bgImageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                            }}
                        >
                            <div className='relative text-white flex justify-center items-center w-full h-full'>
                                <button onClick={() => setPlaying(true)}>
                                    <PiPlayCircleThin size={80} className='videoPlayBtn' />
                                </button>
                            </div>
                        </div>
                    </div>
                ) :
                (
                    <ReactPlayer
                        className="!w-full !h-[500px]"
                        url={props.videoLink}
                        playing={playing}
                        controls={true}
                        onPlay={() => handleVideoReady(true)}
                        onPause={() => {
                            setManualPause(true); // Manually pause the video
                            handlePause();
                        }}
                        onEnded={() => setPlaying(false)}
                        onProgress={handleSeek}
                        onSeek={handleSeek}
                        onSeekEnd={handleSeekEnd}
                    />
                )
            }
        </div >
    );
};

export default Video;