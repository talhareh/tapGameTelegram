import { Suspense } from "react";
import Game from "./components/game";
import LoadingGame from "./components/LoadingGame";

export default function Home() {




  return (
    <>
      <Suspense fallback={ <LoadingGame/>}>
        <Game />
      </Suspense>
    </>
  );
}
