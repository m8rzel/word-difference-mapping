import { useState } from 'react';
import { diffWordsWithSpace } from 'diff';
import { parse } from 'node-html-parser';

export default function Home() {
    const [urlOne, setUrlOne] = useState('');
    const [urlTwo, setUrlTwo] = useState('');
    const [textOne, setTextOne] = useState('');
    const [textTwo, setTextTwo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchText = async (url: string) => {
        try{
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return extractContentBySelectors(doc.body);
        } catch (err) {
            setError('Failed to fetch text. Please check the URL.');
            return '';
        }
    }
    
    function extractContentBySelectors(node: any) {
        // Adjust the selector to better target the main content
        const mainContent = node.querySelector('main') || node;
        return normalizeText(mainContent.innerText);
    }
    
    function normalizeText(text: any) {
        return text.replace(/\s+/g, ' ').trim();
    }

    const handleCompare = async () => {
        setLoading(true);
        setError('');
        const fetchedTextOne = await fetchText(urlOne);
        const fetchedTextTwo = await fetchText(urlTwo);
        setTextOne(fetchedTextOne);
        setTextTwo(fetchedTextTwo);
        setLoading(false);
    };

    const renderDiff = () => {
        const diff = diffWordsWithSpace(textOne, textTwo);
        const resultOne: any[] = [];
        const resultTwo: any[] = [];

        diff.forEach(part => {
            const className = part.added ? 'bg-green-200' : part.removed ? 'bg-red-200' : '';
            if (!part.removed) {
                resultOne.push(<span key={resultOne.length} className={`inline-block ${className}`}>{part.value}</span>);
            }
            if (!part.added) {
                resultTwo.push(<span key={resultTwo.length} className={`inline-block ${className}`}>{part.value}</span>);
            }
        });

        return (
            <div className="flex">
                <div className="w-1/2 p-2">{resultOne}</div>
                <div className="w-1/2 p-2">{resultTwo}</div>
            </div>
        );
    };

    return (
        <div className="m-5">
            <h1 className="text-2xl font-bold mb-4">URL Text Comparison Tool</h1>
            <input
                type="text"
                placeholder="Enter first URL here..."
                value={urlOne}
                onChange={(e) => setUrlOne(e.target.value)}
                className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <input
                type="text"
                placeholder="Enter second URL here..."
                value={urlTwo}
                onChange={(e) => setUrlTwo(e.target.value)}
                className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <button
                onClick={handleCompare}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 mb-4"
            >
                {loading ? 'Loading...' : 'Compare'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {textOne && textTwo && renderDiff()}
        </div>
    );
}
