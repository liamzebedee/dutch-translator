import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
    toggleWordFilter
} from '../actions';

import {
    getFilterColour
} from './colours';


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const FiltersView = ({ filters, toggleFilter }) => {
    return <div>
        <span className='filtersTitle'>Filters</span>

        <div className="filters">
            {Object.keys(filters).map((filterName, i) => {
                let filter = filters[filterName];

                return <div 
                    key={filterName}
                    className={classNames({ 
                        filter: true,
                        active: filter.shown,
                        btn: true,
                        'btn-secondary': true,
                        'btn-sm': true
                    })} 
                    onClick={() => toggleFilter(filterName)}
                    style={{
                        backgroundColor: filter.shown ? getFilterColour(i) : 'white'
                    }}>
                    { filterName.capitalize() }
                </div>
            })}
        </div>
    </div>
}

const mapStateToProps = state => {
    return {
        filters: state.wordFilters
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleFilter: filterName => {
            dispatch(toggleWordFilter(filterName))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FiltersView)