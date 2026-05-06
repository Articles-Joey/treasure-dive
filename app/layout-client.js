"use client"
import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import { useStore } from '@/hooks/useStore';
import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import ToontownModeHandler from '@articles-media/articles-dev-box/ToontownModeHandler';

export default function LayoutClient({ children }) {

    return (
        <>
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
            <ToontownModeHandler 
                useStore={useStore}
            />
        </>
    );
}
