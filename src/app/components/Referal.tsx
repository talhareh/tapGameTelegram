import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const Referal = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const userId = searchParams.get('userid')

    const inviteLink = `https://t.me/krazymonkey_bot?game=krazymonkey&ref_id=${userId}`
    
    return (
        <div className="ref-area">
            <div className="bonus-heading ">
                <div className="bouns-show">
                    <div className="xbounus">
                        {/* <span className="x-b">x1</span> */}
                        <h4>+ 100,000</h4>
                    </div>
                    <Image src="/images/60431e202a46dba633eba7af437ff90f.png" width={40} height={40} alt="" />
                </div>

                
            </div>

            <div className="heading-2">
                <h3>For every friend who joins </h3>    
            </div>

            <div className="ref-button">
                <button onClick={() => {
                    alert(inviteLink);
                }}>
                    Refer a friend
                </button>
            </div>

            <h1>Invited Friends</h1>
            <div className="invited-frieds-list">
                <ul>
                    <li>
                        <h3>Nassem Shad</h3>
                    </li>
                    <li>
                        <h3>Nassem Shad</h3>
                    </li>
                </ul>
            </div>

            <h1>Referral Bonuses</h1>
            <p>Each friend of your join, you will get a multiple bonuses</p>
            <div className="bonus-frieds-list">
                <ul>
                    <li>
                        <h3>Nassem Shad</h3>
                        <div className="boun">
                            <span>+ 5,000</span>
                            <Image src="/images/60431e202a46dba633eba7af437ff90f.png" width={25} height={25} alt="" />
                        </div>
                    </li>
                    <li>
                        <h3>Nassem Shad</h3>
                        <div className="boun">
                            <span>+ 5,000</span>
                            <Image src="/images/60431e202a46dba633eba7af437ff90f.png" width={25} height={25} alt="" />
                        </div>
                    </li>
                    <li>
                        <h3>Nassem Shad</h3>
                        <div className="boun">
                            <span>+ 5,000</span>
                            <Image src="/images/60431e202a46dba633eba7af437ff90f.png" width={25} height={25} alt="" />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default Referal;