function circlePoint(circle,point) {
    if( dist(circle,point) < circle.r) {
		return true;
	} else {
        return false;
    }
}

function dist(point1,point2) {
    let one = (point2.x - point1.x);
    let two = (point2.y - point1.y);
    return Math.sqrt((one*one)+(two*two));
}