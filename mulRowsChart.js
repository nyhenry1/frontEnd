/* add px after number */
// global variables    

var SVG_URL ="http://www.w3.org/2000/svg";
var CHART_ID = "chart"
var COLU_SCALE = 0.9;
var COLU_BORD_WIDTH = 5;
var COLU_TAG_SVG = "svg";
var COLU_IDARR = ["column0", "column1", "column2", "column3", "column4"];
var COLU_BORDER_COL = "blue";
var COLG_TAG_G = "g"; 
var COLG_IDARR = ["colGroup0", "colGroup1", "colGroup2", "colGroup3", "colGroup4"];
var COLG_MATRIX = 'matrix(0.9, 0, 0, 0.9, 0, 0)'; 
var CIR_TAG_CIR = "circle";
var CIR_IDARR = ["circle0", "circle1", "circle2", "circle3", "circle4"];
var CIR_CX = 10;
var CIR_CY = 10;
var CIR_R = 5;
var CIR_STRO_COL = "black";
var CIR_STAT_STRO_COL = "red";
var CIR_STRO_WIDTH = 3;
var CIR_FILL_COL = "red";
var LINE_TAG = "line";
var LINE_ID_PREF = "line";
var LINE_STROKE_COL = "red";
var LINE_STROKE_WIDTH = 1;
var DISPLAY_DISABLE = "none";
var DISPLAY_ENABLE = "block";
var DATEBAR_TAG = "text";
var DATEBAR_ID = "dateBar";
var DATE_FILL_COL = "red";
var DATEX_INI = -100;
var DATEX_INC = 130;
var DATE_YOFF = 430;
var CAPTION_TAG = "text";
var CAPTION_ID = "caption";
var CAPTION_TEXT = "endu chart";
var CAPTION_X = 0;
var CAPTION_Y = 0;
var CAPTION_MATRIX = 'matrix(0, -1.0, 1.0, 0, 10, 250)';
var CAPTION_FILL_COL = "green";
var INI_SHOWNUM = 7;
var BUTTON_TAG = "button";
var BUTBLO_BORDER_COL = "yellow";
var BUTBLO_ID = "butBlo";
var CONTENT_BOX = "content-box";
var TIP_TAG_SVG = "rect";
var TIP_IDARR = ["tooltip0", "tooltip1", "tooltip2", "tooltip3", "tooltip4"];
var TIP_HEIGHT = 50;
var TIP_WIDTH = 100;
var TIP_FILL_COL = "blue";
var TIP_FILL_ALPHA = 0.2;
var TIP_STROKE_WIDTH = 1;
var TIP_STROKE_COL = 'black';
var CURVAL_TAG_TEXT = "text";
var CURVAL_IDARR = ["curval0", "curval1", "curval2", "curval3", "curval4"];
var CURVAL_FILL_COL = 'black';
var DATA_XOFF = 40;
var DATA_YOFF = 30 - TIP_HEIGHT;
var DATEVAL_TAG = 'text';
var DATEVAL_TAG2 = 'text';
var DATEVAL_ID = 'dateval';
var DATE_XOFF = 20;
var DATE_YOFF = 16 - TIP_HEIGHT;
var COLUS_TAG = 'svg';
var COLUS_ID = 'columns';
var CIR_STAT_R = 2; 
var CIR_STAT_PREF = "ciPr";

function addPx(str)
{ return str + "px"; }

function makeIntoObj(stylePairs){
    var obj = {};
    var arr = stylePairs == null? []:stylePairs.split(";");
    for(var iter = 0; iter < arr.length; ++iter){
        var trimedItem = arr[iter].trim();
        var ind = arr[iter].indexOf(':');
        var property = arr[iter].substring(0, ind);
        var value = arr[iter].substring(ind + 1);
        obj[property.trim()] = value.trim();
    } 
    return obj;
}

function assignNewAttribute(obj, styleAttribs){
    for(styleProp in styleAttribs)
        obj[styleProp] = styleAttribs[styleProp]; 
    return obj;
}

