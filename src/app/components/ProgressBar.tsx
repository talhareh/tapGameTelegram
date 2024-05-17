import Image from "next/image";

interface IPros {
    progress: number
}


const ProgressBar = ({progress = 0} : IPros) => {

    return (
        <div className="progressbar">
            <div className="bg">
                <div className="fg" style={{width: `${progress}%`}}></div>
            </div>
        </div>
    );
}

export default ProgressBar;