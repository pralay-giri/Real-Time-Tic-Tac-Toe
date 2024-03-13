import { FaUserFriends } from 'react-icons/fa';
import { FaComputer } from 'react-icons/fa6';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { generateId } from '../utils/generateRoomId';

const HomePage = () => {
    const navigator: NavigateFunction = useNavigate();

    useEffect(() => {
        const userName: string | null = localStorage.getItem('userName');
        if (!userName) {
            // setting a default userName
            const userName = generateId(15);
            localStorage.setItem('userName', userName);
        }
        localStorage.removeItem('gameData');
    }, []);

    const handleFriendGame = () => {
        const id = generateId(10);
        navigator(`/game/${id}`);
    };

    const handleComputerGame = () => {
        // TODO implement in further devlopement
    };

    return (
        <div className="flex gap-5 mt-20 flex-col items-center justify-center *:w-3/12 *:text-xl *:text-black *:border-none *:border *:py-3 *:px-2 *:rounded-md *:bg-blue-400 *:flex *:items-center *:justify-evenly">
            <button className="hover:bg-opacity-85" onClick={handleFriendGame}>
                play with frend <FaUserFriends />
            </button>
            <button
                className="hover:bg-opacity-85"
                onClick={handleComputerGame}
            >
                play with computer <FaComputer />
            </button>
            <Link to="/edit" className="hover:bg-opacity-85">
                Edit name
            </Link>
        </div>
    );
};

export default HomePage;
