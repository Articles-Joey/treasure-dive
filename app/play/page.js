import { Suspense } from "react"
import GamePage from "./play"
// import metadataAppend from "util/metadataAppend"

export const metadata = {
    title: process.env.NEXT_PUBLIC_GAME_NAME,
}

export default function Page() {
    return (
        <Suspense><GamePage /></Suspense>
    )
}