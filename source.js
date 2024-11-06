const bingApiKey = '6f47bfb84b434f2992a7c4e39a0fc690';
const endpoint = 'https://api.bing.microsoft.com/v7.0/search';
let results = [];

async function search() {
    const query = document.getElementById('query').value;
    const url = `${endpoint}?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
        headers: { 'Ocp-Apim-Subscription-Key': bingApiKey }
    });

    if (!response.ok) {
        console.error("Error when calling Bing API:", response.statusText);
        return;
    }

    const data = await response.json();
    
    results = data.webPages.value.map(item => ({
        title: item.name,
        link: item.url,
        snippet: item.snippet
    }));
    
    displayResults();
}

function displayResults() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        document.getElementById('downloadBtn').style.display = 'none';
        return;
    }

    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';
    
        result.innerHTML = `
            <h3>${result.title}</h3>
            <a href="${result.link}" target="_blank">${result.link}</a>
            <p>${result.snippet}</p>
        `;

        resultsContainer.appendChild(resultDiv);
    });

    document.getElementById('downloadResults').style.display = 'inline';
}

function downloadResultsCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Title,URL,Description\n";

    results.forEach(result => {
        const row = [
            result.title.replace(/,/g, ''),
            result.link,
            result.snippet.replace(/,/g, '')
        ].join(',');
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "search_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}