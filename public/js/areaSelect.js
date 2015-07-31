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

			rectNode = createRectNode(styles);
			initX = e.pageX;
			initY = e.pageY;

			// all nodes are out of area at start
			options.selectors.forEach(function(selector) {
				container.find(selector).toArray().forEach(options.exitArea);
			});

			var pointRect = rectangleCoords(initX, initY, initX + 1, initY + 1);
			callOnIntersect(options, pointRect);

			e.preventDefault()
		}
		function onMouseMove(e) {
			if (! rectNode)
				return;

			drawRect(rectNode, initX, initY, e.pageX, e.pageY);

			var selectRect = rectangleCoords(initX, initY, e.pageX, e.pageY);
			callOnIntersect(options, selectRect);
		}
		function onMouseUp(e) {
			$(rectNode).remove();
			rectNode = null;
		}
		function onMouseOut(e) {
			onMouseUp(e);
		}
		function callOnIntersect(options, selectRect) {
			var scrollTop = $('body').scrollTop(),
				scrollBottom = scrollTop + window.innerHeight;

			options.selectors.forEach(function(selector) {
				var all = container.find(selector);
				
				for (var i = 0; i < all.length; ++i) {
					var $node = all.eq(i);
					var pos = $node.offset();

					var nodeInView = scrollTop <= pos.top && pos.top <= scrollBottom;
					var nodeInSelect = selectRect.y1 <= pos.top && pos.top <= selectRect.y2;

					if (nodeInView || nodeInSelect) {
						var width = $node.width();
						var height = $node.height();						

						var elementRect = rectangleCoords(pos.left, pos.top, pos.left + width, pos.top + height);

						var node = $node[0];

						if (rectsIntersect(selectRect, elementRect)) {
							nodeSelected[node.id] = true;
							options.enterArea(node);
						}
						else if (nodeSelected[node.id]) {
							nodeSelected[node.id] = false;
							options.exitArea(node);
						}
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
				'top': rect.y1 - $('body').scrollTop(),
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