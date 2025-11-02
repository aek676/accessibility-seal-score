import React, { useState, useCallback } from 'react';
import { ArrowDownToLine, SendHorizontal } from 'lucide-react';

const Spinner = () => (
    <div className="flex justify-center items-center my-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
);

interface ImageCardProps {
    src: string;
    alt: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
        <img src={src} alt={alt} className="rounded-md w-full h-auto aspect-square object-cover" />
    </div>
);

const App: React.FC = () => {
    const [score, setScore] = useState<string>('');
    const [imageName, setImageName] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageName(e.target.value);
    }

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and decimals
        if (/^\d*\.?\d*$/.test(value)) {
            setScore(value);
        }
    };

    const generateStamps = useCallback(async () => {
        if (!score || isNaN(Number(score)) || Number(score) < 0) {
            setError('Por favor, introduce una puntuación numérica válida.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImages([]);

        try {
            const API_URL = 'http://localhost:8000';
            const response = await fetch(`${API_URL}/api/imagen-score/${score}`);

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error(`Error de comunicación con el servidor: ${response.status}`);
            }

            if (!response.ok) {
                // If API returns an error response, use the error message from the API
                throw new Error(data.error || `Error HTTP: ${response.status}`);
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setImages([data.white_seal, data.black_seal]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'No se pudieron generar los sellos. Por favor, inténtalo de nuevo más tarde.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [score]);

    const downloadImages = useCallback(async () => {
        if (images.length === 0) return;

        const imageTypes = ['sello blanco', 'sello negro'];

        for (let i = 0; i < images.length; i++) {
            try {
                // For base64 images, we can directly create a blob
                const base64Data = images[i].replace(/^data:image\/[a-z]+;base64,/, '');
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);

                for (let j = 0; j < byteCharacters.length; j++) {
                    byteNumbers[j] = byteCharacters.charCodeAt(j);
                }

                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `(${imageName}) ${imageTypes[i]}.png`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } catch (err) {
                setError('Error al descargar la imagen.');
                console.error('Download error:', err);
            }
        }
    }, [images, score]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Generador de Sellos
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Crea sellos únicos introduciendo una puntuación.
                    </p>
                </header>

                <main className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <label htmlFor="name-input" className="sr-only">Nombre del sitio web</label>
                            <input
                                id="name-input"
                                type="text"
                                value={imageName}
                                onChange={handleImageNameChange}
                                placeholder="Introduce el nombre del sitio web (sitioweb.com)"
                                className="w-full p-4 pl-6 text-lg bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 outline-none text-white placeholder-gray-500"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="relative flex-grow w-full">
                            <label htmlFor="score-input" className="sr-only">Puntuación</label>
                            <input
                                id="score-input"
                                type="text"
                                value={score}
                                onChange={handleScoreChange}
                                placeholder="Introduce la puntuación (e.j., 85.5)"
                                className="w-full p-4 pl-6 text-lg bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 outline-none text-white placeholder-gray-500"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={generateStamps}
                            disabled={isLoading || !score}
                            className="w-full md:w-auto flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            {isLoading ? 'Generando...' : <SendHorizontal />}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="mt-8">
                        {isLoading ? (
                            <Spinner />
                        ) : images.length > 0 && (
                            <div className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ImageCard src={images[0]} alt={`Sello blanco con puntuación ${score}`} />
                                    <ImageCard src={images[1]} alt={`Sello negro con puntuación ${score}`} />
                                </div>
                                <button
                                    onClick={downloadImages}
                                    className="w-full flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    <ArrowDownToLine />
                                    Descargar Ambos Sellos
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
