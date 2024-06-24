document.getElementById('csvFile').addEventListener('change', function(e) {
  var file = e.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
      var contents = e.target.result;
      processData(contents); // Process CSV data
  };
  reader.readAsText(file);
});
function downloadCSV() {
  // แทนที่ URL ด้านล่างด้วยลิงก์ไปยังไฟล์ CSV ใน Google Drive
  var csvUrl = "https://drive.google.com/file/d/1abYoc4UFeS8LNKThebp9kI6xjNZVc7xM/view?usp=sharing";
  window.location.href = csvUrl;
}
// Function to process CSV data
function processData(csvData) {
  var lines = csvData.split('\n');
  var data = [];
  var headers = lines[0].split(','); // Assuming headers are in the first line

  for (var i = 1; i < lines.length; i++) {
      var values = lines[i].split(',');
      if (values.length === headers.length) {
          var entry = {};
          for (var j = 0; j < headers.length; j++) {
              entry[headers[j].trim()] = values[j].trim();
          }
          data.push(entry);
      }
  }

  // Save data array to use for searching later
  window.csvData = data;
  window.csvHeaders = headers;
  console.log(window.csvData);  // Debugging: print the data to the console
}

// Function to handle search button click
function searchICSCode() {
  var searchInput = document.getElementById('searchInput').value.trim().toLowerCase(); // แปลงค่าเป็นตัวพิมพ์เล็กทั้งหมด
  var resultsList = document.getElementById('resultsList');
  var resultsList2 = document.getElementById('resultsList2');
  var resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  
  resultsList.innerHTML = '';
  resultsList2.innerHTML = '';
  resultsTableBody.innerHTML = '';
  
  if (!window.csvData) {
      alert('No CSV data available.');
      return;
  }

  // Search for approximate matches in ICS Code, Part Name, and other details
  var foundIndexes = [];
  for (var i = 0; i < window.csvData.length; i++) {
      var matchFound = false;
      // Check ICS Code, Part Name, and other details for approximate match
      if (window.csvData[i]['ICS Code'].toLowerCase().includes(searchInput) ||
          window.csvData[i]['Part Name'].toLowerCase().includes(searchInput)) {
          foundIndexes.push(i);
          matchFound = true;
      } else {
          // Check each property for approximate match
          for (var prop in window.csvData[i]) {
              if (window.csvData[i].hasOwnProperty(prop)) {
                  var value = window.csvData[i][prop].toString().toLowerCase();
                  // Perform approximate match check
                  if (value.includes(searchInput)) {
                      foundIndexes.push(i);
                      matchFound = true;
                      break; // Once a match is found, no need to check further
                  }
              }
          }
      }
  }

  if (foundIndexes.length > 0) {
      // Display unique ICS Code and Part Name
      var uniqueResults = {}; // To store unique ICS Code and Part Name
      foundIndexes.forEach(function(index) {
          var icsCode = window.csvData[index]['ICS Code'];
          var partName = window.csvData[index]['Part Name'];
          if (!uniqueResults[icsCode]) {
              var option = document.createElement('option');
              option.text = icsCode;
              resultsList.add(option);
              uniqueResults[icsCode] = true;
          }
          if (!uniqueResults[partName]) {
              var option2 = document.createElement('option');
              option2.text = partName;
              resultsList2.add(option2);
              uniqueResults[partName] = true;
          }
      });

      // Display all Program Names and Line Nos that match the criteria
      foundIndexes.forEach(function(index) {
          var row = resultsTableBody.insertRow();
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          cell1.textContent = window.csvData[index]['Program Name'];
          cell2.textContent = window.csvData[index]['Feeder Type'];
          cell3.textContent = window.csvData[index]['Machine No.'];
          cell4.textContent = window.csvData[index]['Line No.'];
      });

  } else {
      alert('No matching data found.');
  }
}