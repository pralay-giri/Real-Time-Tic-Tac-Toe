import Body from './compoents/Body.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import InitGamePage from './compoents/InitGamePage.js';
import HomePage from './compoents/HomePage.js';
import EditUserName from './compoents/EditUserName.js';
import JoinGame from './compoents/JoinGame.js';
import GamePage from './compoents/GamePage.js';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Body />,
            children: [
                {
                    path: '/',
                    element: <HomePage />,
                },
                {
                    path: '/edit',
                    element: <EditUserName />,
                },
                {
                    path: '/game/:roomId',
                    element: <InitGamePage />,
                },
                {
                    path: 'game/:roomId/:confirmationId',
                    element: <JoinGame />,
                },
                {
                    path: 'gameBord',
                    element: <GamePage />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
