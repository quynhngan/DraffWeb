import React, { Component, Fragment } from 'react';
import Header from '../../components/Header';
import ProjectList from '../../components/ProjectList';
import Footer from '../../components/Footer';
class ProjectListPage extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <ProjectList />
        <Footer />
      </Fragment>
    );
  }
}

export default ProjectListPage;