function makeIntoStr(newObj){
    var str = "";
    for(var prop in newObj)
        str = str.concat(prop + ":" + newObj[prop] + ";");  
    return str;
}

function addAttribute(div, attr){
    var buttonFlag = div.tagName == "BUTTON";
    for(var prop in attr){
        if(prop.trim() != "style"){
            if(!(buttonFlag && prop == "innerHTML"))
                div.setAttribute(prop, attr[prop]);
            else
                div.innerHTML = attr[prop];
        }else{
            var stylePairs = div.getAttribute(prop, attr["style"]); 
            var obj = makeIntoObj(stylePairs);
            var newObj = assignNewAttribute(obj, attr["style"]);
            var newAttribStr = makeIntoStr(newObj); 
            div.setAttribute("style", newAttribStr);
        }
    }
} 

/* gen a line */

function genIndLine(iter, xPre, yPre, xCur, yCur){
    var line = document.createElementNS(SVG_URL, LINE_TAG);
    addAttribute(line, {id:LINE_ID_PREF + iter, x1:xPre, y1:yPre, x2:xCur, y2:yCur,
        stroke:LINE_STROKE_COL, 'stroke-width':LINE_STROKE_WIDTH, style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX}});        
    return line;
}

function genCircle(iter, xCur, yCur){
    var circle = document.createElementNS(SVG_URL, CIR_TAG_CIR);
    addAttribute(circle, {id:CIR_STAT_PREF + iter, cx:xCur, cy:yCur, r:CIR_STAT_R, stroke:CIR_STAT_STRO_COL, 'stroke-width': CIR_STRO_WIDTH, fill: CIR_FILL_COL, display: DISPLAY_ENABLE, style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX}});
    return circle;
}

function tuneXY(curX, curY, widthMax, heightMax){
    var obj = {};
    obj.newX = (curX + TIP_WIDTH < widthMax? curX: curX - TIP_WIDTH);
    obj.newY = (curY + TIP_HEIGHT < heightMax? curY: curY - TIP_HEIGHT);
    return obj;
}

/* imple columns add mousemove mouseenter and mouseleave event */ 

