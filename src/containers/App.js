import { connect } from "react-redux";
import AppComponent from "../components/App/App";
import { codeChanged } from "../actions";

const mapStateToProps = state => Object.assign({}, state);

const mapDispatchToProps = dispatch => {
  return {
    setChangedCode(editor, data, code) {
      dispatch(codeChanged(code));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
