import LobbyPage from "."
import { Suspense } from "react";

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_GAME_NAME} Lobby`,
}

export default function Home() {

  return (
    <Suspense><LobbyPage /></Suspense>
  )

}
