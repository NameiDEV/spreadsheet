const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L'];
const exportBtn = document.querySelector('#export-btn');


function iniSpreadsheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        


        for (let j = 0; j < COLS; j++) {
            let celldata = '';
            let isHeader = false;
            let disabled = false;

            if (j === 0) {
                celldata = i;
                isHeader = true;
                disabled = true;
                
            }
            if ( i === 0) {
                celldata = alphabet[j-1];
                isHeader = true;
                disabled = true;
            }
            if (celldata <=0) {
                celldata = '';
            }
            if (!celldata) {
                celldata = ''
                        }
            const rowname = i;
            const columnname = alphabet[j-1];
                                
            
            const cell = new Cell(isHeader, disabled, celldata, i, j,rowname ,columnname ,false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    
}

class Cell {
    constructor(isHeader, disabled, data, row, column,rowname,columnname, active){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.active = active; 
        this.rowname = rowname;
        this.columnname = columnname;
        
    }
}


exportBtn.onclick = function(e) {
   
    let csv = '';
    for (let i = 0; i < spreadsheet.length; i++) {
            if (i === 0) {
                continue;
            }

        csv +=
            spreadsheet[i]
            .filter((item) => !item.isHeader)
            .map((item) => item.data)
            .join(',')  + '\r\n';
    }
    console.log(csv);

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csv url:', csvUrl);

    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
}

function createCell(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add('header');
    }
    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleCellChange(e.target.value,cell);

    return cellEl;
}

function handleCellChange(data, cell) {
    cell.data = data;
    
}

function handleCellClick(cell) {
    clearheaderActive();
    const columnheader = spreadsheet[0][cell.column];
    const rowheader = spreadsheet[cell.row][0];
    const columHeaderEl = getElFromrowcol(columnheader.row, columnheader.column);
    const rowHeaderEl = getElFromrowcol(rowheader.row, rowheader.column);

    columHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');

    // console.log('Clicked cell:',rowHeaderEl,columHeaderEl );

    document.querySelector('#cell-status').innerHTML = cell.columnname + cell.rowname;
}

function clearheaderActive() {
    const hearders = document.querySelectorAll('.header');

    hearders.forEach((header) => {
        header.classList.remove('active');
    })
}



function getElFromrowcol(row, col) {
    return document.querySelector('#cell_' + row + col);
}
function drawSheet() {
    for(let i = 0; i < spreadsheet.length; i++)  {
        
        const rowContainer = document.createElement('div')
        rowContainer.className = 'row';
        for(let j=0; j <spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainer.append(createCell(cell));
        }
        spreadSheetContainer.append(rowContainer);
    }
}    
iniSpreadsheet();
