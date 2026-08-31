var ProjectUtils = (function () {
    function ProjectUtils() {
    }
    ProjectUtils.init = function () {
        var _this_1 = this;
        stage.on(EventObject.MOUSE_WHEEL, this, function (e) { ProjectUtils.mouseWhileValue = e.delta; });
        stage.on(EventObject.MOUSE_MOVE, this, function (e) { ProjectUtils.lastControl = 0; });
        stage.on(EventObject.KEY_DOWN, this, function (e) { ProjectUtils.lastControl = ProjectUtils.fromGamePad ? 2 : 1; ProjectUtils.fromGamePad = false; _this_1.keyboardEvent = e; if (ArrayUtils.matchAttributes(_this_1.keyboardEvents, { keyCode: e.keyCode }, true).length == 0) {
            _this_1.keyboardEvents.push({ keyCode: e.keyCode });
        } });
        stage.on(EventObject.KEY_UP, this, function (e) { ArrayUtils.remove(_this_1.keyboardEvents, ArrayUtils.matchAttributes(_this_1.keyboardEvents, { keyCode: e.keyCode }, true)[0]); _this_1.keyboardEvent = null; });
    };
    ProjectUtils.takeoutRect = function () {
        return ProjectUtils.rectanglePool.takeout();
    };
    ProjectUtils.freeRect = function (rect) {
        ProjectUtils.rectanglePool.free(rect);
    };
    ProjectUtils.dateFormat = function (fmt, date) {
        var ret;
        var opt = {
            "Y+": date.getFullYear().toString(),
            "m+": (date.getMonth() + 1).toString(),
            "d+": date.getDate().toString(),
            "H+": date.getHours().toString(),
            "M+": date.getMinutes().toString(),
            "S+": date.getSeconds().toString()
        };
        for (var k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
            }
            ;
        }
        ;
        return fmt;
    };
    ProjectUtils.timerFormat = function (time) {
        var S = 1000;
        var M = S * 60;
        var H = M * 60;
        var hTotal = Math.floor(time / H);
        var hStr = MathUtils.fixIntDigit(hTotal, 2);
        time -= H * hTotal;
        var mTotal = Math.floor(time / M);
        var mStr = MathUtils.fixIntDigit(mTotal, 2);
        time -= M * mTotal;
        var sTotal = Math.floor(time / S);
        var sStr = MathUtils.fixIntDigit(sTotal, 2);
        return hStr + ":" + mStr + ":" + sStr;
    };
    ProjectUtils.groupElementsMoveIndex = function (groupElements, currentIndex, moveDir, limitSecondAxis) {
        if (limitSecondAxis === void 0) { limitSecondAxis = 50; }
        var currentElement = currentIndex == -1 ? { x: 0, y: 0 } : groupElements[currentIndex];
        var allowOris = {
            2: [1, 2, 3],
            4: [1, 4, 7],
            6: [3, 6, 9],
            8: [7, 8, 9]
        }[moveDir];
        if (!allowOris)
            return null;
        var secondAxisName = (moveDir == 4 || moveDir == 6) ? "y" : "x";
        var minDis = Number.MAX_VALUE;
        var minIndex = null;
        for (var i = 0; i < groupElements.length; i++) {
            var targetEle = groupElements[i];
            if (i == currentIndex)
                continue;
            var angle = MathUtils.direction360(currentElement.x, currentElement.y, targetEle.x, targetEle.y);
            var ori = GameUtils.getOriByAngle(angle);
            if (allowOris.indexOf(ori) == -1)
                continue;
            var secondAxisDistance = Math.abs(targetEle[secondAxisName] - currentElement[secondAxisName]);
            if (secondAxisDistance > limitSecondAxis)
                continue;
            var dis2 = Point.distanceSquare2(currentElement.x, currentElement.y, targetEle.x, targetEle.y);
            if (dis2 < minDis) {
                minDis = dis2;
                minIndex = i;
            }
        }
        return minIndex;
    };
    ProjectUtils.polygonsIntersectTest = function (polygon1, polygon2) {
        var result = false;
        var p1Len = polygon1.length;
        var p2Len = polygon2.length;
        for (var i = 0; i < p1Len; i++) {
            var p1 = polygon1[i];
            var p2 = polygon1[(i + 1) % p1Len];
            for (var j = 0; j < p2Len; j++) {
                var q1 = polygon2[j];
                var q2 = polygon2[(j + 1) % p2Len];
                if (this.isLinesIntersect(p1, p2, q1, q2)) {
                    result = true;
                    return result;
                }
            }
        }
        for (var i = 0; i < p1Len; i++) {
            var p1 = polygon1[i];
            if (this.isPointInsidePolygon(p1, polygon2)) {
                result = true;
                return result;
            }
        }
        for (var i = 0; i < p2Len; i++) {
            var p1 = polygon2[i];
            if (this.isPointInsidePolygon(p1, polygon1)) {
                result = true;
                return result;
            }
        }
        return result;
    };
    ProjectUtils.isLinesIntersect = function (p1, p2, q1, q2) {
        if (this.linesIntersectInfo(p1, p2, q1, q2)) {
            return true;
        }
        return false;
    };
    ProjectUtils.linesIntersectInfo = function (p1, p2, q1, q2, offsetY) {
        if (offsetY === void 0) { offsetY = 0; }
        var q11 = q1[1] + offsetY;
        var q21 = q2[1] + offsetY;
        var dx1 = p2[0] - p1[0];
        var dy1 = p2[1] - p1[1];
        var dx2 = q2[0] - q1[0];
        var dy2 = q21 - q11;
        var denominator = dx1 * dy2 - dy1 * dx2;
        if (denominator === 0) {
            return null;
        }
        var t1 = ((q1[0] - p1[0]) * dy2 - (q11 - p1[1]) * dx2) / denominator;
        var t2 = ((q1[0] - p1[0]) * dy1 - (q11 - p1[1]) * dx1) / denominator;
        var res = t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
        if (res) {
            return { p1Per: t1, p2Per: t2 };
        }
        return null;
    };
    ProjectUtils.isPointInsidePolygon = function (point, polygon) {
        var points = polygon;
        var inside = false;
        for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
            var intersect = ((points[i][1] > point[1]) != (points[j][1] > point[1]))
                && (point[0] < (points[j][0] - points[i][0]) * (point[1] - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0]);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    };
    ProjectUtils.mouseWhileValue = 0;
    ProjectUtils.callbackHelper = new Callback;
    ProjectUtils.pointHelper = new Point;
    ProjectUtils.rectangleHelper = new Rectangle;
    ProjectUtils.keyboardEvents = [];
    ProjectUtils.lastControl = 0;
    ProjectUtils.rectanglePool = new PoolUtils(Rectangle);
    return ProjectUtils;
}());
//# sourceMappingURL=ProjectUtils.js.map