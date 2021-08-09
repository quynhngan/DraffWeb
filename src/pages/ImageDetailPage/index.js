import React, { Component, Fragment } from 'react';
import ImageDetail from '../../components/ImageDetail';
class ImageDetailPage extends Component {
  render() {
    return (
      <Fragment>
        <ImageDetail id={this.props.match.params.id} />
      </Fragment>
    );
  }
}

export default ImageDetailPage;
