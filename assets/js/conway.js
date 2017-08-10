(function() {

    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const cells = [];

    // resize canvas to parent width and height
    window.addEventListener('resize', function(){
        // canvas.style.height = '40%';
        // canvas.style.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        // redraw dead cells
        cells.forEach(cell => {
            ctx.fillStyle = cellColors.get("spawn");
            ctx.fillRect(cell.get("x"), cell.get("y"), cellSize, cellSize);
        });

    }, false);
    window.dispatchEvent(new Event('resize'));

    const cellSize = 4;
    const cellMargin = 2;
    const cellsPerLine = canvas.width / (cellSize + cellMargin) >> 0;
    const cellsPerColumn = canvas.height / (cellSize + cellMargin) >> 0;

    // Get click position and spawn a few cells into life
    canvas.addEventListener('click', getPosition, false);
    function getPosition(event) {
        var x = event.x;
        var y = event.y;

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop - window.scrollY;

        x = x / (cellSize + cellMargin) >> 0;
        y = y / (cellSize + cellMargin) >> 0;
        i = x + y * cellsPerLine;

        cell = cells[i];
        cell.set("isAlive", true);
        cell.get("neighbors").forEach((cell, i) => {
            cell.set("isAlive", true);
        });
    }

    // Cell colors
    const cellColors = new Map();
    cellColors.set("spawn", "rgb(245, 247, 249)");
    cellColors.set("dead", ["rgb(235, 237, 239)"]);
    cellColors.set("alive", [
        // blueish palette
        '#5E8AC4',
        '#98C1D9',
        '#4F9AEF',
        '#0BB8ED'
    ]);

    const randomColor = (array) => {
        let key  = Math.floor(Math.random() * array.length);
        return array[key];
    }

    // Populate cells with dead cells
    for (var row = 0; row < cellsPerColumn; row++) {
        const y = row * (cellSize + cellMargin);
        for (var col = 0; col < cellsPerLine; col++) {
            const cell = new Map();
            cell.set("x", col * (cellSize + cellMargin));
            cell.set("y", y);
            cell.set("isAlive", false);
            cell.set("willLive", false);
            cells.push(cell);
            ctx.fillStyle = cellColors.get("spawn");
            ctx.fillRect(cell.get("x"), cell.get("y"), cellSize, cellSize);
        }
    }

    cells.forEach((cell, i) => {
        const neighbors = [];
        const isNotInFirstLine = i + 1 > cellsPerLine;
        const isNotInLastLine = i < cells.length - cellsPerLine;
        const isNotFirstInLine = i % cellsPerLine > 0;
        const isNotLastInLine = (i + 1) % cellsPerLine > 0;

        // top
        if (isNotInFirstLine) {
            if (isNotFirstInLine) neighbors.push(cells[i - cellsPerLine - 1]);
            neighbors.push(cells[i - cellsPerLine]);
            if (isNotLastInLine) neighbors.push(cells[i - cellsPerLine + 1]);
        }

        // middle
        if (isNotFirstInLine) neighbors.push(cells[i - 1]);
        if (isNotLastInLine) neighbors.push(cells[i + 1]);

        // bottom
        if (isNotInLastLine) {
            if (isNotFirstInLine) neighbors.push(cells[i + cellsPerLine - 1]);
            neighbors.push(cells[i + cellsPerLine]);
            if (isNotLastInLine) neighbors.push(cells[i + cellsPerLine + 1]);
        }
        cell.set("neighbors", neighbors);
    });

    const anim = () => {
        // define
        cells.forEach(cell => {
            const livingNeighbors = cell.get("neighbors").filter(el =>
                el.get("isAlive")).length;
            // A live cell with 2 or 3 live neighbors stays alive
            // A dead cell with 3 live neighbors becomes a live cell
            cell.set("willLive",
                cell.get("isAlive") ?
                livingNeighbors > 1 && livingNeighbors < 4 :
                livingNeighbors == 3
            );
        });

        // draw
        cells.forEach(cell => {
            if (cell.get("isAlive") == cell.get("willLive")) return;
            cell.set("isAlive", cell.get("willLive"));
            ctx.fillStyle = randomColor(cellColors.get(
                cell.get("isAlive") ? "alive" : "dead"
            ));
            ctx.fillRect(cell.get("x"), cell.get("y"), cellSize, cellSize);
        });

        // repeat
        setTimeout(() => requestAnimationFrame(anim), 50);
    };


    const randomInt = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    for (var i = 0; i < 2000; i++) {
        const cell = cells[randomInt(0, cells.length - 1)];
        cell.set("isAlive", true);

        /*
            No need to draw random elements, most of them
            will be dead on the next frame.
            ctx.fillStyle = randomColor(cellColors.get("alive"));
            ctx.fillRect(cell.get("x"), cell.get("y"), cellSize, cellSize);
        */

    }

    requestAnimationFrame(anim);

})();
