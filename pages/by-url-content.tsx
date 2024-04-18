import { useState } from 'react';
import { diffWordsWithSpace } from 'diff';
import { parse } from 'node-html-parser';

export default function Home() {
    const [urlOne, setUrlOne] = useState('');
    const [urlTwo, setUrlTwo] = useState('');
    const [diffResult, setDiffResult] = useState([]);
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
        const mainContent = node.querySelector('main, article, .main-content, #content') || node;
        return normalizeText(mainContent.innerText);
    }
    
    function normalizeText(text: any) {
        return text.replace(/\s+/g, ' ').trim();
    }

    // const fetchText = async (url: string) => {
    //     try {
    //         const response = await fetch(url);
    //         const html = await response.text();
    //         const root = parse(html);
    //         // Try to find the main content by common tags
    //         const mainContent = root.querySelector('article') || root.querySelector('main') || root.querySelector('#content');
    //         return mainContent ? mainContent.textContent : root.textContent;  // Use found content or fallback to full text
    //     } catch (err) {
    //         setError('Failed to fetch text. Please check the URL.');
    //         return '';
    //     }
    // };

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
