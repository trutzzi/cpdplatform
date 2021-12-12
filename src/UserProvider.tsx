import { useContext } from 'react';
import { AuthProvider } from './App';


export default function UserProvider() {
    const context = useContext(AuthProvider)
    return (<p>{context.name && context.name}</p>);
}