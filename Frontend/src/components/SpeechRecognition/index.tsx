import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from "@mui/icons-material/Mic";
import { useEffect } from "react";
import PauseIcon from '@mui/icons-material/Pause';

interface Arguments {
    speechToggle: boolean,
    setMessage: (message:string) => void
}

const Speech: React.FC<Arguments> = ({speechToggle, setMessage}) => {
    useEffect(() => {
        if(speechToggle) {
            startListening()
        }
        else{
            SpeechRecognition.stopListening()
        }

    }, [speechToggle])

    

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const { transcript } = useSpeechRecognition();
    
    useEffect(()=> {
        if(speechToggle){
            setMessage(transcript)
        }
    },[transcript,setMessage,speechToggle])

    return (
        <div>
           {
            speechToggle ? 
            <PauseIcon sx={{ height: "4vh", width: "4vh" }} className='MicIcon'/> :
            <MicIcon sx={{ height: "4vh", width: "4vh" }} className="MicIcon" />
           }

        </div>
    )
}

export default Speech