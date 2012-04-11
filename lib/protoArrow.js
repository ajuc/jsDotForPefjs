
ProtoArrow = function(){}

ProtoArrow.prototype.init_form_box_to_box = function(/*object*/from_box, /*objct*/ to_box){
	if (from_box.length < 4 && to_box.length < 4) {
		return false;
	}
	this.from_point = new Object();
	this.to_point = new Object();
	this.to_slope = null;
	this.from_slope = null;
	this.from_box = from_box;
	this.to_box = to_box;
	this.from_point.x = (this.from_box.right + this.from_box.left) / 2;
	this.from_point.y = (this.from_box.top + this.from_box.bottom) / 2;
	this.to_point.x = (this.to_box.right + this.to_box.left) / 2;
	this.to_point.y = (this.to_box.top + this.to_box.bottom) / 2;
	this.to_slope = (this.to_point.y - this.from_point.y) /
	(this.to_point.x - this.from_point.x);
	this.from_slope = (this.from_point.y - this.to_point.y) /
	(this.from_point.x - this.to_point.x);
}

ProtoArrow.prototype.init_from_box_to_point = function(/*object*/from_box, to_point_x, to_point_y){
	if (from_box.lenght < 4) {
		return false;
	}
	this.from_point = new Object();
	this.to_point = new Object();
	this.to_slope = null;
	this.from_slope = null;
	this.from_box = from_box;
	this.to_box = null;
	this.from_point.x = (this.from_box.right + this.from_box.left) / 2;
	this.from_point.y = (this.from_box.top + this.from_box.bottom) / 2;
	this.to_point.x = to_point_x;
	this.to_point.y = to_point_y;
	this.to_slope = (this.to_point.y - this.from_point.y) /
	(this.to_point.x - this.from_point.x);
	this.from_slope = (this.from_point.y - this.to_point.y) /
	(this.from_point.x - this.to_point.x);
}

ProtoArrow.prototype.init_from_point_to_box = function(from_point_x, from_point_y, /*object*/ to_box){
	if (to_box.lenght < 4) {
		return false;
	}
	this.from_point = new Object();
	this.to_point = new Object();
	this.to_slope = null;
	this.from_slope = null;
	this.to_box = to_box;
	this.from_box = null;
	this.from_point.x = from_point_x;
	this.from_point.y = from_point_y;
	this.to_point.x = (this.to_box.right + this.to_box.left) / 2;
	this.to_point.y = (this.to_box.top + this.to_box.bottom) / 2;
	this.to_slope = (this.to_point.y - this.from_point.y) /
	(this.to_point.x - this.from_point.x);
	this.from_slope = (this.from_point.y - this.to_point.y) /
	(this.from_point.x - this.to_point.x);
}

/**
* Computes the intersection of the line, going through the middle point of the 
* two boxes, and the to_box. 
* Can return null if the line does not intersect the toBox
* 
* @return the intersaction of such a line and the to_box
*/
ProtoArrow.prototype.get_to_intersaction_point = function(){
	var point = new Object();
	var delta_x = this.to_point.x - this.from_point.x;
	var delta_y = this.to_point.y - this.from_point.y;
	if (delta_x == 0) {
		point.x = this.to_point.x;
		if (this.to_box.top <= this.from_point.y) {
			point.y = this.to_box.top;
		}
		else {
			point.y = this.to_box.bottom;
		}
		return point;
	}
	else 
		if (delta_y == 0) {
			point.y = this.to_point.y;
			if (this.to_box.right <= this.from_point.x) {
				point.x = this.to_box.right;
			}
			else {
				point.x = this.to_box.left;
			}
			return point;
		}
		else {
			/*
		 * try x as left edge of the box
		 */
			var x = this.to_box.left;
			var y = this.get_to_y(x);
			if (this.is_in_to_box(x, y) &&
			Math.min(this.to_box.bottom, this.to_box.top) <= y &&
			y <= Math.max(this.to_box.bottom, this.to_box.top) &&
			(this.from_point.x <= this.to_box.left)) {
				point.x = x;
				point.y = y;
				return point
			}
			/*
		 * try x as right edge of the box
		 */
			var x = this.to_box.right;
			var y = this.get_to_y(x);
			if (this.is_in_to_box(x, y) &&
			Math.min(this.to_box.bottom, this.to_box.top) <= y &&
			y <= Math.max(this.to_box.bottom, this.to_box.top) &&
			(this.from_point.x >= this.to_box.right)) {
				point.x = x;
				point.y = y;
				return point
			}
			/*
		 * try y as top edge of the box
		 */
			var y = this.to_box.top;
			var x = this.get_to_x(y);
			if (this.is_in_to_box(x, y) &&
			Math.min(this.to_box.left, this.to_box.right) <= x &&
			x <= Math.max(this.to_box.left, this.to_box.right) &&
			(this.from_point.y >= this.to_box.top)) {
				point.x = x;
				point.y = y;
				return point
			}
			/*
		 * try y as bottom edge of the box
		 */
			var y = this.to_box.bottom;
			var x = this.get_to_x(y);
			if (this.is_in_to_box(x, y) &&
			Math.min(this.to_box.left, this.to_box.right) <= x &&
			x <= Math.max(this.to_box.left, this.to_box.right) &&
			(this.from_point.y <= this.to_box.bottom)) {
				point.x = x;
				point.y = y;
				return point
			}
			/*
		 * PROBLEM!!!
		 */
			return null;
		}
}

