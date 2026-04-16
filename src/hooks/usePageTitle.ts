'use client'

import { useEffect } from "react"

export function usePageTitle(title: string){
    useEffect(() => {
        if (title){
            const originalTitle = document.title
            document.title = `${title} | Светочъ`;
            return () => {
                document.title = originalTitle
            }
        }
    }, [title])
}