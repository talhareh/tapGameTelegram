'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import League from "./League";
import ProgressBar from "./ProgressBar";
import { useMainStore } from "@/zustand/mainStore";
import axios from "axios";
import { useRouter, useSearchParams  } from "next/navigation";
import moment from "moment";
import LoadingGame from "./LoadingGame";
import Cookies from 'js-cookie';
import { parse } from "path";
import Referal from "./Referal";

const Game = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const userId = searchParams.get('userid')

    const [loading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any | null>({});
    const [tab, setTab] = useState('referal');
    const [league, setLeague] = useState('bronze');
    const [isShaking, setIsShaking] = useState(false);
    const [timerId, setTimerId] = useState<any | null>(null); // State to store timerId
    const [updateTapsTimerId, setUpdateTapsTimerId] = useState<any | null>(null); // State to store timerId
    const [timer, setTimer] = useState<any | null>(null); // State to store timerId

    const target = 100;

    const [overAllTaps , setOverAllTaps] = useState(0);
    const cTaps = Cookies.get('taps');
    const [taps , setTaps] = useState(cTaps ? parseInt(cTaps) : 0);

    const mainStore = useMainStore();
    
    function calculatePer () {
        let pre = Math.floor(target - (taps / target) * 100)
        return pre;
    }

    const handleTap = () => {
        setTaps((prevTaps: number) => prevTaps - 1);
        setOverAllTaps((prevTaps: number) => prevTaps + 1);
        if(timer) {
            clearInterval(timer);
            setTimer(null);
        }
        if (!isShaking) { 
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false)
            }, 1000);
        }

        clearTimeout(updateTapsTimerId);
        const newTimerId: any = setTimeout(updateTaps, 5000); 
        setUpdateTapsTimerId(newTimerId);
    }

    useEffect(() => {
        if (taps >= target) {
            clearInterval(timer);
            setTimer(null);
        }else{
            Cookies.set('taps', taps.toString());
        }
    }, [taps, target, timer]);

    const startReset = () => {
        console.log('px',timer,taps , target)
        if(timer) return;
        if(taps >= target) return;
        const x = window.setInterval(() => {
            console.log('interval is working')
            setTaps((prevTaps: number) => prevTaps + 1);
            const exitTime = new Date().getTime();
            Cookies.set('lastVisitTime', exitTime.toString());
        }, 500);
        setTimer(x);
    }

    useEffect(() => {
        let lastVisitTime = Cookies.get('lastVisitTime');
        let cookieTaps = Cookies.get('taps');
        if(lastVisitTime){
            const currentTime = new Date().getTime();
            const differenceInSeconds = Math.floor((currentTime - parseInt(lastVisitTime)) / 1000);
            console.log('differenceInSeconds',differenceInSeconds, cookieTaps)
            let currentCookieTaps = 0;
            if(cookieTaps) currentCookieTaps = parseInt(cookieTaps);
            currentCookieTaps = differenceInSeconds + currentCookieTaps
            if(currentCookieTaps > target){
                currentCookieTaps = 100;
            }

            console.log('currentCookieTaps',currentCookieTaps);
            setTaps(currentCookieTaps);
        }
        
        
        const newTimerId: any = setTimeout(startReset, 5000); 
        setTimerId(newTimerId);
        return () => {
            clearTimeout(timerId)
            window.clearInterval(timer);
            
        };
    }, []);


    const checkAndCreateUser = async () => {
        try {
            // Make a POST request to the API route
             const response = await axios.post('/api/users', {
                telegramId: userId
            });
            setUser(response.data.user);

            response.data.user && setOverAllTaps(response.data.user.totalTaps);

            setIsLoading(false);
            // Handle success or navigate to another page
          } catch (error) {
            console.error('Error creating user:', error);
            // Handle error
          } 
    }


    const updateTaps = async () => {
        console.log('timer',timer);
        !timer && startReset();
        try {
            const response = await axios.post('/api/taps', {
            userId: user._id,
            taps: target - taps
        });
        mainStore.setTodayTaps(response?.data?.taps?.taps ?? 0)
        response.data.totalTaps && mainStore.setOverAllTapsByUser(response.data.totalTaps);
        response.data.overAllTaps && mainStore.setOverAllTaps(response.data.overAllTaps);
        } catch (error) {
        console.error('Error creating user:', error);
        } 
    }

    useEffect(() => {
        if(userId) {
            checkAndCreateUser();
        }
    }, [userId])

    if(loading){
        return <LoadingGame/>
    }

    return (
        <div id="game-container">
            <div className="background"></div>
            {!userId && 
                <div className="user-not-connected">
                    <h3>User is not connected</h3>
                </div>
            }
            {userId &&
            <div className="game-container-main">
                <div className="game-content">
                    {tab == 'earn' && 
                        <>
                            <div className="total-score">
                                <div className="coin">
                                    <Image src="/images/60431e202a46dba633eba7af437ff90f.png" width={100} height={100} alt="" />
                                </div>
                                <div className="totaltaps">
                                    <span id="overalltaps">{overAllTaps.toLocaleString()}</span>
                                    {/* <span id="overalltaps">{mainStore.overAllTaps.toLocaleString()}</span> */}
                                </div>
                            </div>
                            <div className="league">
                                <div className="center">
                                    <League name={league} />
                                </div>
                            </div>
                            <div id="target" onClick={handleTap}>
                                <div className="monkeyface" >
                                    <div className={isShaking ? 'shake-image' : ''} id="monkeyfaceimage">
                                        <Image src="/images/38571a7fa809aae955a5a443f5cdecbf.png" width={200} height={200} alt="" />
                                    </div>
                                </div>

                                <div className="task-area ">
                                    <div className="center flex space-between gap-5">
                                        <div className="flex justify-center">
                                            <div className="icon">
                                                <Image src="/images/current-svg.png" width={27} height={43} alt="" />
                                            </div>
                                            <div className="task-number flex gap-2">
                                                <span className="task_completed_target" id="score-value">{taps.toLocaleString()}</span>
                                                <span>/</span>
                                                <span className="task_total_target" id="task_total_target">{target.toLocaleString()}</span>
                                            </div>
                                        </div>
                                       {/*  <div className="flex over-all-taps-user">
                                         <span>{mainStore.overAllTapsByUser.toLocaleString()}</span>
                                        </div> */}
                                    </div>
                                    <div className="center">
                                    <ProgressBar progress={calculatePer()}/>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    {(tab == 'boost') && 
                        <>
                            <div className="comming-soon">
                                <div className="img-center">
                                    <Image src="/images/comming-soon.png" width={350} height={350} alt="" />
                                </div>
                            </div>
                        </>
                    }

                    {(tab == 'referal') && 
                        <>
                           <Referal />
                        </>
                    }
                    
                    <div className="footer-area">
                        <div className="center">
                            <ul>
                                <li>
                                    <div className={`bar-btn ${tab == 'earn' ? 'active' : ''}`} onClick={() => setTab('earn')}>
                                        <div><Image src="/images/earn.png" width={25} height={25} alt="" /></div>
                                        <span>Earn</span>                                        
                                    </div>
                                </li>
                                <li>
                                    <div className={`bar-btn ${tab == 'boost' ? 'active' : ''}`} onClick={() => setTab('boost')}>
                                        <div><Image src="/images/boost.png" width={25} height={25} alt="" /></div>
                                        <span>Boost</span>                                        
                                    </div>
                                </li>
                                <li>
                                    <div className={`bar-btn ${tab == 'referal' ? 'active' : ''}`} onClick={() => setTab('referal')}>
                                        <div><Image src="/images/friends.png" width={25} height={25} alt="" /></div>
                                        <span>Referals</span>                                        
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> 
            }
        </div>
    )
}

export default Game;