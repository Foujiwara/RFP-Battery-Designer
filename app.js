'use strict';

const {useState,useRef,useEffect,useCallback,useMemo,createElement:h}=React;

// ===== CONFIG =====
const C={
  bg:"#090d12",
  cell:"#00e676",
  grid:"#18242e",
  text:"#d8e8f0"
};

// ===== GÉNÉRATION SIMPLE =====
function generateCells(w,h,d,g){
  const cells=[];
  const pitch=d+g;
  for(let y=pitch/2;y<h;y+=pitch){
    for(let x=pitch/2;x<w;x+=pitch){
      cells.push({x,y});
    }
  }
  return cells;
}

// ===== APP =====
function App(){

  const [width,setWidth]=useState(120);
  const [height,setHeight]=useState(80);
  const [diameter,setDiameter]=useState(21.3);
  const [gap,setGap]=useState(0.5);

  const canvasRef=useRef(null);

  const cells=useMemo(()=>{
    return generateCells(width,height,diameter,gap);
  },[width,height,diameter,gap]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    ctx.fillStyle=C.bg;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const scale=3;

    // draw grid
    ctx.strokeStyle=C.grid;
    for(let x=0;x<canvas.width;x+=50){
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x,canvas.height);
      ctx.stroke();
    }

    for(let y=0;y<canvas.height;y+=50){
      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(canvas.width,y);
      ctx.stroke();
    }

    // draw cells
    ctx.fillStyle=C.cell;

    cells.forEach(c=>{
      ctx.beginPath();
      ctx.arc(c.x*scale+50,c.y*scale+50,(diameter/2)*scale,0,Math.PI*2);
      ctx.fill();
    });

  },[cells,width,height,diameter]);

  return h("div",{style:{display:"flex",height:"100%"}},

    // UI
    h("div",{style:{width:260,padding:10,background:"#0f1520"}},

      h("h2",null,"RFP Designer"),

      h("div",null,"Width"),
      h("input",{type:"number",value:width,onChange:e=>setWidth(+e.target.value)}),

      h("div",null,"Height"),
      h("input",{type:"number",value:height,onChange:e=>setHeight(+e.target.value)}),

      h("div",null,"Diameter"),
      h("input",{type:"number",value:diameter,onChange:e=>setDiameter(+e.target.value)}),

      h("div",null,"Gap"),
      h("input",{type:"number",value:gap,onChange:e=>setGap(+e.target.value)}),

      h("div",{style:{marginTop:10}},
        "Cells: "+cells.length
      )
    ),

    // Canvas
    h("canvas",{ref:canvasRef,style:{flex:1}})
  );
}

// ===== RENDER =====
window.addEventListener("load", function () {
  ReactDOM.createRoot(document.getElementById("root")).render(h(App,null));
});