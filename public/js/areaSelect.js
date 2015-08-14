(function($) {
	var areaObjects = [];

	function areaInit(container, options, styles) {
		options = options || {};
		styles = styles || {};

		styles.borderStyle = styles.borderStyle || 'solid';
		styles.borderWidth = styles.borderWidth || '1';
		styles.borderColor = styles.borderColor || 'rgb(100, 0, 0)';
		styles.backgroundColor = styles.backgroundColor || 'rgba(100, 0, 0, 0.1)';

		options.selectors = options.selectors || [];
		options.selectMethod = options.selectMethod || '';
		options.enterArea = options.enterArea || function() {};
		options.exitArea = options.exitArea || function() {};

		var nodeSelected = {};
		var initX = 0, initY = 0;
		var rectNode = null;
		var selectableElems = [];

		$(container).mousedown(onMouseDown);
		$(container).mousemove(onMouseMove);
		$(container).mouseup(onMouseUp);
		$(container).mouseleave(onMouseOut);

		areaObjects.push({
			node: container.get(0),
			handlers: {
				mousedown: onMouseDown,
				mousemove: onMouseMove,
				mouseup: onMouseUp,
				mouseout: onMouseOut
			}
		});

		function onMouseDown(e) {
			if (e.which !== 1) // 1 == left button
				return;

			selectableElems = container.find(options.selectors.join()).toArray(); 

			if (dotIsInAnyElement(e.pageX, e.pageY)) {
				return;
			}

			rectNode = createRectNode(styles);
			initX = e.pageX;
			initY = e.pageY + container.scrollTop();			

			// all nodes are out of area at start
			selectableElems.forEach(options.exitArea);

			e.preventDefault()
		}
		function onMouseMove(e) {
			if (! rectNode)
				return;

			drawRect(rectNode, initX, initY, e.pageX, e.pageY + container.scrollTop());

			var selectRect = rectangleCoords(initX, initY, e.pageX, e.pageY + container.scrollTop());
			callOnIntersect(selectRect);
		}
		function onMouseUp(e) {
			$(rectNode).remove();
			rectNode = null;
		}
		function onMouseOut(e) {
			onMouseUp(e);
		}
		function dotIsInAnyElement(x, y) {
			var scrollTop = container.scrollTop(),
				scrollBottom = scrollTop + window.innerHeight;

			var dotRect = rectangleCoords(x, y + scrollTop, x + 1, y + scrollTop + 1);

			for (var i = 0; i < selectableElems.length; ++i) {
				var $node = $(selectableElems[i]);
				var pos = $node.offset();

				pos.top += container.scrollTop();

				if (scrollTop <= pos.top && pos.top <= scrollBottom) {
					var width = $node.outerWidth();
					var height = $node.outerHeight();						

					var elementRect = rectangleCoords(pos.left, pos.top, pos.left + width, pos.top + height);

					if (rectsIntersect(dotRect, elementRect)) {
						return true;
					}
				}
			}

			return false;
		}
		function callOnIntersect(selectRect) {
			var scrollTop = container.scrollTop(),
				scrollBottom = scrollTop + window.innerHeight;

			selectableElems.forEach(function(node) {
				var $node = $(node);
				var pos = $node.offset();

				pos.top += scrollTop;

				var nodeInView = pos.top <= scrollBottom;
				var nodeInSelect = selectRect.y1 <= pos.top && pos.top <= selectRect.y2;

				if (nodeInView || nodeInSelect) {
					var width = $node.outerWidth();
					var height = $node.outerHeight();

					var elementRect = rectangleCoords(pos.left, pos.top, pos.left + width, pos.top + height);

					if (rectsIntersect(selectRect, elementRect)) {
						nodeSelected[node.id] = true;
						options.enterArea(node);
					}
					else if (nodeSelected[node.id]) {
						nodeSelected[node.id] = false;
						options.exitArea(node);
					}
				}
			});
		}

		function createRectNode(styles) {
			var rectNode = $('<div/>');
			rectNode.css({
				'position': 'fixed',
				'top': 0,
				'left': 0,
				'width': 0,
				'height': 0
			});
			rectNode.css(styles);

			$(container).append(rectNode);
			return rectNode.get(0);
		}

		function drawRect(node, x1, y1, x2, y2) {
			var rect = rectangleCoords(x1, y1, x2, y2);

			$(node).css({
				'top': rect.y1 - container.scrollTop(),
				'left': rect.x1,
				'width': rect.x2 - rect.x1,
				'height': rect.y2 - rect.y1
			});
		}		
	}

	function rectangleCoords(x1, y1, x2, y2) {
		var minX = Math.min(x1, x2),
			minY = Math.min(y1, y2),
			maxX = Math.max(x1, x2),
			maxY = Math.max(y1, y2);

		return {
			x1: minX,
			x2: maxX,
			y1: minY,
			y2: maxY
		};
	}

	function rectsIntersect(r1, r2) {
	  return ! (
	  	r2.x1 > r1.x2 || 
			r2.x2 < r1.x1 || 
			r2.y1 > r1.y2 ||
			r2.y2 < r1.y1);
	}

	$.fn.areaSelect = function(options, styles) {
		areaInit(this, options, styles);
	};

})(jQuery);