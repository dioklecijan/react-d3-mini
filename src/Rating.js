// @flow

import * as React from 'react';
import * as d3Selection from 'd3-selection';

// need to import d3-transition for the side-effect.
// This will extend the d3-selection Selection to expose
// the someSelection.transition(...)
// see https://github.com/tomwanzek/d3-v4-definitelytyped/issues/117
import 'd3-transition'; // flow-ignore

type P = {
  radius: number, // circle radius
  distance: number, // distance between circles
  min: number,
  max: number,
  value: number,
  width: number,
  height: number,
  textColor: string,
  selTextColor: string,
  circleColor: string,
  selCircleColor: string,
  onClick: ?(val: number) => mixed,
  text: boolean,
};

export default class Rating extends React.Component<P> {
  static defaultProps = {
    radius: 15, // circle radius
    distance: 5, // distance between circles
    min: 0,
    max: 10,
    value: 5,
    width: Rating.optimalWidth(0, 10, 15, 5),
    height: Rating.optimalHeight(15),
    textColor: 'white',
    selTextColor: 'white',
    circleColor: 'rgba(0,0,0,0.5)',
    selCircleColor: 'darkred',
    onClick: null,
    displayText: true,
  };
  svg: ?Element; //SVGElement;

  /**
   * Calculates optimal control size
   *
   * @static
   * @param {number} min minimum value
   * @param {number} max maximum value
   * @param {number} r radius
   * @param {number} d distance between two values
   * @returns {width: number, height:number} Control dimensions
   */
  static optimalSize(min: number, max: number, r: number, d: number) {
    return {
      width: Rating.optimalWidth(min, max, r, d),
      height: Rating.optimalHeight(r),
    };
  }

  static optimalWidth(min: number, max: number, r: number, d: number) {
    return (max - min + 1) * 2 * r + (max - min) * d + 2 * r;
  }

  static optimalHeight(r: number) {
    return 4 * r;
  }

  componentDidMount() {
    this.draw();
  }
  componentDidUpdate() {
    this.draw();
  }

  draw = () => {
    const {radius, distance, onClick, value} = this.props;
    let data = new Array(this.props.max - this.props.min + 1); // [min, max]
    let counter = 0;
    for (let i = this.props.min; i <= this.props.max; i++) {
      data[counter++] = i;
    }
    let duration = 2000;
    // value in range
    let inRange = value >= this.props.min && value <= this.props.max;

    let svg = d3Selection.select(this.svg);

    // circles enter
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .on('click', d => (onClick ? onClick(d) : null))
      .style('cursor', d => (onClick ? 'pointer' : 'default'))
      .attr('r', radius)
      .attr('fill', 'rgba(0,0,0,0.5)')
      .attr('cy', this.props.height / 2)
      .attr('cx', (d, i) => i * (2 * radius + distance) + radius)
      .attr('r', 0)
      .attr('fill', 'white')
      .transition()
      .duration(duration)
      .attr('fill', 'rgba(0,0,0,0.5)');

    // circles update
    svg
      .selectAll('circle')
      .data(data)
      .transition()
      .duration(duration)
      .attr('r', d => (d === value ? 2 * radius : radius))
      .attr(
        'fill',
        d => (d === value ? this.props.selCircleColor : this.props.circleColor),
      )
      .attr('cx', (d, i) => {
        let base = i * (2 * radius + distance) + radius;
        if (inRange) {
          if (d < value) return base;
          if (d === value) return base + radius;
          if (d > value) return base + 2 * radius;
        }
        return base;
      });

    // circle exit
    svg
      .selectAll('circle')
      .data(data)
      .exit()
      .remove();

    if (!this.props.displayText) return;

    // text enter
    svg
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .on('click', d => (onClick ? onClick(d) : null))
      .style('cursor', d => (onClick ? 'pointer' : 'default'))
      .attr('y', this.props.height / 2)
      .attr('x', (d, i) => i * (2 * radius + distance) + radius)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-family', 'sans-serif')
      .attr('fill', this.props.textColor)
      .text(d => d)
      .transition()
      .duration(duration)
      .style('font-size', radius + 'px');

    // text update
    svg
      .selectAll('text')
      .data(data)
      .transition()
      .duration(duration)
      .style('font-size', d => (d === value ? 2 * radius : radius) + 'px')
      .attr(
        'fill',
        d => (d === value ? this.props.selTextColor : this.props.textColor),
      )
      .attr('x', (d, i) => {
        let base = i * (2 * radius + distance) + radius;
        if (inRange) {
          if (d < value) return base;
          if (d === value) return base + radius;
          if (d > value) return base + 2 * radius;
        }
        return base;
      });

    // text exit
    svg
      .selectAll('text')
      .data(data)
      .exit()
      .remove();
  };

  render() {
    const {height, width} = this.props;
    return <svg ref={e => (this.svg = e)} width={width} height={height} />;
  }
}
