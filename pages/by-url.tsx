import { useState } from 'react';
import { diffWordsWithSpace } from 'diff';

export default function Home() {
    const [urlOne, setUrlOne] = useState('');
    const [urlTwo, setUrlTwo] = useState('');
    const [diffResult, setDiffResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchText = async (url: string) => {
        try {
            const response = await fetch(url);
            const text = await response.text();
            return text;
        } catch (err) {
            setError('Failed to fetch text. Please check the URL.');
            return '';
        }
    };

    const handleCompare = async () => {
        setLoading(true);
        setError('');
        const textOne = await fetchText(urlOne);
        const textTwo = await fetchText(urlTwo);
        const result = diffWordsWithSpace(textOne, textTwo);

        //@ts-ignore
        setDiffResult(result);
        setLoading(false);
    };

    return (
        <div style={{ margin: '20px' }}>
            <h1>URL Text Comparison Tool</h1>
            <input
                type="text"
                placeholder="Enter first URL here..."
                value={urlOne}
                onChange={(e) => setUrlOne(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
            />
            <input
                type="text"
                placeholder="Enter second URL here..."
                value={urlTwo}
                onChange={(e) => setUrlTwo(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
            />
            <button onClick={handleCompare} disabled={loading} style={{ marginBottom: '10px' }}>
                {loading ? 'Loading...' : 'Compare'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                {diffResult.map((part: any, index) => (
                    <span key={index} style={{ backgroundColor: part.added ? 'lightgreen' : part.removed ? 'salmon' : 'transparent' }}>
                        {part.value}
                    </span>
                ))}
            </div>
        </div>
    );
}
