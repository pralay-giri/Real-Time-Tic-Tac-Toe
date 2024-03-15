import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameInfer, GameStatus, PlayerInfer } from '../types/index';
import socket from '../socketConfig/io';
import gameStatus from '../utils/gameStatus';
import { MdOutlineExitToApp } from 'react-icons/md';
import { VscDebugRestart } from 'react-icons/vsc';

const GamePage = () => {
    let countRef = 0;
    const navigator = useNavigate();

    const [gameInfo, setGameInfo] = useState<GameInfer | null>(null);
    const [bord, setBord] = useState<Array<number>>(Array(9).fill(-1));
    const [playerInfo, setPlayerInfo] = useState<PlayerInfer | null>(null);
    const [oponentInfo, setOponentInfo] = useState<PlayerInfer | null>(null);
    const [isGameStatusModalVisible, setIsGameStatusModalVisible] =
        useState<boolean>(false);
    const [isPlayAgainRequestVisible, setIsPlayAgainRequestVisible] =
        useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const userName = localStorage.getItem('userName');

    // handle if the user reload
    useEffect(() => {
        const gameData = JSON.parse(localStorage.getItem('gameData') as string);
        socket.emit('handle-reload', gameData);
    }, []);

    // setting all the initial data
    useEffect(() => {
        const gameData: GameInfer = JSON.parse(
            localStorage.getItem('gameData') as string
        );
        if (!gameData) {
            navigator('/');
        }
        setGameInfo(gameData);
        setBord(gameData?.gameBord);

        let interval: number;
        //seting the player/opponent info
        gameData?.players.forEach((player: PlayerInfer) => {
            if (player.playerName === userName) {
                setPlayerInfo(player as PlayerInfer);
            } else {
                setOponentInfo(player as PlayerInfer);
            }
        });

        return () => {
            clearInterval(interval);
            localStorage.removeItem('gameData');
            localStorage.removeItem('isGameCreated');
        };
    }, []);

    // handeling game-events
    useEffect(() => {
        socket.on('move', (updatedGame: GameInfer) => {
            setGameInfo(updatedGame);
            setBord(updatedGame.gameBord);
            localStorage.setItem('gameData', JSON.stringify(updatedGame));
        });

        socket.on('game-draw', (updatedGame: GameInfer) => {
            setGameInfo({ ...updatedGame });
            setBord(updatedGame.gameBord);
            setIsGameStatusModalVisible(true);
            setModalMessage('Game Draw');
            localStorage.setItem('gameData', JSON.stringify(updatedGame));
        });

        socket.on('game-win', (updatedGame: GameInfer) => {
            setGameInfo({ ...updatedGame });
            setBord(updatedGame.gameBord);
            setIsGameStatusModalVisible(true);
            localStorage.setItem('gameData', JSON.stringify(updatedGame));
            setModalMessage(`${updatedGame.winner} won the game`);
        });

        return () => {
            socket.removeListener('move');
            socket.removeListener('game-draw');
            socket.removeListener('game-win');
        };
    }, []);

    // handeling restart
    useEffect(() => {
        socket.on('confirm-restart', () => {
            setIsPlayAgainRequestVisible(true);
        });

        socket.on('start-game', (gameInfo) => {
            localStorage.setItem('gameData', JSON.stringify(gameInfo));
            setIsGameStatusModalVisible(false);
            setGameInfo(gameInfo);
            setBord(gameInfo?.gameBord);
            gameInfo?.players.forEach((player: PlayerInfer) => {
                if (player.playerName === userName) {
                    setPlayerInfo(player as PlayerInfer);
                } else {
                    setOponentInfo(player as PlayerInfer);
                }
            });
        });

        return () => {
            socket.removeListener('start-game');
            socket.removeListener('confirm-restart');
        };
    }, []);

    useEffect(() => {
        socket.on('end-game', () => {
            localStorage.removeItem('gameData');
            localStorage.removeItem('isGameCreated');
            navigator('/');
        });
        return () => {
            socket.removeListener('end-game');
        };
    }, []);

    if (!gameInfo) {
        return <h1>error</h1>;
    }

    // handeling the scroll
    if (isGameStatusModalVisible) {
        document.documentElement.style.overflowY = 'hidden';
    } else {
        document.documentElement.style.overflowY = 'auto';
    }

    const handleMove = (e: any) => {
        // 1. check if the position is occupy
        if (e.target.innerHTML || gameInfo.lastTurn !== playerInfo?.turn)
            return;

        // 2. find the clicked index
        const clickedIndex: number = Number(e.target.dataset.index);

        // 3. update the ui
        gameInfo.gameBord[clickedIndex] = playerInfo.turn === 'X' ? 0 : 1;
        gameInfo.lastTurn = playerInfo.turn === 'X' ? 'O' : 'X';
        setBord(gameInfo.gameBord);
        setGameInfo((prev) => {
            return { ...prev } as GameInfer;
        });
        localStorage.setItem('gameData', JSON.stringify(gameInfo));

        // 4. check winner status
        const gameStat: GameStatus = gameStatus(bord);

        const payload = {
            playerInfo,
            oponentInfo,
            clickedIndex,
            turn: playerInfo.turn,
            gameStat,
            roomId: gameInfo.roomId,
        };

        socket.emit('move', { payload });
    };

    const handleRestart = () => {
        // 1. send a request to server for restart game
        const payload = {
            gameInfo,
        };
        socket.emit('restart-game', payload);
    };

    const handleplayAgain = () => {
        socket.emit('confirm-restart', gameInfo);
        setIsPlayAgainRequestVisible(false);
    };

    const handleLeave = () => {
        socket.emit('end-game', gameInfo);
    };

    return (
        <div className="bord text-white">
            <div className="header flex items-center justify-evenly gap-10">
                {Array.from([playerInfo, oponentInfo]).map((player) => {
                    return (
                        <div
                            key={player?.playerName}
                            className="flex items-center"
                        >
                            <div className="w-20 max-sm:w-14">
                                <img
                                    src="/profile.png"
                                    alt="profile"
                                    className="w-full"
                                />
                            </div>
                            <div className="text-white">
                                <h1 className="text-xl max-sm:text-sm">
                                    {player?.playerName === userName
                                        ? 'You'
                                        : player?.playerName}
                                </h1>
                                <div className="flex gap-2 max-sm:text-sm">
                                    <p>turn: {player?.turn}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <h1 className="text-center my-5">
                {gameInfo.lastTurn === playerInfo?.turn
                    ? 'your turn'
                    : 'oponent turn'}
            </h1>
            <div className="my-20 mx-auto game-bord border w-fit *:flex *:flex-row *:*:flex  *:*:items-center *:*:justify-center *:*:cursor-pointer *:*:w-28 max-sm:*:*:w-20 *:*:aspect-square *:*:text-4xl *:*:border">
                <div className="row row-1">
                    {bord.slice(0, 3).map((box: any): ReactNode => {
                        return (
                            <div
                                key={countRef++}
                                className="box text-white"
                                data-index={countRef}
                                onClick={handleMove}
                            >
                                {box === -1 ? '' : box === 0 ? 'X' : 'O'}
                            </div>
                        );
                    })}
                </div>
                <div className="row row-2">
                    {bord.slice(3, 6).map((box: any): ReactNode => {
                        return (
                            <div
                                key={countRef++}
                                className="box text-white"
                                data-index={countRef}
                                onClick={handleMove}
                            >
                                {box === -1 ? '' : box === 0 ? 'X' : 'O'}
                            </div>
                        );
                    })}
                </div>
                <div className="row row-3">
                    {bord.slice(6, 9).map((box: any): ReactNode => {
                        return (
                            <div
                                key={countRef++}
                                className="box text-white"
                                data-index={countRef}
                                onClick={handleMove}
                            >
                                {box === -1 ? '' : box === 0 ? 'X' : 'O'}
                            </div>
                        );
                    })}
                </div>
            </div>
            {isGameStatusModalVisible && (
                <div className="absolute inset-0 bg-[rgba(255, 255, 255, 0.5)] backdrop-blur-md  flex flex-col items-center justify-center">
                    <div className="w-auto aspect-square border text-center  flex flex-col rounded-lg overflow-hidden">
                        <p className="message text-2xl max-sm:text-lg p-5 h-[100%] flex items-center justify-center">
                            {gameInfo.winner === playerInfo?.turn
                                ? 'You won the game'
                                : 'You loose the game'}
                        </p>
                        <div className="flex *:w-6/12 *:border h-[20%] rounded-lg *:flex *:items-center *:justify-center *:gap-2 *:transition-all">
                            <button
                                onClick={handleRestart}
                                className="bg-blue-400 hover:opacity-85"
                            >
                                Restart
                                <span>
                                    <VscDebugRestart />
                                </span>
                            </button>
                            <button
                                onClick={handleLeave}
                                className="bg-[#F7418F] hover:opacity-85"
                            >
                                Leave
                                <span>
                                    <MdOutlineExitToApp />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isPlayAgainRequestVisible && (
                <div className="absolute inset-0 bg-[rgba(255, 255, 255, 0.5)] backdrop-blur-md  flex flex-col items-center justify-center">
                    <div className="w-auto aspect-square border text-center  flex flex-col rounded-lg overflow-hidden">
                        <p className="message text-2xl max-sm:text-lg p-5 h-[100%] flex items-center justify-center">
                            {oponentInfo?.playerName} want to play again
                        </p>
                        <div className="flex *:w-6/12 *:border h-[20%] rounded-lg *:flex *:items-center *:justify-center *:gap-2 *:transition-all">
                            <button
                                onClick={handleplayAgain}
                                className="bg-blue-400 hover:opacity-85"
                            >
                                play again
                                <span>
                                    <VscDebugRestart />
                                </span>
                            </button>
                            <button
                                onClick={handleLeave}
                                className="bg-[#F7418F] hover:opacity-85"
                            >
                                Reject
                                <span>
                                    <MdOutlineExitToApp />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamePage;