function impleColumns(curColu_id, curColg_id, colBloTop, colBloLeft, innerWidth, innerHeight, colBorderWidth, points, showNum, parentLeftOff, scaleLeftOff, scaleTopOff, scale){
            
    var column = document.getElementById(curColu_id), 
        colGroup = document.getElementById(curColg_id),
        pointLen = points[1].length,
        maxHeight = 0,
        minHeight = 0,
        showPointNum = Math.min(pointLen, showNum);

    for(iter = pointLen - showPointNum; iter < pointLen; ++iter)
        maxHeight = Math.max(points[1][iter], maxHeight);  

    var widthUnit = innerWidth/(showPointNum - 1);
    var heightUnit = innerHeight/(maxHeight - minHeight);

    // store some values 
    column.points = points;
    column.widthUnit = widthUnit;
    column.heightUnit = heightUnit;
    column.maxHeight = maxHeight;
    column.innerWidth = innerWidth;
    column.innerHeight = innerHeight;
    column.parentLeftOff = parentLeftOff;
    column.scale = scale;
    column.showPointNum = showPointNum;
    colGroup.scaleLeftOff = scaleLeftOff;
    colGroup.scaleTopOff = scaleTopOff;

    column.addEventListener("mousemove", function colOnMouseOver(event){
        var colGroArr = [], columnArr =[], circleArr = [], tooltipArr = [], curValArr = [];
        var dataSetNum = 4; 

        for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
            colGroArr.push(document.getElementById(COLG_IDARR[dataSetI]));
            columnArr.push(document.getElementById(COLU_IDARR[dataSetI]));
            circleArr.push(document.getElementById(CIR_IDARR[dataSetI]));
            tooltipArr.push(document.getElementById(TIP_IDARR[dataSetI]));
            curValArr.push(document.getElementById(CURVAL_IDARR[dataSetI]));
        }

        var dateVal = document.getElementById(DATEVAL_ID);
        var pointI = Math.round((event.clientX - (columnArr[0].parentLeftOff + colGroArr[0].scaleLeftOff))/(columnArr[0].widthUnit * columnArr[0].scale)); 
        pointI =Math.min(Math.max(0, pointI), columnArr[0].showPointNum - 1);  
        var newCx = (pointI * columnArr[0].widthUnit) * columnArr[0].scale + colGroArr[0].scaleLeftOff; 
        var indexI = pointI + columnArr[0].points[1].length - columnArr[0].showPointNum;

        var newCyArr = []; 

        for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
            newCyArr.push(((columnArr[dataSetI].maxHeight - columnArr[dataSetI].points[1][indexI]) * columnArr[dataSetI].heightUnit) * columnArr[dataSetI].scale + colGroArr[dataSetI].scaleTopOff); 
            addAttribute(circleArr[dataSetI], {cx: newCx, cy:newCyArr[dataSetI]});
            
            var tune = tuneXY(newCx, newCyArr[dataSetI], columnArr[dataSetI].innerWidth, columnArr[dataSetI].innerHeight);

            addAttribute(tooltipArr[dataSetI], {x: tune.newX, y:tune.newY});
            addAttribute(curValArr[dataSetI], {x:tune.newX + DATA_XOFF, y:tune.newY - DATA_YOFF});
            curValArr[dataSetI].innerHTML = columnArr[dataSetI].points[1][indexI];
        }
        var tune = tuneXY(newCx, newCyArr[0], columnArr[0].innerWidth, columnArr[0].innerHeight);
        addAttribute(dateVal, {x:tune.newX + DATE_XOFF, y: tune.newY - DATE_YOFF});
        dateVal.innerHTML = columnArr[0].points[0][indexI];
    });
            
    column.addEventListener("mouseenter", function colOnMouseEnter(event){
        var dataSetNum = 4;
        for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
            document.getElementById(CIR_IDARR[dataSetI]).style.display = DISPLAY_ENABLE;
            document.getElementById(TIP_IDARR[dataSetI]).style.display = DISPLAY_ENABLE;
            document.getElementById(CURVAL_IDARR[dataSetI]).style.display = DISPLAY_ENABLE;
        }
        document.getElementById(DATEVAL_ID).style.display = DISPLAY_ENABLE;
    });

    column.addEventListener("mouseleave", function colOnMouseLeave(event){
        var dataSetNum = 4; 
        for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
            document.getElementById(CIR_IDARR[dataSetI]).style.display = DISPLAY_DISABLE;
            document.getElementById(TIP_IDARR[dataSetI]).style.display = DISPLAY_DISABLE;
            document.getElementById(CURVAL_IDARR[dataSetI]).style.display = DISPLAY_DISABLE;
        }
        document.getElementById(DATEVAL_ID).style.display = DISPLAY_DISABLE;
    });
            
    
    var xPre = 0, xCur, yPre = (maxHeight - points[1][pointLen - showPointNum]) * heightUnit, yCur;
    colGroup.appendChild(genCircle(0, xPre + scaleLeftOff, yPre + scaleTopOff));
    for(iter = pointLen - showPointNum + 1; iter < pointLen; ++iter){
        xCur = (iter - pointLen + showPointNum) * widthUnit;
        yCur = (maxHeight - points[1][iter]) * heightUnit;

        colGroup.appendChild(genIndLine(iter + 1, xPre + scaleLeftOff , yPre + scaleTopOff , xCur + scaleLeftOff, yCur + scaleTopOff));
        
        colGroup.appendChild(genCircle(iter + 1, xCur + scaleLeftOff, yCur + scaleTopOff));

        xPre = xCur;
        yPre = yCur;
    }

    var dateArr =[];
    var dateXOff = DATEX_INI;
    for(iter = 0; iter < 7; ++ iter){
        var dateBar = document.createElementNS(SVG_URL, DATEBAR_TAG); 
        dateArr.push(dateBar); 
        dateXOff += DATEX_INC;
        addAttribute(dateArr[iter], {id:DATEBAR_ID, x:dateXOff, y:DATE_YOFF, fill:DATE_FILL_COL, innerHTML:points[0][iter], style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX}});
        colGroup.appendChild(dateArr[iter]);
    } 

    var caption = document.createElementNS(SVG_URL, CAPTION_TAG);
    addAttribute(caption, {id:CAPTION_ID, transform:CAPTION_MATRIX, x:CAPTION_X, y:CAPTION_Y, fill:CAPTION_FILL_COL, innerHTML:CAPTION_TEXT, style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX}});
    colGroup.appendChild(caption);
}

