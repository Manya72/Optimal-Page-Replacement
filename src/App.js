import React, { useState } from "react";
import './App.css';
import { Pie } from 'react-chartjs-2';
import {ArcElement,Chart} from 'chart.js'

Chart.register(ArcElement)


function OptimalPage() {
  const [pageReferences, setPageReferences] = useState([]);
  const [frames, setFrames] = useState(0);
  const [pageFaults, setPageFaults] = useState(0);
  const [hits, setHits] = useState(0);
  const [memoryState, setMemoryState] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableHeading, setTableHeading] = useState(false)
  const [pageFaultParagraph, setPageFaultParagraph] = useState(false)
  const [hitParagraph, setHitParagraph] = useState(false)
  const [, sethitMissStaus] = useState(0);


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
  const chartData = {
    labels: ['Hits', 'Misses'],
    datasets: [
      {
        data: 
        [hits, pageFaults],
        backgroundColor: ['#218a2c', '#eb3636'],
        hoverBackgroundColor: ['#218a2c', '#eb3636'],
      },
    ],
  };

  const simulateOptimalPageReplacement = () => {
   

    let newTableData = [];
    let pageFaults = 0;
    let hits = 0;
    let hitMissStatus= [] 
    let memoryState = Array(frames).fill(null);

    for (let i = 0; i < pageReferences.length; i++) {
      const page = pageReferences[i];
      if (!memoryState.includes(page)) {
        pageFaults++;
          hitMissStatus.push({ 
          Status: "Miss"
      }); 
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
      } else {
        hits++;
        hitMissStatus.push({ 
                Status: "Hit"
      }); 
      }
      newTableData.push({
        page: page,
        pageFault: pageFaults,
        hits: hits,
        memory: [...memoryState],
        newFrame: memoryState.indexOf(page),
        hitMissStatus: hitMissStatus[i]
      });
    }
    setPageFaults(pageFaults);
    setHits(hits);
    setMemoryState(memoryState);
    setTableData(newTableData);
    setTableHeading(true)
    setPageFaultParagraph(true)
    setHitParagraph(true)
    sethitMissStaus(true)
  };
  const hitRatio = ((hits / pageReferences.length).toFixed(2))*100;
  const missRatio = ((pageFaults / pageReferences.length).toFixed(2))*100;
 

return (
  <div className="optimal">
    <div>
      <h1 className="head">Optimal Page Replacement</h1>
      <label className="label1" htmlFor="pageReferences">Page Reference String:</label>
      <input type="text" id="pageReferences" value={pageReferences} onChange={handlePageReferencesChange} />
    </div>
    <br />
    <div>
      <label className="label2" htmlFor="frames">Number of Frames:</label>
      <input type="number" id="frames" min="1" defaultValue={1} onChange={handleFramesChange} />
    </div>
    <br />
    <button className="btn" id="button" onClick={simulateOptimalPageReplacement}>Simulate</button>

   {tableHeading &&
      <table className="table" id="myTable">
        <thead>
          <tr>
            <th>Page</th>
            {/* <th>New Frame</th> */}
            {memoryState.map((_frame, index) => (
              <th key={index}>Frame {index}</th>
            ))}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.page}</td>
               {/* <td>{row.newFrame}</td> */}
              {row.memory.map((frame, index) => (
              <td key={index} style={{ 
                color: row.newFrame === index ? "darkblue" : "black", 
                backgroundColor: row.hitMissStatus.Status === "Hit" 
                ? (row.newFrame === index ? "lightgreen" : "")
                : (row.newFrame === index ? "lightcoral" : "")
              }}>{frame }</td>
              ))}

               <td style={{ color: row.hitMissStatus.Status === "Hit" ? "Green" : "Red" }}>{row.hitMissStatus.Status}</td> 
            </tr>
          ))}
        </tbody>
      </table>}
      
      
    
    {pageFaultParagraph && <p className="faults">Page Faults: {pageFaults}</p>}
    {hitParagraph && <p className="faults">Hits: {hits}</p>}
  {pageFaultParagraph &&<p >Hit ratio {hitRatio} %</p>}
  {pageFaultParagraph &&<p >Miss ratio {missRatio} %</p>}
   
    <div className="chart-container"><Pie data={chartData} /></div>
    {pageFaultParagraph && <button className="btn" onClick={refreshPage}>Restart</button>}
    
  </div>
);
}

export default OptimalPage;