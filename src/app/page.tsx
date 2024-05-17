import { Suspense } from "react";
import Game from "./components/game";
import LoadingGame from "./components/LoadingGame";

export default function Home() {




  return (
    <>
      {/* Suspense Added  */}
      <Suspense fallback={ <LoadingGame/>}>
        <Game />
      </Suspense>
    </>
  );
}