/* create a svg element inside chart with tagname svg id columns
*/

function createColumns(colBloTop, colBloLeft, colBloWidth, colBloHeight, colBorderWidth, points, showNum, parentLeftOff, scale){
    var chart = document.getElementById(CHART_ID);
    var columns = document.createElementNS(SVG_URL, COLUS_TAG);

    var columnArr = [], mouseOverBgArr = [], colGroupArr = [];
    var dataSetNum = 4;
    var colsBorderWidth = colBorderWidth;
    var innerWidth = colBloWidth - colBorderWidth * 2,
        innerHeight = (colBloHeight - colsBorderWidth * 2)/dataSetNum;
    var bgColor = ['pink', 'green', 'orange', 'purple'];

    var pointsArr = [];
    for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
        pointsArr[dataSetI] = [];
        pointsArr[dataSetI][0] = [];
        pointsArr[dataSetI][1] = [];    
        for(var iter = 0; iter < points[0].length; ++ iter){
            pointsArr[dataSetI][0].push(points[0][iter]);
            pointsArr[dataSetI][1].push(points[dataSetI + 1][iter]);
        }
    }

    addAttribute(columns, {id:COLUS_ID, width:innerWidth, height:colBloHeight - colsBorderWidth * 2,style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX,border:colBorderWidth + "px solid " + COLU_BORDER_COL}}); 
    clearChart();
    chart.appendChild(columns);
    clearColumns();

    for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
        columnArr[dataSetI] = document.createElementNS(SVG_URL, COLU_TAG_SVG);
        addAttribute(columnArr[dataSetI], {id:COLU_IDARR[dataSetI], x:0, y:innerHeight * dataSetI, viewBox:'0 0 '+innerWidth+' '+innerHeight, width:innerWidth, height:innerHeight, style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX, fill:'green', border:colBorderWidth + "px solid " + COLU_BORDER_COL}});
        columns.appendChild(columnArr[dataSetI]);
        mouseOverBgArr.push(document.createElementNS(SVG_URL, "rect"));
        addAttribute(mouseOverBgArr[dataSetI], {width:innerWidth, height:innerHeight, style:{fill:bgColor[dataSetI], 'fill-opacity': TIP_FILL_ALPHA}});
        columnArr[dataSetI].appendChild(mouseOverBgArr[dataSetI]);
        colGroupArr.push(document.createElementNS(SVG_URL, COLG_TAG_G));
        addAttribute(colGroupArr[dataSetI], {id:COLG_IDARR[dataSetI], transform:COLG_MATRIX, style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX}});
        columnArr[dataSetI].appendChild(colGroupArr[dataSetI]);
        clearColGroup(COLG_IDARR[dataSetI]);
        impleColumns(COLU_IDARR[dataSetI], COLG_IDARR[dataSetI], colBloTop + innerHeight * dataSetI, colBloLeft, innerWidth, innerHeight, colBorderWidth, pointsArr[dataSetI], showNum, parentLeftOff + colBorderWidth, innerWidth * (1 - scale) / 2, innerHeight * (1 - scale) / 2, scale);
    }
}

