import {useState, useMemo, useLayoutEffect, useEffect, useCallback, useRef} from 'react'

export default function VideoPage() {
    const rootRef = useRef()
    const videoRef = useRef()
    const recording = useRef([])
    const recorderRef = useRef(null)
    const playbackVideoRef = useRef()
    const [uiState, setUiState] = useState('idle')

    useLayoutEffect(() => {
        startStream()
    }, [])

    const startStream = useCallback(() => {
        if (!videoRef.current) {
            videoRef.current = document.createElement('video')
        }
        if (typeof navigator.getUserMedia !== 'function') {
            console.error(`Unable to use camera`)
            return
        }

        navigator.getUserMedia({
            video: {
                facingMode: 'user',
                width: window.innerWidth,
                height: window.innerHeight
            },
            audio: true
        }, stream => {
            const video = videoRef.current
            video.width = window.innerWidth
            video.muted = true
            video.height = window.innerHeight
            video.autoplay = true
            video.srcObject = stream

            rootRef.current.appendChild(video)
            videoRef.current = video

            let mRecorder = recorderRef.current
            if (!mRecorder) {
                let options = {mimeType: "video/webm; codecs=vp9"};
                mRecorder = new MediaRecorder(stream, options);
                recorderRef.current = mRecorder

                mRecorder.ondataavailable = handleData

                mRecorder.onstop = () => {
                    setUiState(mRecorder.state)
                    swapRecording()
                }

                mRecorder.onstart = () => setUiState(mRecorder.state)
                setUiState(mRecorder.state)
            }

        }, e => {
            console.error(`error getting camera: `, e)
        })

    }, [])

    const handleData = useCallback((event) => {
        if (event.data.size > 0) {
            recording.current.push(event.data)
        }
    }, [])

    const startRecord = useCallback(() => {
        const recorder = recorderRef.current
        if (!recorder) {
            startStream()
        } else if (recorder.state === 'inactive') {
            recorder.start()
        }
    }, [startStream])

    const stopRecord = useCallback(() => {
        recorderRef.current.stop()
    }, [])


    const stopStream = useCallback(() => {
        const video = videoRef.current
        if (video && video.srcObject) {
            const stream = video.srcObject
            const tracks = stream.getTracks()
            tracks.forEach(function (track) {
                track.stop()
            })

            video.srcObject = null
            video.remove()
        }
    }, [])

    const swapRecording = useCallback(() => {
        const recordings = recording.current
        const blob = new Blob(recordings, {type: 'video/webm'})

        let video = playbackVideoRef.current
        if (!video) {
            video = document.createElement('video')
            video.width = window.innerWidth
            video.height = window.innerHeight
            video.autoplay = true
            video.controls = true
            playbackVideoRef.current = video
        }
        video.src = URL.createObjectURL(blob)
        stopStream()
        rootRef.current.appendChild(video)
        setUiState('playback')

    }, [])

    return (
        <div style={{height: '100vh', overflow: 'hidden'}} ref={rootRef}>
            <div className="controls" style={{position: 'fixed', bottom: '20px', left: '45%', zIndex: 20}}>
                <h2 style={{color: 'white'}}>{uiState}</h2>
                {['inactive'].includes(uiState) && (
                    <button style={styles.button} onPointerDown={startRecord}>
                        Record
                    </button>
                )}
                {uiState === 'recording' &&
                <button style={styles.button} onPointerDown={stopRecord}>Stop</button>
                }
            </div>
        </div>
    )
}

const styles = {
    button: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        color: 'white',
        background: '#EF44444'
    }
}