// Variables to store selected file and initial data
let selectedFile;
let data = [{ name: "mahesh" }];

// Event listener for file input change
document.getElementById("input").addEventListener("change", (event) => {
  selectedFile = event.target.files[0];
});

// Event listener for 'Convert' button
document.getElementById("convertButton").addEventListener("click", () => {
  // Conversion of JSON data to Excel sheet (Not sure if this is intended)
  XLSX.utils.json_to_sheet(data, "out.xlsx");

  // Reading and processing the selected Excel file
  if (selectedFile) {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "binary" });

      // Processing each sheet in the workbook
      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );

        // Displaying JSON data in the pre element
        document.getElementById("jsondata").innerHTML = JSON.stringify(
          rowObject,
          undefined,
          4
        );
      });
    };
  }
});


// Event listener for 'Copy JSON Data' button
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("copyButton").addEventListener("click", () => {
    const jsonText = document.getElementById("jsondata").textContent;
    if (jsonText.trim() === "") {
      alert("No JSON data available to copy.");
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = jsonText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("JSON data copied to clipboard!");
    }
  });
});

// Event listener for 'Download JSON' button
document
  .getElementById("downloadButton")
  .addEventListener("click", () => {
    const jsonText = document.getElementById("jsondata").textContent;
    if (jsonText.trim() !== "") {
      const blob = new Blob([jsonText], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      a.click();
      URL.revokeObjectURL(url);
      alert("JSON data downloaded!");
    } else {
      alert("No JSON data available to download.");
    }
  });
