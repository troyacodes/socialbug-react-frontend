import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import ToolButton from '../../util/ToolButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';
//Material UI Imports
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
//Icon imports
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
//Redux Imports
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../../redux/actions/userActions';

const styles = theme => ({
  ...theme.spreadIt
});

class Profile extends Component {
  handleImageChange = e => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };

  handleChangePicBtn = () => {
    const fileInput = document.getElementById('imgUpload');
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated
      }
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} alt="profile" className="profile-image" />
              <input type="file" id="imgUpload" onChange={this.handleImageChange} hidden="hidden" />
              <ToolButton tip="Change profile picture" onClick={this.handleChangePicBtn} btnClassName="button">
                <EditIcon color="primary" />
              </ToolButton>
            </div>
            <hr />
            <div className="profile-details">
              <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                {handle}
              </MuiLink>
              <hr />
              {bio && (
                <Typography variant="body1" className={classes.whiteText}>
                  {bio}
                </Typography>
              )}
              <hr />
              {location && (
                <Fragment>
                  {' '}
                  <LocationOn className={classes.greyText} />
                  <span className={classes.greyText}>{location}</span> <hr />
                </Fragment>
              )}
              {website && (
                <Fragment>
                  <LinkIcon className={classes.greyText} />
                  <a href={website} target="_blank" rel="noopener noreferrer" className={classes.greyText}>
                    {'  '}
                    {website}
                  </a>
                  <hr />
                </Fragment>
              )}
              <CalendarToday className={classes.greyText} /> <span className={classes.greyText}>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
            </div>
            <ToolButton tip="Logout" onClick={this.handleLogout}>
              <KeyboardReturn color="primary" />
            </ToolButton>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center" className={classes.whiteText}>
            Login or signup if you don't already have an account!
          </Typography>
          <div className={classes.buttons}>
            <Button variant="contained" color="secondary" component={Link} to="/login">
              Login
            </Button>
            <Button variant="contained" color="secondary" component={Link} to="/signup">
              Signup
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
