import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { data, totalTrackLength } from "./sampleData";
import "./styles.css";

// assume all data is valid and sorted by start time
const TimelineSegments = ({ data, totalTrackLength }) => {

  const [result, setResult] = useState([]);
  const [defaultRow] = useState({ start: 0, end: 0 })

  useEffect(() => {
    data.sort((pre, next) => { return pre.start - next.start || pre.end - next.end })
    groupTimeLineSegs();
  }, [])

  const groupTimeLineSegs = () => {
    let timeLines = [];
    let rootTimeLine = data.shift();
    let level = 0;
    timeLines.push([rootTimeLine]);

    while (data.length > 0) {
      let currentTimeLine = data.shift();
      if (isOverlap(currentTimeLine, rootTimeLine)) {
        level = level + 1;
        addGroup(timeLines, currentTimeLine, level)
      } else {
        level = 0;
        rootTimeLine = currentTimeLine;;
        timeLines[level].push(currentTimeLine);
      }
    }
    setResult(timeLines)
  }

  const addGroup = (data, currentTimeLine, level) => {
    let timeLines = data[level] = data[level] || [];
    if (timeLines.length > 0) {
      let node = timeLines[timeLines.length - 1];
      if (isOverlap(currentTimeLine, node)) {
        level = level + 1;
        addGroup(data, currentTimeLine, level)
        return;
      }
    }
    timeLines.push(currentTimeLine);
  }
  const isOverlap = (currentTimeLine, targetTimeLine) => {
    return currentTimeLine.start >= targetTimeLine.start && currentTimeLine.start <= targetTimeLine.end
  }
  
  const renderTimeLineSegments = () => {
    return result.map((row, idx) => {
      return (
        <div className="row" key={"row_" + idx}>
          {row.map((col, idx) => {
            let preCol = row[idx - 1] || defaultRow;
            let style = { width: col.end - col.start, marginLeft: col.start - preCol.end }
            return (
              <div className="segment" style={style}>
                <span>{col.start}</span>
                <span>{col.end}</span>
              </div>
            )
          })}
        </div>
      )
    })
  }
  return (
    <div className="container">
      {renderTimeLineSegments()}
    </div>
  )
};

// boilerplate
ReactDOM.render(
  <TimelineSegments data={data} totalTrackLength={totalTrackLength} />,
  document.getElementById("root")
);
