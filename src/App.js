import React, { useState } from "react";
import './App.css';



  
function OptimalPage() {
  const [pageReferences, setPageReferences] = useState([]);
  const [frames, setFrames] = useState(0);
  const [pageFaults, setPageFaults] = useState(0);
  const [memoryState, setMemoryState] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableHeading, setTableHeading] = useState(false)
  const [pageFaultParagraph, setPageFaultParagraph] = useState(false)
  
  const handlePageReferencesChange = (event) => {
    const references = event.target.value
      .split("")

      .map((reference) => parseInt(reference.trim()))
      .filter((reference) => !isNaN(reference));
    setPageReferences(references);
  };
 
  const refreshPage = ()=>{
    window.location.reload();
 }
  const handleFramesChange = (event) => {
    const frames = parseInt(event.target.value);
 
    setFrames(frames);
    setMemoryState(Array(frames).fill(null));
   
  };

  const simulateOptimalPageReplacement = () => {

    let newTableData = [];
    let pageFaults = 0;
    let memoryState = Array(frames).fill(null);

    for (let i = 0; i < pageReferences.length; i++) {
      const page = pageReferences[i];
      if (!memoryState.includes(page)) {
        pageFaults++;
        if (memoryState.includes(null)) {
          const index = memoryState.indexOf(null);
          memoryState[index] = page;
        } else {
          let distances = memoryState.map((frame) => {
            const remainingPages = pageReferences.slice(i + 1);
            const nextIndex = remainingPages.indexOf(frame);
            return nextIndex === -1 ? Infinity : nextIndex;
          });
          const index = distances.indexOf(Math.max(...distances));
          memoryState[index] = page;
        }
      }
      newTableData.push({
        page: page,
        pageFault: pageFaults,
        memory: [...memoryState],
      });
    }
    setPageFaults(pageFaults);
    setMemoryState(memoryState);
    setTableData(newTableData);
    setTableHeading(true)
    setPageFaultParagraph(true)
  };

  return (
    <div className="optimal" >
      
      
      <div >
    
      <h1 className="head" >Optimal Page Replacement</h1>
      
        <label className="label1" htmlFor="pageReferences"  >Page Reference String:</label>
        <input type="text" id="pageReferences" value={pageReferences} onChange={handlePageReferencesChange} />
      </div>
      <br/>
      <div >
        <label className="label2" htmlFor="frames" >Number of Frames:</label>
        <input type="number" id="frames" min="1" defaultValue={1} onChange={handleFramesChange} />
        
      </div>
      
      <br/>
      <button className="btn" id="button" onClick={simulateOptimalPageReplacement}>Calculate</button>
 
     
      
      {tableHeading && 
      <table className="table" id="myTable">
        <thead>
          <tr>
          <th>Page   </th>
            {/* <th>Faults</th> */}
            {memoryState.map((frame, index) => (
              <th key={index}>Frame {index}</th>
            ))}
          </tr>
        </thead>
        <tbody>

          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.page}</td>
              {/* <td>{row.pageFault}</td> */}
              {row.memory.map((frame, index) => (
                <td key={index}>{frame }</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>}
      {pageFaultParagraph && <p className="faults" >Page Faults: {pageFaults}</p>}

      {pageFaultParagraph && <button className="btn" onClick={refreshPage}>Restart</button>
}
    </div>
  );

  }

export default OptimalPage;
