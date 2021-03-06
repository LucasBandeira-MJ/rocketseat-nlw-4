import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

const INITIAL_TIME = 6
let countdownTimeout: NodeJS.Timeout


interface CountdownContextData {
    minutes: number
    seconds: number
    hasFinished: boolean
    isActive: boolean
    startCountdown: () => void
    resetCountdown: () => void
}

interface CountdownProviderProps {
    children: ReactNode
}

export const CountdownContext = createContext({} as CountdownContextData)

export const CountdownProvider = ({children}: CountdownProviderProps) => {
    const { startNewChallenge } = useContext(ChallengesContext)

    const [time, setTime] = useState(INITIAL_TIME)
    const [isActive, setIsActive] = useState(false)
    const [hasFinished, setHasFinished] = useState(false)

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    useEffect(() => {
        if(isActive && time > 0 ) {
            countdownTimeout = setTimeout(() => {
                setTime(time => time - 1)
            }, 1000)
        } else if(isActive && time === 0) {
            setHasFinished(true)
            setIsActive(false)
            startNewChallenge()
        }

    }, [isActive, time])

    const startCountdown = () => {
        setIsActive(true)
    }

    const resetCountdown = () => {
        clearInterval(countdownTimeout)
        setIsActive(false)
        setHasFinished(false)
        setTime(INITIAL_TIME)
    }



    return (
        <CountdownContext.Provider value={
            {
                minutes, 
                seconds,
                hasFinished,
                isActive,
                startCountdown,
                resetCountdown
            }
        }>
            {children}
        </CountdownContext.Provider>
    )
}