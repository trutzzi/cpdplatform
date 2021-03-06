import { useEffect, useState } from 'react';

export default function useTitler(titleDocument: string) {
    function setTitle(title: string) {
        document.title = title;
    };

    useEffect(() => {
        setTitle(titleDocument)
    }, [titleDocument]);

    return [
        titleDocument,
        (newTitle: string) => setTitle(newTitle)
    ]
}

