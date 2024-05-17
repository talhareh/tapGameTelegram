import Image from "next/image";

interface IPros {
    name: string
}

const images: any = {
    'bronze' : 'bronze.png',
}

const League = ({name} : IPros) => {

    return (
        <div className="icon">
            <Image src={`/images/${images[name]}`} width={101} height={23}  alt="" />
        </div>
    );
}

export default League;