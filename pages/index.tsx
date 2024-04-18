import { useState } from 'react';
import { diffWordsWithSpace } from 'diff';

export default function Home() {
    const [inputOne, setInputOne] = useState('');
    const [inputTwo, setInputTwo] = useState('');
    const [diffResult, setDiffResult] = useState([]);

    const handleCompare = () => {
        const result = diffWordsWithSpace(inputOne, inputTwo);
        //@ts-ignore
        setDiffResult(result);
    };

    return (
        <div style={{ margin: '20px' }}>
            <h1>String Difference Highlighter</h1>
            <textarea
                placeholder="Enter first string here..."
                value={inputOne}
                onChange={(e) => setInputOne(e.target.value)}
                style={{ width: '100%', height: '100px', marginBottom: '10px' }}
            />
            <textarea
                placeholder="Enter second string here..."
                value={inputTwo}
                onChange={(e) => setInputTwo(e.target.value)}
                style={{ width: '100%', height: '100px', marginBottom: '10px' }}
            />
            <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
 onClick={handleCompare}>Compare</button>
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
