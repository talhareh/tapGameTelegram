import Image from "next/image";

const LoadingGame =  () => {
    return (
        <div id="game-container">
            <div className="background"></div>
            <div className="game-container-main">
                <div className="game-content " style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 40,
                }}>
                    <div className="monkeyface" >
                        <div  id="monkeyfaceimage">
                            <Image src="/images/fan.webp" width={300} height={300} alt="" />
                        </div>
                    </div>
                    <div className="loader"></div>
                </div>
            </div>
        </div>
    );
}

export default LoadingGame;