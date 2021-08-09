import React, { Component, Fragment } from 'react';
import ProjectDetail from '../../components/ProjectDetail';
class ProjectDetailPage extends Component {
  render() {
    return (
      <Fragment>
        <ProjectDetail id={this.props.match.params.id} />
      </Fragment>
    );
  }
}

export default ProjectDetailPage;
