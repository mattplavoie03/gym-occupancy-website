// Function to generate the CSV URL with a unique query parameter to prevent caching
function getCsvUrl() {
  const baseUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUoxTHOCRLEnVUmW7OlCpeSti_lPZeHb3AZslEPTNDYYrTTsyMMTjcbIBxFkxoChF2pEBztjGe22fV/pub?gid=0&single=true&output=csv'; 
  const timestamp = new Date().getTime();
  return `${baseUrl}&nocache=${timestamp}`;
}

// Function to fetch CSV data with cache busting
async function fetchCSV() {
  const url = getCsvUrl();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.text();
    console.log('Fetched CSV Data:', data); // Debugging log
    return data;
  } catch (error) {
    console.error('Error fetching CSV:', error);
    return null;
  }
}

// Function to parse CSV and extract the current count
function parseCSV(csv) {
  if (!csv) {
    console.error('CSV data is undefined or empty.');
    return '--';
  }

  const lines = csv.split('\n');
  console.log('CSV Lines:', lines); // Debugging log

  if (lines.length < 2) {
    console.error('Not enough lines in CSV data.');
    return '--';
  }

  const values = lines[1].split(',');

  console.log('Values:', values); // Debugging log

  // Accessing the second column (index 1) for the occupancy count
  const count = values[1];

  if (count !== undefined && count.trim() !== '') {
    return count.trim();
  } else {
    console.error('Occupancy count is undefined or empty.');
    return '--';
  }
}

// Prevent multiple fetch requests
let isFetching = false;

// Function to update the count on the webpage
async function updateCount() {
  if (isFetching) return;
  isFetching = true;
  
  const csvData = await fetchCSV();
  if (csvData) {
    const count = parseCSV(csvData);
    document.getElementById('current-count').innerText = count;
  } else {
    document.getElementById('current-count').innerText = 'Error Loading Data';
  }
  
  isFetching = false;
}

// Initial fetch
updateCount();

// Update the count every 30 minutes (1,800,000 milliseconds)
setInterval(updateCount, 1800000);