/**
* Computes the intersection of the line, going through the middle point of the 
* two boxes, and the to_box. 
* Can return null if the line does not intersect the from_Box
* 
* @return the intersaction of such a line and the from_box
*/
ProtoArrow.prototype.get_from_intersaction_point = function(){
	var point = new Object();
	var delta_x = this.from_point.x - this.to_point.x;
	var delta_y = this.from_point.y - this.to_point.y;
	if (delta_x == 0) {
		point.x = this.from_point.x;
		if (this.from_box.top <= this.to_point.y) {
			point.y = this.from_box.top;
		}
		else {
			point.y = this.from_box.bottom;
		}
		return point;
	}
	else 
		if (delta_y == 0) {
			point.y = this.from_point.y;
			if (this.from_box.right <= this.to_point.x) {
				point.x = this.from_box.right;
			}
			else {
				point.x = this.from_box.left;
			}
			return point;
		}
		else {
			/*
		 * try x as left edge of the box
		 */
			var x = this.from_box.left;
			var y = this.get_from_y(x);
			if (this.is_in_from_box(x, y) &&
			Math.min(this.from_box.bottom, this.from_box.top) <= y &&
			y <= Math.max(this.from_box.bottom, this.from_box.top) &&
			(this.to_point.x <= this.from_box.left)) {
				point.x = x;
				point.y = y;
				return point
			}
			/*
		 * try x as right edge of the box
		 */
			var x = this.from_box.right;
			var y = this.get_from_y(x);
			if (this.is_in_from_box(x, y) &&
			Math.min(this.from_box.bottom, this.from_box.top) <= y &&
			y <= Math.max(this.from_box.bottom, this.from_box.top) &&
			(this.to_point.x >= this.from_box.left)) {
				point.x = x;
				point.y = y;
				return point
			}
			/*
		 * try y as top edge of the box
		 */
			var y = this.from_box.top;
			var x = this.get_from_x(y);
			if (this.is_in_from_box(x, y) &&
			Math.min(this.from_box.left, this.from_box.right) <= x &&
			x <= Math.max(this.from_box.left, this.from_box.right) &&
			(this.to_point.y >= this.from_box.top)) {
				point.x = x;
				point.y = y;
				return point
			}
			/*
		 * try y as bottom edge of the box
		 */
			var y = this.from_box.bottom;
			var x = this.get_from_x(y);
			if (this.is_in_from_box(x, y) &&
			Math.min(this.from_box.left, this.from_box.right) <= x &&
			x <= Math.max(this.from_box.left, this.from_box.right) &&
			(this.to_point.y <= this.from_box.bottom)) {
				point.x = x;
				point.y = y;
				return point
			}
			/*
		 * PROBLEM!!!
		 */
			return null;
		}
}



ProtoArrow.prototype.get_to_y = function(x){
return (this.to_point.y + (x - this.to_point.x) * this.to_slope);
}

ProtoArrow.prototype.get_to_x = function(y){
return (this.to_point.x + (y - this.to_point.y) / this.to_slope);
}

ProtoArrow.prototype.get_from_y = function(x){
return (this.from_point.y + (x - this.from_point.x) * this.from_slope);
}

ProtoArrow.prototype.get_from_x = function(y){
return (this.from_point.x + (y - this.from_point.y) / this.from_slope);
}

ProtoArrow.prototype.is_in_to_box = function(x, y){
	if (this.to_box == null) {
		return false;
	}
	if (x >= this.to_box.left && x <= this.to_box.right &&
	y >= this.to_box.bottom &&
	y <= this.to_box.top) {
		return true;
	}
	return false;
}

ProtoArrow.prototype.is_in_from_box = function(x, y){
	if (this.from_box == null) {
		return false;
	}
	if (x >= this.from_box.left && x <= this.from_box.right &&
	y >= this.from_box.bottom &&
	y <= this.from_box.top) {
		return true;
	}
	return false;
}

