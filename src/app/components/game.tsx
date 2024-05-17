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

const Game = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const userId = searchParams.get('userid')

    const [loading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any | null>({});
    const [tab, setTab] = useState('earn');
    const [league, setLeague] = useState('bronze');
    const [isShaking, setIsShaking] = useState(false);
    const [timerId, setTimerId] = useState<any | null>(null); // State to store timerId

    const mainStore = useMainStore();
    
    function calculatePer () {
        return Math.floor((mainStore.todayTaps / mainStore.targetTaps) * 100)
    }

    const handleTap = () => {
        let taps = mainStore.todayTaps 
        let overAllTapsByUser = mainStore.overAllTapsByUser; 
        taps++
        overAllTapsByUser++
        mainStore.setTodayTaps(taps);
        mainStore.setOverAllTapsByUser(overAllTapsByUser)
        if(mainStore.todayTaps >= mainStore.targetTaps){
            updateTaps();
            alert('Task Completed')
            return;
        }

       

        if (!isShaking) { 
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false)
            }, 1000);
        }

        clearTimeout(timerId);
        const newTimerId: any = setTimeout(updateTaps, 5000); // 5 seconds
        setTimerId(newTimerId); // Update timerId state
    }


    const checkAndCreateUser = async () => {
        try {
            // Make a POST request to the API route
             const response = await axios.post('/api/users', {
                telegramId: userId
            });
            setUser(response.data.user);
            getTodayTaps(response.data.user._id);
            response.data.totalTaps && mainStore.setOverAllTapsByUser(response.data.totalTaps);
            response.data.overAllTaps && mainStore.setOverAllTaps(response.data.overAllTaps);
            setIsLoading(false);
            // Handle success or navigate to another page
          } catch (error) {
            console.error('Error creating user:', error);
            // Handle error
          } 
    }

    const getTodayTaps = async (uId?: string) => {
        try {
            const response = await axios.get(`/api/taps?userId=${uId ?? user._id}&date=${moment().format('YYYY-MM-DD')}`);
            mainStore.setTodayTaps(response?.data?.taps?.taps ?? 0)
            response.data.totalTaps && mainStore.setOverAllTapsByUser(response.data.totalTaps);
            response.data.overAllTaps && mainStore.setOverAllTaps(response.data.overAllTaps);
          } catch (error) {
            console.error('Error creating user:', error);
          } 
    }


    const updateTaps = async () => {
        try {
             const response = await axios.post('/api/taps', {
                userId: user._id,
                taps: mainStore.todayTaps,
                date: moment().format('YYYY-MM-DD')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                    <span id="overalltaps">{mainStore.overAllTapsByUser.toLocaleString()}</span>
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
                                                <span className="task_completed_target" id="score-value">{mainStore.todayTaps.toLocaleString()}</span>
                                                <span>/</span>
                                                <span className="task_total_target" id="task_total_target">{mainStore.targetTaps.toLocaleString()}</span>
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

                    {(tab == 'boost' || tab == 'referal') && 
                        <>
                            <div className="comming-soon">
                                <div className="img-center">
                                    <Image src="/images/comming-soon.png" width={350} height={350} alt="" />
                                </div>
                            </div>
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