function createTimeBut(butTop, butLeft, butWidth, butHeight, text, showDayNumVal){
    var button = document.createElement(BUTTON_TAG);    
    addAttribute(button, {innerHTML:text, style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX,position:"absolute", top:addPx(butTop), left:addPx(butLeft), height:butHeight}});
    button.showDayNum = showDayNumVal;
    return button;
}

/* create buttonblock
*/

function createButtons(butBloTop, butBloLeft, butBloWidth, butBloHeight, butBorderWidth, colBloTop, colBloLeft, colBloWidth, colBloHeight, points){
    var butBlock = document.createElement(BUTBLO_ID);
    addAttribute(butBlock, {style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX, position:'absolute', top:addPx(butBloTop), left:addPx(butBloLeft), width: addPx(butBloWidth - 2 * butBorderWidth), height:addPx(butBloHeight - 2 * butBorderWidth), border: butBorderWidth + "px solid " + BUTBLO_BORDER_COL}});

    var chart = document.getElementById(CHART_ID);

    chart.appendChild(butBlock);
                
    var butName = ["week", "one month", "three month", "one year", "max"];
    var showDayArr = [7, 30, 90, 365, 3650]; 
    var butArr = [];

    var dataSetNum = 4;
            
    for(butI = 0; butI < 5; ++butI){
        butArr.push(createTimeBut(0, 130 * butI, 30, 20, butName[butI], showDayArr[butI]));
        butArr[butI].addEventListener("click", function onClick(){
            var pointsArr = [];
            for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
                pointsArr[dataSetI] = [];
                pointsArr[dataSetI][0] = [];
                pointsArr[dataSetI][1] = [];    
                for(var iter = 0; iter < points[0].length; ++ iter){
                    pointsArr[dataSetI][0].push(points[0][iter]);
                    pointsArr[dataSetI][1].push(points[dataSetI + 1][iter]);
                }
            }
            var columnArr = [], colGroupArr = [];
            for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
                clearColGroup(COLG_IDARR[dataSetI]);
                columnArr[dataSetI] = document.getElementById(COLU_IDARR[dataSetI]);
                colGroupArr[dataSetI] = document.getElementById(COLG_IDARR[dataSetI]);
                impleColumns(COLU_IDARR[dataSetI], COLG_IDARR[dataSetI], colBloTop + colBloWidth * dataSetI, colBloLeft, colBloWidth, colBloHeight/dataSetNum, 5, pointsArr[dataSetI], this.showDayNum, columnArr[dataSetI].parentLeftOff, colGroupArr[dataSetI].scaleLeftOff, colGroupArr[dataSetI].scaleTopOff, columnArr[dataSetI].scale); 
            }
        });
        butBlock.appendChild(butArr[butI]);
    }
}

/* 
    to implement the inner part of a chart 
    with columns part on the top and buttons part at bottom
    charWidth is the total width of the chart box
    chart.style.width is the inner content width
*/
            
function createCircle(cirConTop, cirConLeft, cirConWidth, cirConHeight){
    var dataSetNum = 4;
    var circleArr = [], columnArr = [], tooltipArr = [], curValArr = [];

    for(var dataSetI = 0; dataSetI < dataSetNum; ++ dataSetI){
        circleArr.push(document.createElementNS(SVG_URL, CIR_TAG_CIR));
        columnArr.push(document.getElementById(COLU_IDARR[dataSetI]));
        addAttribute(circleArr[dataSetI], {id:CIR_IDARR[dataSetI], cx:CIR_CX, cy:CIR_CY, r:CIR_R, stroke:CIR_STRO_COL, 'stroke-width': CIR_STRO_WIDTH, fill: CIR_FILL_COL, display: DISPLAY_DISABLE, style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX}}); 
        columnArr[dataSetI].appendChild(circleArr[dataSetI]);
        tooltipArr[dataSetI] = document.createElementNS(SVG_URL, TIP_TAG_SVG);

        addAttribute(tooltipArr[dataSetI], {id:TIP_IDARR[dataSetI], x:CIR_CX, y:CIR_CY, width:TIP_WIDTH, height:TIP_HEIGHT, display:DISPLAY_DISABLE, style:{fill:TIP_FILL_COL, "fill-opacity":TIP_FILL_ALPHA, "stroke-width":TIP_STROKE_WIDTH, stroke:TIP_STROKE_COL}});

        columnArr[dataSetI].appendChild(tooltipArr[dataSetI]);
        curValArr[dataSetI] = document.createElementNS(SVG_URL, CURVAL_TAG_TEXT);
        addAttribute(curValArr[dataSetI], {id:CURVAL_IDARR[dataSetI], x:(CIR_CX + DATA_XOFF), y:(CIR_CY - DATA_YOFF), fill:CURVAL_FILL_COL, display:DISPLAY_DISABLE});
        columnArr[dataSetI].appendChild(curValArr[dataSetI]);
    }

    var dateVal = document.createElementNS(SVG_URL, DATEVAL_TAG);
    addAttribute(dateVal, {id:DATEVAL_ID, x:(CIR_CX + DATE_XOFF), y:(CIR_CY - DATE_YOFF), fill:CURVAL_FILL_COL, display:DISPLAY_DISABLE}); 
    columnArr[0].appendChild(dateVal);
    
    // need tune with clientWidth and clientHeight
}

