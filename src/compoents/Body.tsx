import { useEffect } from 'react';
import Header from './Header';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';

const Body = () => {
    const navigator: NavigateFunction = useNavigate();
    useEffect(() => {
        try {
            const userName = localStorage.getItem('userName');
            if (!userName?.trim().length) {
                navigator('/login');
            }
        } catch (error) {}
    }, []);

    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};

export default Body;
