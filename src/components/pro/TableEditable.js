import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './DataTable.css';

class TableEditable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
    this.addRow = this.addRow.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.move = this.move.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  addRow() {
    let newData = JSON.parse(JSON.stringify(this.state.data));
    let newDataLength = newData.length;
    let newRow = JSON.parse(JSON.stringify(newData[newDataLength - 1]));
    newData.push(newRow);
    this.setState({
      data: newData
    })
  }

  removeRow(index) {
    this.state.data.splice(index, 1);
    let newData = JSON.parse(JSON.stringify(this.state.data));
    this.setState({
      data: newData
    })
  }

  move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);  
   return arr;
  }

  moveUp(index) {
    if (index == 0) return;
    let newData = JSON.parse(JSON.stringify(this.state.data));
    this.move(newData, index, index - 1);
    this.setState({
      data: newData
    })
  }

  moveDown(index) {
    if (index == this.state.data.length - 1) return;
    let newData = JSON.parse(JSON.stringify(this.state.data));
    this.move(newData, index, index + 1);
    this.setState({
      data: newData
    })
  };

  onInput(trIndex, tdIndex, e) {
    let value = e.target.innerText;
    this.state.data[trIndex][tdIndex] = value;
    console.log(this.state.data);
  }

  render() {
    const {
      className,
      small,
      bordered,
      striped,
      hover,
      data,
      columns,
      responsive,
      responsiveSm,
      responsiveMd,
      responsiveLg,
      responsiveXl,
      ...attributes
    } = this.props;

    const classes  = classNames(
      'table',
      small && 'table-sm',
      bordered && 'table-bordered',
      striped && 'table-striped',
      hover && 'table-hover',
      className
    );

    const wrapperClasses = classNames(
      'table-editable text-center',
      responsive && 'table-responsive',
      responsiveSm && 'table-responsive-sm',
      responsiveMd && 'table-responsive-md',
      responsiveLg && 'table-responsive-lg',
      responsiveXl && 'table-responsive-xl'
    );

    return (
      <div className={wrapperClasses}>
        <span onClick={ this.addRow } className="table-add float-right mb-3 mr-2"><a href="#!" className="text-success"><i className="fa fa-plus fa-2x" aria-hidden="true"></i></a></span>
        <table {...attributes} className={classes}>
          <thead>
            <tr>
              {this.props.columns.map((th, i) => {
                return (
                  <th key={i}>
                    { th }
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((tr, i) => {
              return (
                <tr key={i}>
                  { tr.map((td, j) => {
                    return (
                      <td key={j} contentEditable suppressContentEditableWarning="true" onInput={(e) => this.onInput(i, j, e)}>
                        { td }
                      </td>
                    );
                  })}
                  <td>
                    <span onClick={() => this.moveUp(i)} className="table-up"><a href="#!" className="indigo-text"><i className="fa fa-long-arrow-up" aria-hidden="true"></i></a></span>
                    <span onClick={() => this.moveDown(i)} className="table-down"><a href="#!" className="indigo-text"><i className="fa fa-long-arrow-down" aria-hidden="true"></i></a></span>
                  </td>
                  <td>
                    <span onClick={() => this.removeRow(i)} className="table-remove"><button type="button" className="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

TableEditable.propTypes = {
  className: PropTypes.string,
  small: PropTypes.bool,
  bordered: PropTypes.bool,
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  data: PropTypes.array,
  columns: PropTypes.array,
  children: PropTypes.node,
  responsive: PropTypes.bool,
  responsiveSm: PropTypes.bool,
  responsiveMd: PropTypes.bool,
  responsiveLg: PropTypes.bool,
  responsiveXl: PropTypes.bool
};

export default TableEditable;
export { TableEditable as MDBTableEditable };

