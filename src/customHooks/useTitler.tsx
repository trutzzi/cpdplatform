import { useEffect } from 'react';

export const titleApp = 'CPD Platform'

export default function useTitler(titleDocument: string) {
    function setTitle(title: string) {
        document.title = titleApp + ' | ' + title;
    };

    useEffect(() => {
        setTitle(titleDocument)
    }, [titleDocument]);

    return [
        titleDocument,
        (newTitle: string) => setTitle(newTitle)
    ]
}

