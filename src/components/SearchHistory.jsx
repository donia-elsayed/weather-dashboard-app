import React, { Component } from "react";

export default class SearchHistory extends Component {
  render() {
    const { searches } = this.props;
    return (
      <div className="recent-searches">
        <h3 className="text-3xl font-bold mt-6 text-center text-white">
          Recent Searches
        </h3>
        <ul className="text-center my-4 text-white">
          {searches.length > 0 ? (
            searches.map((search, index) => <li key={index}>{search}</li>)
          ) : (
            <p>No recent searches</p>
          )}
        </ul>
      </div>
    );
  }
}
