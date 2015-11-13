var React = require('react');
var FileManagerActions = require('../actions/FileManagerActions');

var AreaSelect = selectors => element => {
  class AreaSelectComponent extends React.Component {
    componentDidMount() {
      this.container = $(this.refs.container.getDOMNode());
      this.containerWidth = this.container.width();
      this.rectNode = null;

      this.selectableElems = $(this.container)
        .find(selectors.join())
        .toArray();

      this.selectableOffsets = {};
      this.selectableElems.forEach(el => {
        this.selectableOffsets[el.id] = $(el).offset();
      });
 
      this.container.off('mousedown');
      this.container.off('mousemove');
      this.container.off('mouseup');
      this.container.off('mouseleave');
      
      this.container.on('mousedown', this.onMouseDown.bind(this));
      this.container.on('mousemove', this.onMouseMove.bind(this));
      this.container.on('mouseup', this.onMouseUp.bind(this));
      this.container.on('mouseleave', this.onMouseOut.bind(this));
    }

    render() {
      return React.cloneElement(element, {ref: 'container'});
    }
    
    onMouseDown(e) {
      if (e.which !== 1) // 1 == left button
        return;

      if (this.dotIsInAnyElement(e.pageX, e.pageY)) {
        return;
      }

      this.rectNode = this.createRectNode();
      this.x = e.pageX;
      this.y = e.pageY + this.container.scrollTop(); 
     
      FileManagerActions.unselectAllFiles();
      e.preventDefault()
    }

    onMouseMove(e) {
      if (! this.rectNode)
        return;
    
      var selectRect = rectangleCoords(this.x, this.y, e.pageX, e.pageY + this.container.scrollTop());
      this.drawRect(selectRect);
      this.callOnIntersect(selectRect);
    }

    onMouseUp(e) {
      $(this.rectNode).remove();
      this.rectNode = null;
    }

    onMouseOut(e) {
     this.onMouseUp(e);
    }

    nodeOffset(node) {
      return this.selectableOffsets[node.id];
    }
    
    dotIsInAnyElement(x, y) {
      var scrollTop = this.container.scrollTop(),
        scrollBottom = scrollTop + window.innerHeight;

      var dotRect = rectangleCoords(x, y + scrollTop, x + 1, y + scrollTop + 1);

      for (var i = 0; i < this.selectableElems.length; ++i) {
        var $node = $(this.selectableElems[i]);
        var pos = this.nodeOffset($node[0]);

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
    
    callOnIntersect(selectRect) {
      var scrollTop = this.container.scrollTop(),
        scrollBottom = scrollTop + window.innerHeight;

      this.selectableElems.forEach(function(node) {
        var $node = $(node);
        var pos = this.nodeOffset(node);

        var nodeInView = pos.top <= scrollBottom;
        var nodeInSelect = selectRect.y1 <= pos.top && pos.top <= selectRect.y2;

        if (nodeInView || nodeInSelect) {
          var width = $node.outerWidth();
          var height = $node.outerHeight();

          var elementRect = rectangleCoords(pos.left, pos.top, pos.left + width, pos.top + height);

          if (rectsIntersect(selectRect, elementRect)) {
            FileManagerActions.setFileSelection(node.id, true);
          }
          else {
            FileManagerActions.setFileSelection(node.id, false);
          }
        }
      }, this);
    }
 
    createRectNode() {
      var rectNode = $('<div/>');
      rectNode.css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': 0,
        'height': 0
      });
      rectNode.addClass('area-select');

      this.container.append(rectNode);
      return rectNode.get(0);
    }
    
    drawRect(rect) {
      $(this.rectNode).css({
        'top': rect.y0 - this.container.scrollTop(),
        'left': rect.x0,
        'width': rect.x1 - rect.x0,
        'height': rect.y1 - rect.y0
      });
    }
  }

  return <AreaSelectComponent/>
};

module.exports = AreaSelect;

function rectangleCoords(x0, y0, x1, y1) {
  var minX = Math.min(x0, x1),
    minY = Math.min(y0, y1),
    maxX = Math.max(x0, x1),
    maxY = Math.max(y0, y1);

  return {
    x0: minX,
    x1: maxX,
    y0: minY,
    y1: maxY
  };
}

function rectsIntersect(r1, r2) {
  return ! (
    r2.x0 > r1.x1 || 
    r2.x1 < r1.x0 || 
    r2.y0 > r1.y1 ||
    r2.y1 < r1.y0);
}