// chart:div:chart:false     variable:tagname:id:issvg
// column1:svg:column1:true
// column2:svg:column2:true
// colGroup:g:colGroup:true
// colGroup2:g:colGroup2:true
// circle:circle:circle:true
// circle2:circle:circle2:true
// dateBar:text:dateBar
// line:line:line + iter:true
// button:button:?:false
// butBlock:butBlo:?:false
// tooltip:rect:tooltip
// curVal:text:curVal
// dateVal:text:dateVal

function impleChart(charTop, charLeft, charWidth, charHeight, charBorderWidth, charBorderColor, points, parentLeftOff){
    var chart = document.getElementById(CHART_ID),
        innerWidth = charWidth - charBorderWidth * 2,
        innerHeight = charHeight - charBorderWidth * 2;
    addAttribute(chart, {style:{'-webkit-box-sizing':CONTENT_BOX, '-moz-box-sizing':CONTENT_BOX, 'box-sizing':CONTENT_BOX, position:'absolute', top:addPx(charTop), left:addPx(charLeft), width:addPx(innerWidth), height:addPx(innerHeight), border:charBorderWidth + "px solid " + charBorderColor}});

    var colBloHeight = innerHeight *  COLU_SCALE, butBloHeight = innerHeight * (1 - COLU_SCALE);
    createColumns(0, 0, innerWidth, colBloHeight, COLU_BORD_WIDTH, points, INI_SHOWNUM, parentLeftOff + charLeft + charBorderWidth, COLU_SCALE);
    createCircle(0, 0, innerWidth, colBloHeight);
    createButtons(colBloHeight, 0, innerWidth, butBloHeight, COLU_BORD_WIDTH, 0,  0, innerWidth, colBloHeight, points);
}

/*
    delete child "line" elements of svg
*/ 

function clearColGroup(curColGroupId){
    var colGroup = document.getElementById(curColGroupId);
    for(iter = colGroup.childElementCount - 1; iter > -1; --iter){
        var child = colGroup.childNodes[iter];
        var childSubStr = child.id.substring(0, 4);
        if (childSubStr === LINE_ID_PREF || childSubStr === CIR_STAT_PREF)
            colGroup.removeChild(child);
    }
}

function clearColumns(){
    var columns = document.getElementById(COLUS_ID);
    for(iter = columns.childElementCount - 1; iter > -1; --iter){
        var child = columns.childNodes[iter];
        if(child.id.substring(0, 6) === "column")
            columns.removeChild(child);
    }
}

function clearChart(){
    var chart = document.getElementById(CHART_ID);
    for(iter = chart.childElementCount -1; iter > -1; --iter){
        var child = chart.childNodes[iter];
        if(child.id === COLUS_ID || child.id === BUTBLO_ID)
            chart.removeChild(child);
    }    
}
