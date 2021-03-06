FinancialFreedom.service('GeometryService', function() {
    this.formatPoint = function(x, y) {
        return {
            x: x,
            y: y
        }
    };

    // point slope form: y - y1 = m(x - x1)
    this.formatLineData = function(x1, y1, m) {
        return {
            x: x1,
            y: y1,
            m: m
        };
    };

    this.calculateSlope = function(y1, y2, dx) {
        return (y2 - y1) / dx;
    };

    this.calculateIntersection = function(line1, line2) {
        var x = calculateXIntersection(line1, line2);
        var y = calculateYIntersection(line1, line2);

        return this.formatPoint(x, y);
    }

    calculateXIntersection = function(line1, line2) {
        return (line1.m * line1.x - line2.m * line2.x + line2.y - line1.y) / (line1.m - line2.m);
    };

    calculateYIntersection = function(line1, line2) {
        return (line1.m * line2.m * (line2.x - line1.x) + line1.y * line2.m - line2.y * line1.m) / (line2.m - line1.m);
    };    
});